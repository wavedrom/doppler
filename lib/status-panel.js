'use strict';

const genSVG = require('onml/gen-svg.js');
const tt = require('onml/tt.js');

const getProgressWheel = (n) =>['g', tt(12, 12, {w: 24, h: 24}),
  ...Array.from({length: 11}, (e, i) => ['line', {
    'stroke-width': '2px',
    'stroke-linecap': 'round',
    'stroke': 'hsla(97, 100%, 50%, ' + ((6 - (i + n) % 7) / 7) + ')',
    x1: Math.sin(Math.PI * i / 3.5) * 5,
    x2: Math.sin(Math.PI * i / 3.5) * 7,
    y1: Math.cos(Math.PI * i / 3.5) * 5,
    y2: Math.cos(Math.PI * i / 3.5) * 7
  }])];

const getCheckMark = () =>['g', tt(12, 12, {w: 24, h: 24}),
  ['circle', {r: 9, fill: '#00654aff'}],
  ['path', {
    d: 'm-4 -1 l3 3 l5 -5',
    'stroke-linecap': 'round',
    fill: 'none',
    style: 'stroke-width: 3px; stroke: #fff;'}]
];

const getStatsMl = (stats, timeStamp) => {
  const currentLoadTime = Date.now() - stats.realT0;
  const loadSpeed = stats.totalLength / currentLoadTime / 1000;
  return ['text', {x: 32, y: 18, style: 'font-size:14px;fill:#fff'},
    timeStamp, ' | ',
    Math.round(loadSpeed), ' MB/s'
  ];
};

exports.mlStats = ($, stats, timeStamp) => [
  ...genSVG(256, 20),
  getProgressWheel(stats.numChunks / 10),
  getStatsMl(stats, timeStamp)
];

exports.mlDone = ($, stats, timeStamp) => [
  ...genSVG(256, 20),
  getCheckMark(),
  getStatsMl(stats, timeStamp)
];

exports.css = {
  '.wd-status-panel': {
    position: 'absolute',
    bottom: '0px',
    left: '0px',
  }
};
