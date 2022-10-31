'use strict';

const renderValues = require('./render-values.js');

const pluginRenderValues = (desc, pstate, els) => {
  const gen = renderValues(desc, pstate);
  for (let i = 0; i < 1e6; i++) {
    const iter = gen.next();
    if (iter.done) {
      els.values.innerHTML = iter.value;
      break;
    }
  }
};

module.exports = pluginRenderValues;
