'use strict';

const genSVG = require('onml/gen-svg.js');
const stringify = require('onml/stringify.js');

const formatTime = require('./format-time.js');
const getT = require('./get-t.js');

const round10 = n =>
  ([
  /*0  1  2  3  4  5  6  7  8   9 */
    0, 1, 2, 4, 4, 5, 5, 5, 10, 10,
    /*10  11  12  13  14  15  16  17  18  19 */
    10, 10, 10, 15, 15, 15, 15, 20, 20, 20
  ])[Math.round(n)]
  || Math.round(n);

const getTimeGrid = pstate => {
  const { sidebarWidth, width, height, timescale, xScale, tgcd, xOffset, topBarHeight, botBarHeight } = pstate;
  const fontHeight = 16;
  // const timeLineStart = (xOffset * width / 2) |0;

  const timeGrid = ['g', {}];

  const xStartExact = getT(sidebarWidth, pstate);
  const xFinishExact = getT(width, pstate);
  const density = 1;
  const xLines = Math.round(density * width / sidebarWidth);

  const xStep = ((xFinishExact - xStartExact) / xLines);
  const xExp = Math.pow(10, Math.log10(xStep) |0);
  const xDelta = round10(xStep / xExp) * xExp;

  const xStart = Math.ceil(xStartExact / xDelta) * xDelta;
  const xFinish = Math.floor(xFinishExact / xDelta) * xDelta;

  for (let t = xStart; t <= xFinish; t += xDelta) {
    const x = Math.round(t / tgcd * xScale + xOffset);
    timeGrid.push(['g', {},
      ['line', {
        class: 'wd-grid-time',
        x1: x,
        x2: x,
        y2: height
      }],
      ['text', {
        class: 'wd-grid-time',
        x: x,
        y: (topBarHeight + fontHeight) / 2
      }, formatTime(t, timescale)],
      ['text', {
        class: 'wd-grid-time',
        x: x,
        y: height - (botBarHeight - fontHeight) / 2
      }, formatTime(t, timescale)]
    ]);
  }

  return timeGrid;
};

const pluginRenderTimeGrid = (desc, pstate, els) => {
  const {width, height} = pstate;
  const ml = genSVG(width, height);
  ml.push(getTimeGrid(pstate));
  els.grid.innerHTML = stringify(ml);
};

module.exports = pluginRenderTimeGrid;
