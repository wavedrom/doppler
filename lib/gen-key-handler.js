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
    if (executeKeyHandler(key, keyBindo, pstate, cm)) {
      event.stopPropagation();
      if (plugins != undefined) {
        plugins.map(fn => fn(key, event));
      }
      render();
    }
  };
};

const executeKeyHandler = (key, keyBindo, pstate, cm) => {
  return (keyBindo[key] || keyBindo.nop).fn(pstate, cm);
};

module.exports = { genKeyHandler, executeKeyHandler };
