'use strict';

const getT = (x, pstate) => {
  const {xOffset, xScale, tgcd } = pstate;
  return Math.round((x / xScale) - (xOffset / xScale)) * tgcd;
  // t = ((x / xScale * 2) - (xOffset * width / xScale)) * tgcd;
  // t = (x / xScale * 2) * tgcd - (xOffset * width / xScale) * tgcd;
  // t + (xOffset * width / xScale) * tgcd = (x / xScale * 2) * tgcd;
  // (t / tgcd) + (xOffset * width / xScale) = (x / xScale * 2);
  // (t / tgcd) * xScale / 2 + (xOffset * width / 2) = x;
};

module.exports = getT;
