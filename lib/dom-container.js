'use strict';

const genRenderWavesGL = require('./gen-render-waves-gl.js');
const renderCursor = require('./render-cursor.js');
const genResizeHandler = require('./gen-resize-handler.js');
const mTree = require('./mount-tree.js');

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


const domContainer = (obj) => {

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

  const elo = mTree.createElemento(obj.elemento);
  const container = mTree.createContainer(elo, obj.layers);
  elo.container.tabIndex = '0';

  return {
    elo,
    pstate,
    start: (content, deso /* , opt */) => {

      content.appendChild(container);

      getFullView(deso);

      deso.t0 = deso.t0 || 0;
      // desc.xScale |= 8;

      Object.assign(pstate, {
        tgcd: deso.tgcd,
        timescale: deso.timescale,
        xScale: deso.xScale || 8,
        numLanes: deso.view.length,
        t0: deso.t0,
        time: deso.time
      });

      try {
        const str = localStorage.getItem('vcdrom');
        const obj = JSON.parse(str);
        Object.assign(pstate, obj);
      } catch(err) {
        console.error(err);
      }

      // const {timetopSVG, timebotSVG} = timeline(deso);

      if (deso.timeOpt) {
        setTime(pstate, deso.timeOpt.value);
      }

      let render2 = genRenderWavesGL(elo);
      let render1 = render2(deso);
      let render = render1(pstate, obj.renderPlugins);

      const resizeHandler = genResizeHandler(pstate);

      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          const {width, height} = entry.contentRect;
          resizeHandler(width, height);
        }
        render();
      });

      resizeObserver.observe(elo.container);

      // pinchAndZoom(els.container, content, pstate, render);
      resizeHandler(elo.container.clientWidth, elo.container.clientHeight);
      mouseMoveHandler(elo.cursor, elo.container, pstate, render);
      render();
      return {
        render
      };
    }
  };
};

module.exports = domContainer;

/* eslint-env browser */
