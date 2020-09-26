#!/usr/bin/env node
'use strict';

const yargs = require('yargs');
const fs = require('fs-extra');
const vcdStream = require('vcd-stream');

const argv = yargs
  .option('input', {describe: 'path to the input VCD file', alias: 'i'})
  .demandOption(['input'])
  .help()
  .argv;

const numberOrString = val => {
  if (val < (2n ** 52n)) {
    return Number(val)
  }
  return '0x' + val.toString(16);
}

const main = async () => {
  const chango = {};
  const res = {chango};
  const inst = vcdStream.parser();

  inst.on('$enddefinitions', () => {
    res.wires = inst.info.wires;
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
    res.time = Number(inst.getTime());
    console.log(JSON.stringify(res));
  });
  fs.createReadStream(argv.input).pipe(inst);
};

main();
