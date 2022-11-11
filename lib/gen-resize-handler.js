'use strict';

const xOffsetUpdate = require('./x-offset-update.js');

const genResizeHandler = pstate =>
  (width, height) => {
    let {xOffset, yOffset, xScale, yStep, time, sidebarWidth, numLanes} = pstate;
    pstate.width = width;
    pstate.height = height;

    // Y
    const yOffsetMax = (numLanes + 2) * 2 * yStep;
    if (yOffsetMax < 0) {
      yOffset = 0;
    } else
    if (yOffset > yOffsetMax) {
      yOffset = yOffsetMax;
    }
    pstate.yOffset = yOffset;

    // X
    const xScaleMin = pstate.xScaleMin = (width - sidebarWidth) / time;
    pstate.xScale = (xScale < xScaleMin) ? xScaleMin : xScale;
    xOffsetUpdate(pstate, xOffset);
  };

module.exports = genResizeHandler;
