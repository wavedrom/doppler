'use strict';

const chai = require('chai');
const hash = require('../lib/hash.js');

const expect = chai.expect;

const testo = {
  '0f_pc': 13,
  'f0_pc': 26,
  'f1_pc': 23,
  'f2_pc': 18,
  'id_pc': 11,
  'aga_pc': 12,
  'm1a_pc': 2,
  'm2a_pc': 31,
  'wba_pc': 28,
  'agb_pc': 17,
  'm1b_pc': 30,
  'm2b_pc': 24,
  'wbb_pc': 3
};

describe('hash', () => {
  it('collision', () => {
    Object.keys(testo).map(key => {
      // console.log(key, hash(key));
      expect(hash(key)).to.eq(testo[key]);
    });
  });
});

/* eslint-env mocha */
