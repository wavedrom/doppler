'use strict';

const domContainer = require('./dom-container.js');

global.Doppler = (divName, changoName) => {
  const content = (typeof divName === 'string')
    ? document.getElementById(divName)
    : divName;

  const src = content.innerHTML;
  content.innerHTML = '';
  let desc = JSON.parse(src);

  if (changoName !== undefined) {
    fetch(changoName)
      .then(responce => responce.json())
      .then(data => {
        desc = Object.assign(data, desc);
        console.log(desc);
        domContainer(content, desc);
      });
  } else {
    domContainer(content, desc);
  }
};

/* eslint-env browser */
