'use strict';

const scale = require('./scale.js');

const genKeyHandler = (div, pstate, render, cm) => {
  return event => {
    if (cm.hasFocus()) {
      return;
    }
    // event.preventDefault();
    const captured = (scale[event.key] || scale.nop)(pstate, cm);
    if (captured) {
      event.stopPropagation();
      render();
    }
  };
};

module.exports = genKeyHandler;
