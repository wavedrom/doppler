'use strict';

const xOffsetUpdate = require('./x-offset-update.js');

const genResizeHandler = pstate =>
  (width, height) => {
    let {xOffset, yOffset, xScale, yStep, time, sidebarWidth, numLanes} = pstate;

    // move cursor by viewport scaling ratio
    pstate.xCursor = pstate.xCursor * width / pstate.width;

    width = Math.floor(width);
    pstate.width = width;
    pstate.height = Math.floor(height);

    // Y
    const yOffsetMax = (numLanes + 2) * 2 * yStep;
    if (yOffsetMax < 0) {
      yOffset = 0;
    } else if (yOffset > yOffsetMax) {
      yOffset = yOffsetMax;
    }
    pstate.yOffset = yOffset;

    // X
    // let xScaleMin = 0.001;
    // if (time > 10) { // protection against big bang
    //   xScaleMin = (width - sidebarWidth) / time;
    // }
    // pstate.xScaleMin = xScaleMin;
    // pstate.xScale = (xScale < xScaleMin) ? xScaleMin : xScale;
    // xOffsetUpdate(pstate, xOffset);
  };

module.exports = genResizeHandler;
