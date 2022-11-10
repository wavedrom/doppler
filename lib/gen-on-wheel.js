'use strict';

const genOnWheel = (element, pstate, render, cm, keyBindo, plugins) =>
  event => {
    const {deltaY} = event;
    if (event.ctrlKey) {
      const key = (deltaY < 0) ? 'zoomIn' : ((deltaY > 0) ? 'zoomOut' : 'nop');
      if (keyBindo[key].fn(pstate)) {
        if (plugins != undefined) {
          plugins.map(fn => fn(key, event));
        }
        render();
      } 
      event.preventDefault();
    } else
    if (event.shiftKey) {
      const key = (deltaY < 0) ? 'scrollLeft' : ((deltaY > 0) ? 'scrollRight' : 'nop');
      if (keyBindo[key].fn(pstate)) {
        if (plugins != undefined) {
          plugins.map(fn => fn(key, event));
        }
        render();
      } 
      event.preventDefault();
    }
  };

module.exports = genOnWheel;
