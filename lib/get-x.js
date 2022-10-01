'use strict';

const getX = (pstate, time) =>
  time * pstate.xScale + pstate.xOffset;

module.exports = getX;
