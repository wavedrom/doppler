'use strict';

const genRenderWavesGL = require('./gen-render-waves-gl.js');
const renderCursor = require('./render-cursor.js');
const genResizeHandler = require('./gen-resize-handler.js');
const mTree = require('./mount-tree.js');
const helpPanel = require('./help-panel.js');

const setTime = (pstate, str) => {
  // const { sidebarOffset, time, timescale, tgcd, xOffset } = pstate;
  // pstate.xOffset = .5; // (2 * (pstate.width - pstate.sidebarWidth)) / pstate.time;
  const m = str.match(/(\d+)(\w+)/); if (m) {
    // const time1 = parseInt(m[1]);
    // const timescale1 = ({s: 0, ms: -3, us: -6, ns: -9, ps: -12, fs: -15})[m[2]] || 0;
    // pstate.xOffset = -1;
  }
};

const genCursorHandler = (cursor, pstate) => {
  // TODO remove duplication with plugin-render-cursor.js
  const xmargin = 160;
  const fontHeight = 20;
  const fontWidth = fontHeight / 2;
  return (event) => {
    if (event) {
      pstate.xCursor = event.clientX;
      const x = pstate.xCursor = event.clientX;
      cursor.style.left = (x - xmargin) + 'px';
    }
    cursor.innerHTML = renderCursor({xmargin, fontWidth, fontHeight}, pstate);
  };
};

const getFullView = desc => {
  if (desc.waveql) {
    return;
  }

  const arr = [];

  const rec = ero => {
    if (ero.kind === 'scope') {
      arr.push(ero.name);
      ero.body.map(rec);
      arr.push('..');
      return;
    }
    if (ero.kind === 'var') {
      arr.push(ero.name);
      return;
    }
    console.error(ero);
    throw new Error();
    // Object.keys(obj).map(name => {
    //   const ref = obj[name];
    //   if (typeof ref === 'object') {
    //     arr.push(name);
    //     rec(ref);
    //     arr.push('..');
    //     return;
    //   }
    //   if (typeof ref !== 'string') {
    //     throw new Error();
    //   }
    //   arr.push(name);
    // });
  };

  rec(desc.wires);

  desc.waveql = arr.join('\n');
};


const domContainer = (obj) => {

  const sidebarWidth = 256;

  const fontHeight = 16;

  const elo = mTree.createElemento(obj.elemento);
  const container = mTree.createContainer(elo, obj.layers);
  elo.container.tabIndex = '0';
  if (obj.pluginRightPanel) {
    obj.pluginRightPanel(elo);
  }

  const pstate = {
    fontHeight,
    width: 1024, // [px] window width
    height: 1024, // [px] window height
    topBarHeight: fontHeight * 1.5, // [px]
    botBarHeight: fontHeight * 1.5, // [px]
    xOffset: sidebarWidth,
    yOffset: 0, // [px]
    yStep: fontHeight * 1.5, // = 24 // [px] wave lane height
    yDuty: 0.7,
    sidebarWidth,
    rightPanelWidth: helpPanel.width,
    rightPanelVisible: false,
    container
  };

  return {
    elo,
    pstate,
    start: (deso /* , opt */) => {

      // content.appendChild(container);
      // content.appendChild(elo.rightPanel);
      getFullView(deso);

      deso.t0 = deso.t0 || 0;
      deso.tgcd = deso.tgcd || 1;
      deso.time = deso.time || 0;
      // desc.xScale |= 8;

      Object.assign(pstate, {
        tgcd: deso.tgcd,
        timescale: deso.timescale,
        xScale: deso.xScale || 8,
        numLanes: deso.view.length,
        t0: deso.t0,
        time: deso.time
      });

      // try {
      //   const str = localStorage.getItem('vcdrom');
      //   const obj = JSON.parse(str);
      //   console.log('localStore Get "vcdrom"', obj);
      //   Object.assign(pstate, obj);
      //   console.log('pstate', pstate);
      // } catch(err) {
      //   console.error(err);
      // }

      // const {timetopSVG, timebotSVG} = timeline(deso);

      if (deso.timeOpt) {
        setTime(pstate, deso.timeOpt.value);
      }

      let render2 = genRenderWavesGL(elo);
      let render1 = render2(deso);
      let render = render1(pstate, obj.renderPlugins);
      deso.render = render;

      const resizeHandler = genResizeHandler(pstate);
      const cursorHandler = genCursorHandler(elo.cursor, pstate);

      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          let {width, height} = entry.contentRect;
          console.log(entry);
          // height = height || 888;
          // console.log('resizeObserver', width, height);
          resizeHandler(width, height);
        }
        deso.render();
      });

      resizeObserver.observe(elo.container);
      elo.container.addEventListener('mousemove', cursorHandler);

      // pinchAndZoom(els.container, content, pstate, render);
      resizeHandler(elo.container.clientWidth, elo.container.clientHeight);
      cursorHandler({clientX: pstate.width / 2});
      deso.render();
    }
  };
};

module.exports = domContainer;

/* eslint-env browser */
