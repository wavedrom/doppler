'use strict';

const scale = require('./scale.js');

const genKeyHandler = (div, pstate, render) => {
  return event => {
    console.log(event.key);
    switch (event.key) {
    case '+':
    case '=':
      scale.plus(pstate) && render();
      break;
    case '-':
    case '_':
      scale.minus(pstate) && render();
      break;
    }
  };
};

module.exports = genKeyHandler;
