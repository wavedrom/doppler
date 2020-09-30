'use strict';

const scalePlus = pstate => {
  let scale = pstate.scale;
  if (scale === 1024) {
    return false;
  }
  scale *= 2;
  if (scale > 1024) {
    scale = 1024;
  }
  pstate.scale = scale;
  return true;
};

const scaleMinus = pstate => {
  let scale = pstate.scale;
  if (scale === (1 / 1024)) {
    return false;
  }
  scale /= 2;
  if (scale < (1 / 1024)) {
    scale = (1 / 1024);
  }
  pstate.scale = scale;
  return true;
};

const genKeyHandler = (div, pstate, render) => {
  return event => {
    console.log(event.key);
    switch (event.key) {
    case '+':
    case '=':
      scalePlus(pstate) && render();
      break;
    case '-':
    case '_':
      scaleMinus(pstate) && render();
      break;
    }
  };
};

module.exports = genKeyHandler;
