'use strict';

const xOffsetUpdate = require('./x-offset-update.js');
const xScaleUpdate = require('./x-scale-update.js');
const helpPanel = require('./help-panel.js');

const yScroll = delta => (pstate, cm) => {
  const info = cm.getScrollInfo();
  cm.scrollTo(null, info.top + info.clientHeight * delta);
  return false;
};

const pluso = {
  desc: 'Zoom in time',
  fn: pstate => xScaleUpdate(pstate, 3 / 2 * pstate.xScale)
};

const minuso = {
  desc: 'Zoom out time',
  fn: pstate => xScaleUpdate(pstate, 2 / 3 * pstate.xScale)
};

const fullo = {
  desc: 'All of time',
  fn: pstate => xScaleUpdate(pstate, pstate.xScaleMin)
};

const scroll = {
  left: {
    desc: 'Scroll into the past',
    fn: pstate => xOffsetUpdate(pstate, pstate.xOffset + .2 * pstate.width)
  },
  right: {
    desc: 'Scroll into the future',
    fn: pstate => xOffsetUpdate(pstate, pstate.xOffset - .2 * pstate.width)
  },
  up:   {
    desc: 'scroll up',
    fn: yScroll(-.1)
  },
  down: {
    desc: 'scroll down',
    fn: yScroll(.1)
  },
  home: {
    desc: 'Jump to beginning of time',
    fn: pstate => xOffsetUpdate(pstate, pstate.sidebarWidth)
  },
  end: {
    desc: 'Jump to end time',
    fn: pstate => xOffsetUpdate(pstate, pstate.width - pstate.xScale * pstate.time)
  }
};

const editable = {
  desc: 'Toggle edit mode',
  fn: (pstate, cm) => {
    console.log('editable', pstate, cm);
  }
};

module.exports = {
  'Alt+,': scroll.left,   'Alt+≤': {fn: scroll.left.fn}, 'Shift+icon:scrollUp':  scroll.left,
  'Alt+.': scroll.right,  'Alt+≥': {fn: scroll.right.fn}, 'Shift+icon:scrollDown': scroll.right,

  'Alt+[': scroll.home,   'Alt+"': {fn: scroll.home.fn}, // Home
  'Alt+]': scroll.end,    'Alt+‘': {fn: scroll.end.fn}, // End

  'Alt+=': pluso,         'Alt+≠': {fn: pluso.fn}, 'Ctrl+icon:scrollUp':  pluso, // + =
  'Alt+-': minuso,        'Alt+–': {fn: minuso.fn}, 'Ctrl+icon:scrollDown': minuso, // - _

  'Alt+0': fullo,         'Alt+º': {fn: fullo.fn}, // 'Shift+f': fullo, F: fullo, 'Shift+F': fullo,

  'Alt+/': editable,      'Alt+÷': {fn: editable.fn},

  'Shift+?': {desc: 'Toggle help panel', fn: helpPanel.toggle},
  // CAN'T DO: Alt + e, d, f, l

  // ArrowUp:    scroll.up,    'Shift+ArrowUp':    scroll.up,
  // ArrowDown:  scroll.down,  'Shift+ArrowDown':  scroll.down,

  // PageUp:     {desc: 'scroll page up',    fn: yScroll(-1)},
  // PageDown:   {desc: 'scroll page down',  fn: yScroll(1)},

  nop:        {fn: () => false}
};
