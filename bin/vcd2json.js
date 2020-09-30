#!/usr/bin/env node
'use strict';

const yargs = require('yargs');
const fs = require('fs-extra');
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

const argv = yargs
  .option('input', {describe: 'path to the input VCD file', alias: 'i'})
  .demandOption(['input'])
  .help()
  .argv;

const numberOrString = val => {
  if (val < (2n ** 52n)) {
    return Number(val);
  }
  return '0x' + val.toString(16);
};

const main = async () => {
  const chango = {};
  const res = {chango};
  const inst = vcdStream.parser();

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
    console.log(JSON.stringify(res));
  });
  fs.createReadStream(argv.input).pipe(inst);
};

main();
