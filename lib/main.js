'use strict';

const domContainer = require('./dom-container.js');

global.Doppler = divName => {
  const content = (typeof divName === 'string')
    ? document.getElementById(divName)
    : divName;

  const src = content.innerHTML;
  content.innerHTML = '';
  const desc = JSON.parse(src);
  domContainer(content, desc);
};

/* eslint-env browser */
