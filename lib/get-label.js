'use strict';

const format = require('./format.js');

const getLabel = (lane) => {
  if (typeof lane !== 'object') {
    lane = {};
  }
  const fmt = lane.format || '%h';
  const width = Number(lane.width || 1);
  const formatter = format(fmt, width);

  return (vPre, mPre, x, w) => {

    if (mPre) {
      if (vPre) {
        return ['text', {x, class: 'zxviolet'}, '?'];
      } else {
        return ['text', {x, class: 'xred'}, 'x'];
      }
    }

    const pos = (w / 8) |0;

    vPre = BigInt(vPre);

    const txtShort = formatter(vPre, pos, width);

    return ['text', {x}, txtShort];
  };
};

module.exports = getLabel;
