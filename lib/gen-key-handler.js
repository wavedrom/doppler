'use strict';

const genKeyHandler = (div, pstate, render, cm, keyBindo) => {
  return event => {
    const key = (
      (event.ctrlKey ? 'Ctrl+' : '') +
      (event.shiftKey ? 'Shift+' : '') +
      (event.altKey ? 'Alt+' : '') +
      event.key
    );
    console.log(key);
    const captured = (keyBindo[key] || keyBindo.nop).fn(pstate, cm);
    if (captured) {
      event.stopPropagation();
      render();
    }
  };
};

module.exports = genKeyHandler;
