'use strict';

const xOffsetUpdate = require('./x-offset-update.js');

const xScaleUpdate = (pstate, xScaleNext) => {

  const {width, sidebarWidth, time, xOffset, xCursor, xScale} = pstate;

  const minWidth = width - sidebarWidth;

  // protection against big bang
  let curTime = (time < 10) ? 10 : time;
  const xScaleMin = minWidth / curTime;

  // show at least 10 time units
  const xScaleMax = minWidth / 10;

  // xScaleNext === Infinity means maximum zoom
  xScaleNext = (xScaleNext > xScaleMax) ? xScaleMax : xScaleNext;

  // xScaleNext === 0 means all of time
  xScaleNext = (xScaleNext < xScaleMin) ? xScaleMin : xScaleNext;

  if (xScaleNext > 4) {
    xScaleNext = Math.round(xScaleNext);
  }

  if (xScaleNext === xScale) {
    return false; // exit without scale change
  }
  pstate.xScale = xScaleNext;

  xOffsetUpdate(pstate, xCursor - (xCursor - xOffset) * xScaleNext / xScale);
  return true;
};

module.exports = xScaleUpdate;
