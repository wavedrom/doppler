'use strict';

const vcd2obj = require('./vcd2obj.js');

const domContainer = require('./dom-container.js');

const getWaves = require('./get-waves.js');

exports.vcd2obj = vcd2obj;

exports.dom = {
  container: domContainer
};

exports.getWaves = getWaves;
