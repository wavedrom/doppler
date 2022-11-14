'use strict';

const getX = require('./get-x.js');

/* Zones
1  2  3
4  5  6
7  8  9
*/

// Colors map mapping single letter codes to common colors.
const colorMap = new Map();
colorMap.set('r', 'red');
colorMap.set('g', 'green');
colorMap.set('b', 'blue');
colorMap.set('c', 'cyan');
colorMap.set('m', 'magenta');
colorMap.set('y', 'yellow');

const vline = (lane, pstate, i) => {
  const {width, height, timescale, yStep, yOffset, topBarHeight, botBarHeight} = pstate;
  const y = (i + .7) * yStep - yOffset;
  const t = lane.value * Math.pow(10, lane.mult - timescale);
  const x = getX(pstate, t);
  const yMax = height - topBarHeight - botBarHeight;

  // See if we have a valid color code...
  let style = '';
  if (colorMap.has(lane.label)) {
    style = 'fill:'+colorMap.get(lane.label)+'; stroke:'+colorMap.get(lane.label);
  } else if (CSS.supports('color', lane.label) ) {
    style = 'fill:'+lane.label+'; stroke:'+lane.label;
  }

  if ((x < 0) || (x > width)) {
    if ((y < 0) || (y > yMax)) { // Zones: 1, 7, 3, 9
      return ['g'];
    }
    if (x < 0) { // Zone: 4
      return ['path', {class: 'wd-vline', style: style, d: `M ${0} ${y} l 8 -4 v 8 z`}];
    }
    // Zone: 6
    return ['path', {class: 'wd-vline', style: style, d: `M ${width - 16} ${y} l -8 -4 v 8 z`}];
  }

  const line = ['line', {class: 'wd-vline', style: style, x1: x, x2: x, y1: 0, y2: height}];

  if (y < 0) { // Zone: 2
    return ['g', line, ['path', {class: 'wd-vline', style: style, d: `M ${x} ${topBarHeight} l 4 8 h -8 z`}]];
  }
  if (y > yMax) { // Zone: 8
    return ['g', line, ['path', {class: 'wd-vline', style: style, d: `M ${x} ${yMax} l -4 -8 h 8 z`}]];
  }
  // Zone: 5
  return ['g', line, ['path', {class: 'wd-vline', style: style, d: `M ${x} ${y} m-4 0 l 4 -4 l 4 4 l -4 4 z`}]];
};

module.exports = vline;
