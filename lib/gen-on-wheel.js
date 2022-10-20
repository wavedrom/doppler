'use strict';

const genOnWheel = (element, pstate, render, cm, keyBindo) =>
  event => {
    event.preventDefault();
    if (cm.hasFocus()) {
      return;
    }
    const {deltaY} = event;
    if (event.ctrlKey) {
      keyBindo[
        (deltaY < 0) ? '+' : ((deltaY > 0) ? '-' : 'nop')
      ].fn(pstate) && render();
    } else
    if (event.shiftKey) {
      keyBindo[
        (deltaY < 0) ? 'ArrowLeft' : ((deltaY > 0) ? 'ArrowRight' : 'nop')
      ].fn(pstate) && render();
    } else {
      keyBindo[
        (deltaY < 0) ? 'ArrowUp' : (deltaY > 0) ? 'ArrowDown' : 'nop'
      ].fn(pstate, cm) && render();
      // const info = cm.getScrollInfo();
      // if (deltaY < 0) {
      //   cm.scrollTo(null, info.top - info.clientHeight / 8);
      //   // ? 'ArrowUp'
      // } else if (deltaY > 0) {
      //   cm.scrollTo(null, info.top + info.clientHeight / 8);
      //   // ? 'ArrowDown' : 'nop'
      // }
    }
  };

module.exports = genOnWheel;
