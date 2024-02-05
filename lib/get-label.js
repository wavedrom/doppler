'use strict';

const getLabel = (vPre, mPre, x, w, fmt) => {
  const radix = (fmt || {}).radix;
  const base = ({
    b: 2, o: 8, d: 10, h: 16, H: 16
  })[radix] || 16;

  if (mPre) {
    if (vPre) {
      return ['text', {x, class: 'zxviolet'}, '?'];
    } else {
      return ['text', {x, class: 'xred'}, 'x'];
    }
  } else {
    const numPos = (w / 8) |0;
    let txtOrig = vPre.toString(base);
    if (radix === 'H') {
      txtOrig = txtOrig.toUpperCase();
    }

    // ? txtOrig.slice(0, numPos - 1) + '\u22ef' // MSB
    const txtShort = (txtOrig.length > numPos)
      ? ((numPos === 1)
        ? '\u22EE'
        : '\u22EF' + txtOrig.slice(1 - numPos)) // LSB
      : txtOrig;
    return ['text', {x}, ['title', txtOrig], txtShort]; // idx.toString(36)]);
  }
};

module.exports = getLabel;
