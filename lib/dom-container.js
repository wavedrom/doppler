'use strict';

const CodeMirror = require('codemirror');
const genSVG = require('onml/gen-svg.js');
const stringify = require('onml/stringify.js');

const genKeyHandler = require('./gen-key-handler.js');
const genRenderWavesGL = require('./gen-render-waves-gl.js');
const genOnWheel = require('./gen-on-wheel.js');
const formatTime = require('./format-time.js');

const mouseMoveHandler = (cursor, content, pstate /* , render */) => {
  const xmargin = 40;
  const fontHeight = 20;
  const fontWidth = fontHeight / 2;
  const handler = event => {
    const { width, height, xScale, xOffset, tgcd, timescale } = pstate;
    let x = event.clientX;
    const xx = Math.round((x - xOffset * width / 2) / xScale * 2) * tgcd;
    pstate.xCursor = x;
    const label = formatTime(xx, timescale);
    const lWidth = (label.length + 1) * fontWidth;
    const ml = genSVG(2 * xmargin, height).concat([
      ['line', {
        class: 'wd-cursor-line',
        x1: xmargin + 0.5,
        x2: xmargin + 0.5,
        y1: 0,
        y2: height
      }],
      ['rect', {
        class: 'wd-cursor-time',
        x: xmargin - lWidth / 2,
        y: 0,
        width: lWidth,
        height: fontHeight * 1.25
      }],
      ['text', {
        class: 'wd-cursor-time',
        x: xmargin,
        y: fontHeight
      }, label],
      ['rect', {
        class: 'wd-cursor-time',
        x: xmargin - lWidth / 2,
        y: height - fontHeight * 1.25,
        width: lWidth,
        height: fontHeight * 1.25
      }],
      ['text', {
        class: 'wd-cursor-time',
        x: xmargin,
        y: height - fontHeight * .25
      }, label]
    ]);
    cursor.style.left = (x - xmargin) + 'px';
    cursor.innerHTML = stringify(ml);
  };
  handler({clientX: pstate.width / 2});
  content.addEventListener('mousemove', handler);
};

// const getWaves = (obj) => {
//   const chango = obj.chango || {};
//   const view = obj.view;
//   if (view !== undefined) {
//     return view.map(e => e && e.ref && chango[e.ref]);
//   }
//   return Object.keys(chango).map(e => chango[e]);
// };

// const mainGL = (desc, pstate, parent) => {
//   const waves = getWaves(desc);
//   const w = (((desc.time - desc.t0) * pstate.scale) |0) + 200 + 1;
//   const h = waves.length * lane.step + 8;
//
//   const cnvs = document.createElement('canvas');
//   parent.replaceChildren(cnvs);
//   cnvs.width = w;
//   cnvs.height = h;
//   cnvs.style = 'background-color: #111;';
//   renderWavesGL(waves, cnvs, pstate);
// };

// const sidebarSVG = (desc, pstate) =>
//   genSVG(pstate.sidebarWidth, desc.view.length * (pstate.yStep / 2 + 1))
//     .concat(
//       desc.view.map((e, i) => {
//         if ((e === null) || (typeof e !== 'object') || (e.name === undefined)) {
//           const y = pstate.yStep / 2 * (i + 1.2);
//           return ['line', {
//             class: 'spacer',
//             x1: 5, x2: pstate.sidebarWidth - 5,
//             y1: y, y2: y
//           }];
//         }
//         return ['text', {class: 'txt', x: 10, y: pstate.yStep / 2 * (i + 1.4)}, e.name];
//       })
//     );

const createElements = els => {
  const names = Object.keys(els);
  return names.reduce((res, name) => {
    const ml = els[name];
    const el = document.createElement(ml[0]);
    const attr = (typeof ml[1] === 'object') ? ml[1] : {};
    attr.class && el.classList.add(attr.class);
    attr.style && el.setAttribute('style', attr.style);
    res[name] = el;
    return res;
  }, {});
};


const getFlatView = desc => {

  const refo = {}; // ref: name
  const nemo = {}; // name: ref

  const rec = obj => {
    Object.keys(obj).map(name => {
      const ref = obj[name];
      if (typeof ref === 'object') {
        return rec(ref);
      }
      if (typeof ref !== 'string') {
        throw new Error();
      }
      if (refo[ref] === undefined) {
        refo[ref] = name;
      }
      if (nemo[name] === undefined) {
        nemo[name] = ref;
        return;
      }
      if (nemo[name] === ref) {
        // console.log('exact duplicate ' + name);
        return;
      }
      // console.log('same name ' + name);
    });
  };
  rec(desc.wires);
  desc.sigo = nemo;
  desc.view = Object.keys(nemo).map(name => ({name, ref: nemo[name]}));
  if (desc.waveql) {
    return;
  }
  desc.waveql = desc.view.map(e => e && e.name || '---').join('\n');
};

module.exports = (content, desc /* , opt */) => {

  getFlatView(desc);

  desc.t0 = desc.t0 || 0;
  desc.xScale |= 8;
  const pstate = {
    // width: 1024,
    // height: 1024,
    tgcd: desc.tgcd,
    timescale: desc.timescale,
    xScale: desc.xScale,
    xScaleMax: 1000,
    // xScaleMin: 1,
    // xOffset: 0,
    yOffset: 0,
    yStep: 48,
    yDuty: 0.7,
    sidebarWidth: 220,
    numLanes: desc.view.length,
    t0: desc.t0,
    time: desc.time
  };
  // pstate.xOffset = (2 * (pstate.width - pstate.sidebarWidth)) / pstate.time;

  // const {timetopSVG, timebotSVG} = timeline(desc);

  const els = createElements({
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
      class: 'wd-cursor',
      // style: 'position: absolute; top: 0px; left: 0px;'
      // style: 'overflow: hidden; position: absolute; top: 0px; left: 0px;'
    }],
    sidebar: ['textarea', {}]
  });

  [
    els.values,
    els.view0,
    els.cursor,
    els.sidebar
  ]
    .map(e => els.container.appendChild(e));

  content.appendChild(els.container);

  let render2 = genRenderWavesGL(els.view0, els.sidebar, els.values);
  let render1 = render2(desc);
  let render = render1(pstate);
  //  => {
  //   const t0 = Date.now();
  //   mainGL(desc, pstate, els.view0);
  //   console.log('render time: ' + (Date.now() - t0));
  // };

  els.sidebar.innerHTML = desc.waveql;

  const cm = CodeMirror.fromTextArea(els.sidebar, {
    theme: 'blackboard',
    mode: 'yaml',
    // lineNumbers: true,
    autofocus: true,
    scrollbarStyle: null,
    styleActiveSelected: true,
    styleActiveLine: true,
//    styleSelectedText: true,
    viewportMargin: Infinity
  });

  cm.on('scroll', cm => {
    const info = cm.getScrollInfo();
    // console.log(info);
    pstate.yOffset = 2 * info.top / info.clientHeight;
    render();
  });

  const onCmChange = cm => {
    const str = cm.getValue();
    const arr = str.split('\n');
    desc.view = arr.map(e => {
      e = e.trim();
      if (desc.sigo[e]) {
        return {name: e, ref: desc.sigo[e]};
      }
      return null;
    });
    render();
  };

  cm.on('change', onCmChange);
  onCmChange(cm);

  els.container.tabIndex = '0';
  els.container.addEventListener('keydown', genKeyHandler(content, pstate, render, cm));
  els.container.addEventListener('wheel', genOnWheel(content, pstate, render, cm));

  // els.container.addEventListener('mousemove', event => {
  //   console.log(event);
  // }, false);

  const resizeHandler = (width, height) => {
    let {xScale, yStep, yOffset, time, sidebarWidth, numLanes} = pstate;

    pstate.width = width;
    pstate.height = height;

    const yOffsetMax = (numLanes + 2) * yStep / height - 2;
    if (yOffsetMax < 0) { yOffset = 0; } else
    if (yOffset > yOffsetMax) { yOffset = yOffsetMax; }
    pstate.yOffset = yOffset;

    const xScaleMin = pstate.xScaleMin = (2 * (width - sidebarWidth)) / time;
    if (xScale < xScaleMin) { xScale = xScaleMin; }
    pstate.xScale = xScale;

    pstate.sidebarOffset = 2 * sidebarWidth / width;
    pstate.xOffset = pstate.sidebarOffset;
  };

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
};

/* eslint-env browser */
