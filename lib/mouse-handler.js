'use strict';

const renderCursor = require('./render-cursor.js');

// Our mode "enum"
const CursorMode = {
  Follow: 'follow',
  Click: 'click'
};

let cursorMode = CursorMode.Follow;
const xmargin = 160;
const fontHeight = 20;
const fontWidth = fontHeight / 2;
let cursorElm;
let containerElm;
let pstateo;
let plugins = [];
let timeOutId = null;

const handler = event => {
  const x = pstateo.xCursor = event.clientX;
  cursorElm.style.left = (x - xmargin) + 'px';
  cursorElm.innerHTML = renderCursor({xmargin, fontWidth, fontHeight}, pstateo);
  if (cursorMode == CursorMode.Follow) {
    // Execute plugins after a short delay. Cancel
    // and restart delay if movement is detected during
    // the delay period.
    if (timeOutId != null) {
      clearTimeout(timeOutId);
    }
    timeOutId = setTimeout(() => {
      timeOutId = null;
      plugins.map(fn => fn(event, pstateo));
    }, 500);
  } else {
    // Execute plugins immediately in click mode.
    plugins.map(fn => fn(event, pstateo));
  }
};

const initHandler = (cursor, content, pstate /* , render */) => {
  // Save off these items so we don't have to pas them in later.
  cursorElm = cursor;
  containerElm = content;
  pstateo = pstate;

  // Make CursorMode like an enum, immutable
  Object.freeze(CursorMode);

  // Initial startup mode is "Follow".
  setCursorMode(CursorMode.Follow);
  //console.log("init", pstate);
  handler({clientX: pstate.width / 2});
};

const setCursorMode = (mode) => {
  cursorMode = mode;
  if (mode == CursorMode.Follow) {
    containerElm.removeEventListener('click', handler);
    containerElm.addEventListener('mousemove', handler);
  }
  else {
    containerElm.addEventListener('click', handler);
    containerElm.removeEventListener('mousemove', handler);
  }
};

module.exports = {initHandler, setCursorMode, CursorMode, plugins, handler};