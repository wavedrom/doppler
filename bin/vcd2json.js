#!/usr/bin/env node
'use strict';

const yargs = require('yargs');
const fs = require('fs-extra');
const vcd2obj = require('../lib/vcd2obj.js');

const argv = yargs
  .option('input', {describe: 'path to the input VCD file', alias: 'i'})
  .demandOption(['input'])
  .help()
  .argv;

vcd2obj(
  fs.createReadStream(argv.input),
  res => console.log(JSON.stringify(res))
);

/* eslint no-console: 0 */
