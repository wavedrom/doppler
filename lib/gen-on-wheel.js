'use strict';

const genOnWheel = (element, pstate, render, cm, keyBindo) =>
  event => {
    const {deltaY} = event;
    if (event.ctrlKey) {
      keyBindo[
        (deltaY < 0) ? 'zoomIn' : ((deltaY > 0) ? 'zoomOut' : 'nop')
      ].fn(pstate) && render();
      event.preventDefault();
    } else
    if (event.shiftKey) {
      keyBindo[
        (deltaY < 0) ? 'scrollLeft' : ((deltaY > 0) ? 'scrollRight' : 'nop')
      ].fn(pstate) && render();
      event.preventDefault();
    }
  };

module.exports = genOnWheel;
