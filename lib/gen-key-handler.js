'use strict';

const genKeyHandler = (div, pstate, render, cm, keyBindo, plugins) => {
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
      if (plugins != undefined) {
        plugins.map(fn => fn(key, event));
      }
      render();
    }
  };
};

module.exports = genKeyHandler;
