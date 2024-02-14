'use strict';

const {expect} = require('chai');
const format = require('../lib/format.js');

const fp64_2bigint = (val) => {
  const buf = new ArrayBuffer(8);
  const bufFloat = new Float64Array(buf);
  const bufBInt = new BigInt64Array(buf);
  bufFloat[0] = val;
  return bufBInt[0];
};

const fp32_2bigint = (val) => {
  const buf = new ArrayBuffer(4);
  const bufFloat = new Float32Array(buf);
  const bufUInt = new Uint32Array(buf);
  bufFloat[0] = Math.fround(val);
  return bufUInt[0];
};

console.log(-123456789012345678e100, fp64_2bigint(-123456789012345678e100).toString(16));
console.log(-123456789012345678e100, fp32_2bigint(-123456789012345678e100).toString(16));

const tt = [
  //                                                    |                            |
  {fmt: '%b',   val: 12345678n, len: 24, pos: 30, res: '101111000110000101001110'},
  {fmt: '%o',   val: 12345678n, len: 24, pos: 30, res: '57060516'},
  {fmt: '%d',   val: 12345678n, len: 24, pos: 30, res: '12345678'},
  {fmt: '%h',   val: 12345678n, len: 24, pos: 30, res: 'bc614e'},
  //                                                    |   |
  {fmt: '%b',   val: 12345678n, len: 24, pos: 5,  res: '⋯1110'},
  {fmt: '%o',   val: 12345678n, len: 24, pos: 5,  res: '⋯0516'},
  {fmt: '%d',   val: 12345678n, len: 24, pos: 5,  res: '⋯5678'},
  {fmt: '%h',   val: 12345678n, len: 24, pos: 5,  res: '⋯614e'},
  //                                                    |                            |
  {fmt: '%sb',  val: 12345678n, len: 24, pos: 30, res: '-10000111001111010110010'},
  {fmt: '%so',  val: 12345678n, len: 24, pos: 30, res: '-20717262'},
  {fmt: '%sd',  val: 12345678n, len: 24, pos: 30, res: '-4431538'},
  {fmt: '%sh',  val: 12345678n, len: 24, pos: 30, res: '-439eb2'},
  //                                                    |   |
  {fmt: '%sb',  val: 12345678n, len: 24, pos: 5,  res: '-⋯010'},
  {fmt: '%so',  val: 12345678n, len: 24, pos: 5,  res: '-⋯262'},
  {fmt: '%sd',  val: 12345678n, len: 24, pos: 5,  res: '-⋯538'},
  {fmt: '%sh',  val: 12345678n, len: 24, pos: 5,  res: '-⋯eb2'},
  //                                                    |                            |
  {fmt: '%sb',  val: 12345678n, len: 25, pos: 30, res: '101111000110000101001110'},
  {fmt: '%so',  val: 12345678n, len: 25, pos: 30, res: '57060516'},
  {fmt: '%sd',  val: 12345678n, len: 25, pos: 30, res: '12345678'},
  {fmt: '%sh',  val: 12345678n, len: 25, pos: 30, res: 'bc614e'},
  //                                                    |   |
  {fmt: '%sb',  val: 12345678n, len: 25, pos: 5,  res: '+⋯110'},
  {fmt: '%so',  val: 12345678n, len: 25, pos: 5,  res: '+⋯516'},
  {fmt: '%sd',  val: 12345678n, len: 25, pos: 5,  res: '+⋯678'},
  {fmt: '%sh',  val: 12345678n, len: 25, pos: 5,  res: '+⋯14e'},

  {fmt: '%a',   val: 0x4142434445n, len: 40, pos: 20, res: 'ABCDE'},
  //                                                               |                  |
  {fmt: '%f64', val: -0x27c0aad9be68b8fbn, len: 64, pos: 20, res: '-1.2345678901234568e+117'},
  {fmt: '%e64', val: -0x27c0aad9be68b8fbn, len: 64, pos: 20, res: '-1.234567890123e+117'},
  {fmt: '%g64', val: -0x27c0aad9be68b8fbn, len: 64, pos: 20, res: '-1.234567890123e+117'},
  //                                                               |                  |
  {fmt: '%f64', val: -0x3d23edde7c882195n, len: 64, pos: 20, res: '-123456789012345.67'},
  {fmt: '%e64', val: -0x3d23edde7c882195n, len: 64, pos: 20, res: '-1.2345678901235e+14'},
  {fmt: '%g64', val: -0x3d23edde7c882195n, len: 64, pos: 20, res: '-123456789012345.67'},
  //                                                               |             |
  {fmt: '%f64', val: -0x3d23edde7c882195n, len: 64, pos: 15, res: '-123456789012345.671875000000000'},
  {fmt: '%e64', val: -0x3d23edde7c882195n, len: 64, pos: 15, res: '-1.23456789e+14'},
  {fmt: '%g64', val: -0x3d23edde7c882195n, len: 64, pos: 15, res: '-1.23456789e+14'},
  //                                                               |                  |
  {fmt: '%f64', val: 0x405edd2f1a9fbe77n,  len: 64, pos: 20, res: '123.456'},
  {fmt: '%e64', val: 0x405edd2f1a9fbe77n,  len: 64, pos: 20, res: '1.23456e+2'},
  {fmt: '%g64', val: 0x405edd2f1a9fbe77n,  len: 64, pos: 20, res: '123.456'},
  //                                                               |                  |
  {fmt: '%f64', val: 0x3ee9e0fcaf9380fcn,  len: 64, pos: 20, res: '0.00001234'},
  {fmt: '%e64', val: 0x3ee9e0fcaf9380fcn,  len: 64, pos: 20, res: '1.234e-5'},
  {fmt: '%g64', val: 0x3ee9e0fcaf9380fcn,  len: 64, pos: 20, res: '0.00001234'},
  //                                                      |                  |
  {fmt: '%f32', val: 0x42f6e979n, len: 32, pos: 20, res: '123.45600128173828'},
  {fmt: '%e32', val: 0x42f6e979n, len: 32, pos: 20, res: '1.234560012817383e+2'},
  {fmt: '%g32', val: 0x42f6e979n, len: 32, pos: 20, res: '123.45600128173828'},
  //                                                      |                  |
  {fmt: '%f32', val: 0x374f07e5n, len: 32, pos: 20, res: '0.00001233999955729814'},
  {fmt: '%e32', val: 0x374f07e5n, len: 32, pos: 20, res: '1.233999955729814e-5'},
  {fmt: '%g32', val: 0x374f07e5n, len: 32, pos: 20, res: '1.233999955729814e-5'},
  //                                                      |      |
  {fmt: '%f32', val: 0x374f07e5n, len: 32, pos: 8,  res: '0.00001234'},
  {fmt: '%e32', val: 0x374f07e5n, len: 32, pos: 8,  res: '1.234e-5'},
  {fmt: '%g32', val: 0x374f07e5n, len: 32, pos: 8,  res: '1.234e-5'}
];

describe('format', () => {
  for (const te of tt) {
    it('t:' + te.fmt + ':' + te.val + ':' + te.len, async () => {
      expect(format(te.fmt, te.len)(te.val, te.pos)).to.eq(te.res);
    });
  }
});

/* eslint-env mocha */
