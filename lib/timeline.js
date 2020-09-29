'use strict';

const range = require('lodash.range');

const genSVG = require('./gen-svg.js');
const tt = require('./tt.js');

const style = 'stroke: #fff; fill: none; stroke-width: 1px; stroke-linecap: square;';

const getDelta = timeScale => {
  const logScale = Math.log2(timeScale);
  console.log(timeScale, logScale);
  return ([
    125, // -10
    125, // -9
    125, // -8
    125, // -7
    125, // -6
    5 * 5 * 5 * 5 / 2, // -5
    5 * 5 * 5 * 5 / 2, // -4
    5 * 5 * 5, // -3                     ns -> us
    5 * 5 * 5, // -2                     ?
    5 * 5 * 5 * 2, // -1
    5 * 5 * 4, // 0
    5 * 5 * 4, // 1
    5 * 5 * 8, // 2
    5 * 16, // 3
    5 * 32, // 4
    5 * 32, // 5
    5 * 64, // 6
    128, // 7
    128, // 8
    256, // 9
    1024 / 10, // 10                      ns -> ps
  ])[logScale + 10];
};

module.exports = desc => {
  const padLeft = 200;
  const height = 16;
  const shift = 11;
  const fontSize = 11;
  const timeScale = desc.timescale;
  const timeTotal = desc.time;
  console.log(timeScale, timeTotal);
  return {
    timetopSVG: pstate => {
      const w = (timeTotal * pstate.scale) |0;
      const delta = getDelta(pstate.scale);
      const res = ['g', tt(padLeft + .5, shift + .5, {style})];
      for (let i = 0; i < w; i += delta) {
        const label = (i / pstate.scale) + ' ns';
        res.push(['g', tt(i), ['line', {y2: 4}], ['text', {class: 'txt', y: -2}, label]]);
      }
      return genSVG(padLeft + w + 1, height, [res]);
    },
    timebotSVG: pstate => {
      const w = (timeTotal * pstate.scale) |0;
      const delta = getDelta(pstate.scale);
      const res = ['g', tt(padLeft + .5, height - shift + .5, {style})];
      for (let i = 0; i < w; i += delta) {
        const label = (i / pstate.scale) + ' ns';
        res.push(
          ['g', tt(i), ['line', {y2: -4}], ['text', {class: 'txt', y: fontSize - 2}, label]]
        );
      }
      return genSVG(padLeft + w + 1, height, [res]);
    }
  };
};
