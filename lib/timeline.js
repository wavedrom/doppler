'use strict';

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
    5 * 5 * 2 * 5, // -1
    5 * 5 * 2 * 2, // 0
    5 * 5 * 2 * 2, // 1
    5 * 5 * 8, // 2
    5 * 16, // 3
    5 * 32, // 4
    5 * 32, // 5
    5 * 64, // 6
    128, // 7
    256, // 8
    512, // 9      / 10
    1024 // 10     / 10                 ns -> ps
  ])[logScale + 10];
};

const cfg = {
  padLeft: 200,
  height: 16,
  shift: 11,
  fontSize: 11
};

const getTimeUnit = s =>
  (s === -3) ? 'ms' :
    (s === -6) ? 'us' :
      (s === -9) ? 'ns' :
        (s === -12) ? 'ps' :
          (s === -15) ? 'fs' : ('e' + s);


const genTimeline = (t0, timeTotal, timeUnit, lshift, y01, y02, ty) => {
  return pstate => {
    const start = (t0 * pstate.scale) |0;
    const end = (timeTotal * pstate.scale) |0;
    const delta = getDelta(pstate.scale);
    const label = t0 + ' ' + timeUnit;
    const res = ['g', tt(cfg.padLeft - start + .5, lshift + .5, {style}),
      ['g', tt(start),
        ['line', {y1: y01, y2: y02}],
        ['text', {class: 'txt', 'font-weight': 'bold', style: 'text-anchor: start;', x: 2, y: ty}, label]
      ]
    ];
    res.push();
    for (let i = 0; i < end; i += delta) {
      if (i > start) {
        const label = (i / pstate.scale) + ' ' + timeUnit;
        res.push(['g', tt(i),
          ['line', {y2: y02}],
          ['text', {class: 'txt', y: ty}, label]
        ]);
      }
    }
    return genSVG(cfg.padLeft + end - start + 1, cfg.height, [res]);
  };
};

module.exports = desc => {
  const t0 = desc.t0;
  const timeTotal = desc.time;
  const timeScale = desc.timescale;
  const timeUnit = getTimeUnit(timeScale);
  return {
    timetopSVG: genTimeline(t0, timeTotal, timeUnit, cfg.shift,             -cfg.shift + 1,  4,               -2),
    timebotSVG: genTimeline(t0, timeTotal, timeUnit, cfg.height - cfg.shift, cfg.shift + 1, -4, cfg.fontSize - 2)
  };
};
