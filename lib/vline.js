'use strict';

const getX = require('./get-x.js');
const onml = require('onml');
const vlineStylo = require('./vline-stylo.js');

/* Zones
1  2  3
4  5  6
7  8  9
*/

const vline = (lane, pstate, i) => {
  const {width, height, timescale, yStep, yOffset, topBarHeight, botBarHeight} = pstate;
  const y = (i + .7) * yStep - yOffset;
  const yMax = height - topBarHeight - botBarHeight;

  return lane.vlines.map(vline => {
    const t = vline.value * Math.pow(10, vline.mult - timescale);
    const x = Math.round(getX(pstate, t));
    const style = (vlineStylo[vline.style] || vlineStylo.w);
    const color = `hsl(${style.h},100%,${style.l}%)`;
    const symbol = ['path', {style: 'stroke-width: 1px; stroke: ' + color}];

    if ((x < 0) || (x > width)) {
      if ((y < 0) || (y > yMax)) { // Zones: 1, 7, 3, 9
        return ['g'];
      }
      if (x < 0) { // Zone: 4
        symbol[1].d = `M ${0} ${y} l 8 -4 v 8 z`;
        return symbol;
      }
      // Zone: 6
      symbol[1].d = `M ${width - 16} ${y} l -8 -4 v 8 z`;
      return symbol;
    }

    const line = ['g', onml.tt(x, 0),
      ['rect', {x: -1, width: 3, height, fill: '#fff', filter: 'url(#neonGlow-' + vline.style + ')'}],
      ['rect', {width: 1, height, fill: color}]
    ];

    if (y < 0) { // Zone: 2
      symbol[1].d = `M ${x} ${topBarHeight} l 4 8 h -8 z`;
      return ['g', line, symbol];
    }
    if (y > yMax) { // Zone: 8
      symbol[1].d = `M ${x} ${yMax} l -4 -8 h 8 z`;
      return ['g', line, symbol];
    }
    // Zone: 5
    symbol[1].d = `M ${x} ${y} m-4 0 l 4 -4 l 4 4 l -4 4 z`;
    return ['g', line, symbol];
  });
};

module.exports = vline;
