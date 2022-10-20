'use strict';

const getT = require('./get-t.js');

function* surferer (wave, pstate) {
  const { sidebarWidth, width } = pstate;
  const xStartExact = getT(sidebarWidth, pstate);
  const xFinishExact = getT(width, pstate);

  let i = 0;
  for (i = 0; i < wave.length; i++) { // seek to the start of viewport
    if ((wave[i] === undefined) || (wave[i][0] >= xStartExact)) {
      break;
    }
  }
  for (; i < wave.length; i++) { // render viewport
    if ((wave[i] === undefined) || (wave[i][0] > xFinishExact)) {
      break;
    }
    yield i;
  }
}

module.exports = surferer;
