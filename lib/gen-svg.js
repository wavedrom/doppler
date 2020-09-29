'use strict';

const w3 = require('./w3.js');

module.exports = (w, h, body) => {
  w = Math.ceil(w);
  h = Math.ceil(h);
  return ['svg', {
    xmlns: w3.svg, 'xmlns:xlink': w3.xlink,
    width: w, height: h,
    viewBox: '0 0 ' + w + ' ' + h
  }].concat(body || []);
};
