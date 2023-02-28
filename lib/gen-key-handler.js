'use strict';

const {keyName} = require('w3c-keyname');

const genKeyHandler = (div, pstate, render, cm, keyBindo, plugins) => {
  return event => {

    const modifier = (
      (event.ctrlKey ? 'Ctrl+' : '') +
      (event.shiftKey ? 'Shift+' : '') +
      (event.altKey ? 'Alt+' : '')
    );
    // const key = modifier + event.key;
    const key = modifier + keyName(event);

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
