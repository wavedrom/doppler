'use strict';

exports.plus = pstate => {
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

exports.minus = pstate => {
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
