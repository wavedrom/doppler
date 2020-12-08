'use strict';

const vcdStream = require('vcd-stream');

const parseTimescale = str => {
  if (typeof str !== 'string') {
    return;
  }
  const str1 = str.trim();
  const m = str1.match(/^(\d+)\s*(\w+)$/);
  const res1 = ({1: 0, 10: 1, 100: 2})[m[1]];
  const res2 = ({s: 0, ms: -3, us: -6, ns: -9, ps: -12, fs: -15})[m[2]];
  return res1 + res2;
};

const numberOrString = val => {
  if (val < (2n ** 52n)) {
    return Number(val);
  }
  return '0x' + val.toString(16);
};

module.exports = async (stream, done, options) => {
  const chango = {};
  const view = [];
  const res = {chango, view};
  const inst = (options && options.wasm)
    ? await vcdStream.wasmparser()
    : vcdStream.parser();

  if (options !== undefined && options.defs === 0) {

    inst.on('$enddefinitions', () => {
      res.wires = inst.info.wires;
      res.timescale = parseTimescale(inst.info.timescale);
    });

    inst.change.any((id, time, cmd, value, mask) => {
      chango[id] = chango[id] || {wave: []};
      if ((cmd === 14) || (cmd === 15) || (cmd === 16) || (cmd === 17)) {
        chango[id].kind = 'bit';
        chango[id].wave.push([time, Number((mask << 1n) + value)]);
      } else {
        chango[id].kind = 'vec';
        const point = [time, numberOrString(value)];
        if (mask !== 0n) {
          point.push(numberOrString(mask));
        }
        chango[id].wave.push(point);
      }
    });

    inst.on('finish', () => {
      res.t0 = inst.info.t0;
      res.time = Number(inst.getTime());
      done(res);
    });

  } else {
    inst.on('$enddefinitions', () => {
      res.wires = inst.info.wires;
      res.timescale = parseTimescale(inst.info.timescale);
      inst.kill();
      done(res);
    });
  }
  stream.pipe(inst);
};
