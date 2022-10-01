'use strict';

const xOffsetUpdate = require('./x-offset-update.js');

const xScaleUpdate = (pstate, xScaleNext) => {
  const {xOffset, xCursor, xScale, xScaleMin, xScaleMax} = pstate;

  xScaleNext = (xScaleNext > xScaleMax) ? xScaleMax : xScaleNext;

  xScaleNext = (xScaleNext < xScaleMin) ? xScaleMin : xScaleNext;

  if (xScaleNext === xScale) {
    return false; // exit without scale change
  }
  pstate.xScale = xScaleNext;

  xOffsetUpdate(pstate, xCursor - (xCursor - xOffset) * xScaleNext / xScale);
  return true;
};

module.exports = xScaleUpdate;
