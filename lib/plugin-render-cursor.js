'use strict';

const renderCursor = require('./render-cursor.js');

const pluginRenderCursor = (desc, pstate, els) => {
  // TODO remove duplication with dom-container.js
  const xmargin = 160;
  const fontHeight = 20;
  const fontWidth = fontHeight / 2;
  const x = pstate.xCursor;
  if (x !== undefined) {
    els.cursor.style.left = (x - xmargin) + 'px';
  }
  els.cursor.innerHTML = renderCursor({xmargin, fontWidth, fontHeight}, pstate);
};

module.exports = pluginRenderCursor;
