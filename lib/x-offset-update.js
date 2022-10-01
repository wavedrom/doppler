'use strict';

const xOffsetUpdate = (pstate, xOffsetNext) => {
  let {width, xOffset, xScale, time, sidebarWidth} = pstate;

  const xOffsetMax = sidebarWidth; // maximum offset
  xOffsetNext = (xOffsetNext > xOffsetMax) ? xOffsetMax : xOffsetNext;

  const xOffsetMin = width - xScale * time; // minimum offset
  xOffsetNext = (xOffsetNext < xOffsetMin) ? xOffsetMin : xOffsetNext;

  if (xOffsetNext === xOffset) {
    return false; // exit without scroll
  }

  pstate.xOffset = xOffsetNext;
  return true;
};

module.exports = xOffsetUpdate;
