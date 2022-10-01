'use strict';

const xOffsetUpdate = require('./x-offset-update.js');
const xScaleUpdate = require('./x-scale-update.js');

const yScroll = delta => (pstate, cm) => {
  const info = cm.getScrollInfo();
  cm.scrollTo(null, info.top + info.clientHeight * delta);
  return false;
};

const plus  = pstate => xScaleUpdate(pstate, 3 / 2 * pstate.xScale);
const minus = pstate => xScaleUpdate(pstate, 2 / 3 * pstate.xScale);
const full  = pstate => xScaleUpdate(pstate, pstate.xScaleMin);

module.exports = {
  '+': plus, '=': plus,
  '-': minus, '_': minus,
  f: full, F: full,
  Home:       pstate => xOffsetUpdate(pstate, pstate.sidebarWidth),
  End:        pstate => xOffsetUpdate(pstate, pstate.width - pstate.xScale * pstate.time),
  ArrowLeft:  pstate => xOffsetUpdate(pstate, pstate.xOffset + .2 * pstate.width),
  ArrowRight: pstate => xOffsetUpdate(pstate, pstate.xOffset - .2 * pstate.width),

  ArrowUp: yScroll(-.1),
  ArrowDown: yScroll(.1),
  PageUp: yScroll(-1),
  PageDown: yScroll(1),
  nop: () => false
};
