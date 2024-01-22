'use strict';

const genOnWheel = (element, pstate, deso, cm, keyBindo, plugins) =>
  event => {
    const {deltaY} = event;
    if (event.ctrlKey) {
      const key = (deltaY < 0)
        ? 'Ctrl+icon:scrollUp'
        : ((deltaY > 0) ? 'Ctrl+icon:scrollDown' : 'nop');
      if (keyBindo[key].fn(pstate)) {
        if (plugins != undefined) {
          plugins.map(fn => fn(key, event));
        }
        deso.render();
      }
      event.preventDefault();
    } else
    if (event.shiftKey) {
      const key = (deltaY < 0) ? 'Shift+icon:scrollUp' : ((deltaY > 0) ? 'Shift+icon:scrollDown' : 'nop');
      if (keyBindo[key].fn(pstate)) {
        if (plugins != undefined) {
          plugins.map(fn => fn(key, event));
        }
        deso.render();
      }
      event.preventDefault();
    }
  };

module.exports = genOnWheel;
