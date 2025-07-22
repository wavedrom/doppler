'use strict';

const genSVG = require('onml/gen-svg.js');
const tt = require('onml/tt.js');

exports.mlStats = ($, stats, timeStamp) => {
  const currentLoadTime = Date.now() - $.state.loadVcdT0;
  const loadSpeed = stats.totalLength / currentLoadTime / 1000;
  const svg = [
    ...genSVG(256, 20),
    ['g', ...Array.from({length: 11}, (e, i) => ['line', {
        'stroke-width': '2px',
        'stroke': 'hsla(97, 100%, 50%, ' + ((11 - ((i + stats.numChunks / 10) % 11)) / 11) + ')',
        x1: Math.sin(Math.PI * i / 5.5) * 4 + 12,
        x2: Math.sin(Math.PI * i / 5.5) * 8 + 12,
        y1: Math.cos(Math.PI * i / 5.5) * 4 + 12,
        y2: Math.cos(Math.PI * i / 5.5) * 8 + 12
    }])],
    ['text', {x: 32, y: 18, style: 'font-size: 14px; fill: #fff'},
      timeStamp, ' | ',
      Math.round(loadSpeed), ' MB/s'
    ]
  ];  
  return svg;
};

exports.mlDone = () => {
  const svg = [
    ...genSVG(256, 20),
    ['g', tt(12, 12),
      ['circle', {r: 8, fill: '#00ffbbd6'}],
      ['path', {d: 'm-4 -1 l3 3 l5 -5', style: 'stroke-width:3px;stroke:#fff;line-cap:round;fill:none'}]
    ]
];  
  return svg;
};

exports.css = {
  '.wd-status-panel': {
    position: 'absolute',
    bottom: '0px',
    left: '0px',
  }
};
