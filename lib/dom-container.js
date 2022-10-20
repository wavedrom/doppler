'use strict';

const CodeMirror = require('codemirror');
const waveql = require('./waveql.js');

require('codemirror/addon/fold/foldcode.js');
require('codemirror/addon/fold/foldgutter.js');
require('codemirror/addon/fold/brace-fold.js');
require('codemirror/addon/hint/show-hint.js');
// require('codemirror/addon/fold/xml-fold.js');

const genKeyHandler = require('./gen-key-handler.js');
const genRenderWavesGL = require('./gen-render-waves-gl.js');
const genOnWheel = require('./gen-on-wheel.js');
const renderCursor = require('./render-cursor.js');
const genResizeHandler = require('./gen-resize-handler.js');
const renderMenu = require('./render-memu.js');


const setTime = (pstate, str) => {
  // const { sidebarOffset, time, timescale, tgcd, xOffset } = pstate;
  // pstate.xOffset = .5; // (2 * (pstate.width - pstate.sidebarWidth)) / pstate.time;
  const m = str.match(/(\d+)(\w+)/); if (m) {
    // const time1 = parseInt(m[1]);
    // const timescale1 = ({s: 0, ms: -3, us: -6, ns: -9, ps: -12, fs: -15})[m[2]] || 0;
    // pstate.xOffset = -1;
  }
};

const mouseMoveHandler = (cursor, content, pstate /* , render */) => {
  const xmargin = 160;
  const fontHeight = 20;
  const fontWidth = fontHeight / 2;
  const handler = event => {
    const x = pstate.xCursor = event.clientX;
    cursor.style.left = (x - xmargin) + 'px';
    cursor.innerHTML = renderCursor({xmargin, fontWidth, fontHeight}, pstate);
  };
  handler({clientX: pstate.width / 2});
  content.addEventListener('mousemove', handler);
};

const createElements = els => {
  const names = Object.keys(els);
  return names.reduce((res, name) => {
    const ml = els[name];
    const el = document.createElement(ml[0]);
    const attr = (typeof ml[1] === 'object') ? ml[1] : {};
    Object.keys(attr).map(key => {
      if (key === 'class') {
        el.classList.add(attr.class);
      } else {
        el.setAttribute(key, attr[key]);
      }
    });
    res[name] = el;
    return res;
  }, {});
};

const getFullView = desc => {
  if (desc.waveql) {
    return;
  }

  const arr = [];

  const rec = obj => {
    Object.keys(obj).map(name => {
      const ref = obj[name];
      if (typeof ref === 'object') {
        arr.push(name);
        rec(ref);
        arr.push('..');
        return;
      }
      if (typeof ref !== 'string') {
        throw new Error();
      }
      arr.push(name);
    });
  };

  rec(desc.wires);

  desc.waveql = arr.join('\n');
};


const domContainer = () => {

  const sidebarWidth = 320;

  const pstate = {
    width: 1024, // [px] window width
    height: 1024, // [px] window height
    xScaleMax: 1000,
    // xScaleMin: 1,
    xOffset: sidebarWidth,
    yOffset: 0, // [px]
    yStep: 48, // [px] wave lane height
    yDuty: 0.7,
    sidebarWidth
  };

  const renderPlugins = [];

  const elemento = {
    container: ['div', {
      class: 'wd-container'
    }],
    view0: ['div', {
      class: 'wd-view',
      style: 'position: absolute; left: 0px;' // z-index: -10'
    }],
    values: ['div', {
      class: 'wd-values',
      style: 'position: absolute; left: 0px;' // z-index: -9'
    }],
    cursor: ['div', {
      class: 'wd-cursor'
      // style: 'position: absolute; top: 0px; left: 0px;'
      // style: 'overflow: hidden; position: absolute; top: 0px; left: 0px;'
    }],
    sidebar: ['textarea', {}],
    menu: ['div', {
      class: 'wd-menu',
      style: 'position: absolute; right: 32px; bottom: 32px;'
    }]
  };

  const layers = [
    'cursor',
    'view0',
    'values',
    'sidebar',
    'menu'
  ];

  const keyBindo = {};

  return {
    pstate,
    elemento,
    layers,
    renderPlugins,
    keyBindo,
    start: (content, desc /* , opt */) => {

      getFullView(desc);

      desc.t0 = desc.t0 || 0;
      // desc.xScale |= 8;

      pstate.tgcd = desc.tgcd;
      pstate.timescale = desc.timescale;
      pstate.xScale = desc.xScale || 8;
      pstate.numLanes = desc.view.length;
      pstate.t0 = desc.t0;
      pstate.time = desc.time;

      ['xOffset', 'yOffset', 'xScale'].map(key => {
        const val = localStorage.getItem('pstate.' + key);
        if (val) {
          pstate[key] = Number(val);
        }
      });

      // const {timetopSVG, timebotSVG} = timeline(desc);

      if (desc.timeOpt) {
        setTime(pstate, desc.timeOpt.value);
      }

      const els = createElements(elemento);

      layers.map(layer => els.container.appendChild(els[layer]));

      content.appendChild(els.container);

      els.menu.innerHTML = renderMenu();

      let render2 = genRenderWavesGL(els);
      let render1 = render2(desc);
      let render = render1(pstate, renderPlugins);

      els.sidebar.innerHTML = desc.waveql;

      waveql.cmMode(CodeMirror, desc);
      // waveql.cmHint(CodeMirror, desc);

      const cm = CodeMirror.fromTextArea(els.sidebar, {
        extraKeys: {'Ctrl-Space': 'autocomplete'},
        theme: 'waveql',
        mode: 'text/x-waveql',
        // lineNumbers: true,
        lineWrapping: false,
        tabSize: 2,
        autofocus: true,
        scrollbarStyle: null,
        styleActiveSelected: true,
        // styleActiveLine: true,
        styleActiveLine: {nonEmpty: true},
        // styleSelectedText: true,
        viewportMargin: Infinity,
        foldGutter: true,
        hintOptions: {hint: waveql.cmHint(CodeMirror, desc)},
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
      });

      cm.scrollTo(null, pstate.yOffset);

      cm.on('scroll', cm => {
        const info = cm.getScrollInfo();
        pstate.yOffset = info.top;
        render();
      });

      const parser = waveql.parser(desc.wires);

      const onCmChange = cm => {
        const str = cm.getValue();
        desc.view = parser(str);
        pstate.numLanes = desc.view.length;
        render();
      };

      cm.on('change', onCmChange);
      onCmChange(cm);

      els.container.tabIndex = '0';
      els.container.addEventListener('keydown', genKeyHandler(content, pstate, render, cm, keyBindo));
      els.container.addEventListener('wheel', genOnWheel(content, pstate, render, cm, keyBindo));

      const resizeHandler = genResizeHandler(pstate);

      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          const {width, height} = entry.contentRect;
          resizeHandler(width, height);
        }
        render();
      });

      resizeObserver.observe(els.container);

      // pinchAndZoom(els.container, content, pstate, render);
      resizeHandler(els.container.clientWidth, els.container.clientHeight);
      mouseMoveHandler(els.cursor, els.container, pstate, render);
      render();

      return {
        render
      };
    }
  };
};

module.exports = domContainer;

/* eslint-env browser */
