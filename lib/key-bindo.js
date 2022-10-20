'use strict';

const xOffsetUpdate = require('./x-offset-update.js');
const xScaleUpdate = require('./x-scale-update.js');

const yScroll = delta => (pstate, cm) => {
  const info = cm.getScrollInfo();
  cm.scrollTo(null, info.top + info.clientHeight * delta);
  return false;
};

const pluso = {
  desc: 'x zoom in',
  fn: pstate => xScaleUpdate(pstate, 3 / 2 * pstate.xScale)
};

const minuso = {
  desc: 'x zoom out',
  fn: pstate => xScaleUpdate(pstate, 2 / 3 * pstate.xScale)
};

const fullo = {
  desc: 'full x zoom',
  fn: pstate => xScaleUpdate(pstate, pstate.xScaleMin)
};

const scroll = {
  left: {
    desc: 'scroll left',
    fn: pstate => xOffsetUpdate(pstate, pstate.xOffset + .2 * pstate.width)
  },
  right: {
    desc: 'scroll right',
    fn: pstate => xOffsetUpdate(pstate, pstate.xOffset - .2 * pstate.width)
  },
  up:   {
    desc: 'scroll up',
    fn: yScroll(-.1)
  },
  down: {
    desc: 'scroll down',
    fn: yScroll(.1)
  }
};

module.exports = {
  'Shift++': pluso,  '+': pluso,  '=': pluso,
  'Shift+_': minuso, '-': minuso, '_': minuso,

  f: fullo, 'Shift+f': fullo, F: fullo, 'Shift+F': fullo,

  Home: {desc: 'jump to x beginning', fn: pstate => xOffsetUpdate(pstate, pstate.sidebarWidth)},
  End:  {desc: 'jump to x end',       fn: pstate => xOffsetUpdate(pstate, pstate.width - pstate.xScale * pstate.time)},

  ArrowLeft:  scroll.left,  'Shift+ArrowLeft':  scroll.left,
  ArrowRight: scroll.right, 'Shift+ArrowRight': scroll.right,
  ArrowUp:    scroll.up,    'Shift+ArrowUp':    scroll.up,
  ArrowDown:  scroll.down,  'Shift+ArrowDown':  scroll.down,

  PageUp:     {desc: 'scroll page up',    fn: yScroll(-1)},
  PageDown:   {desc: 'scroll page down',  fn: yScroll(1)},

  nop:        {fn: () => false}
};
