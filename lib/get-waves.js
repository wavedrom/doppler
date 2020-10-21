'use strict';

const get = require('lodash.get');

const getWaves = (obj, waves) => {
  const wires = obj.wires;
  return waves.map(pat => {
    return {
      name: pat.trim(),
      ref: get(wires, pat.trim())
    };
  });
};

module.exports = getWaves;
