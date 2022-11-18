'use strict';

// PC based pipeline view

const tt = require('onml/tt.js');
const getX = require('./get-x.js');
const surferer = require('./surferer.js');
const sampler = require('./sampler.js');
const hash = require('./hash.js');

const pushBrick = (listing, pco, v, name, label, t) => {
  let pc = v;
  let tail = false;
  let le = listing[pc];
  if (le === undefined) {
    pc = v - 2;
    le = listing[pc];
    tail = true;
  }
  if (le) {
    if (pco[pc] === undefined) {
      pco[pc] = {op: le.op, asm: le.asm, bricks: []};
    }
    pco[pc].bricks.push({name, label, t, tail});
  }
};

const progress = (lane, desc, pstate) => {
  const pco = {};

  const { listing } = desc;
  const { clock, othero } = lane;

  const clockWave = desc.chango[clock.ref].wave;
  const clockEr = surferer(clockWave, pstate);

  // create samplers
  for (const id of Object.keys(othero)) {
    ['pc', 'go'].map(role => {
      const obj = othero[id][role];
      obj.sampler = sampler(desc.chango[obj.ref].wave);
      obj.sampler.next(0); // dry run
    });
  }

  let count = 8000; // max number of pipeline bricks

  outerLoop: for (const iClock of clockEr) {
    const [tClock, vClock] = clockWave[iClock];
    if (vClock) {
      for (const key of Object.keys(othero)) {
        const id = othero[key];
        const go = id.go.sampler.next(tClock).value;
        const pc = id.pc.sampler.next(tClock).value;
        const KEY = key.toUpperCase();
        if (go) {
          pushBrick(listing, pco, pc, KEY, KEY, tClock);
          if (count-- === 0) {
            break outerLoop;
          }
        }
      }
    }
  }

  for (const [idx, key] of Object.keys(pco).entries()) {
    if (pco[key] !== undefined) {
      pco[key].idx = idx;
    }
  }

  return pco;
};

const water = (lane, desc, pstate) => {
  const { width, yStep } = pstate;
  const brickWidth = getX(pstate, 2) - getX(pstate, 0);

  const pco = progress(lane, desc, pstate);

  const pcs = Object.keys(pco).map(e => Number(e)).sort();

  const mLanes = [];

  // const pco = getPco(desc, pstate, lane); // signals, dats, cycles, listing, state.cursor);
  for (let j = 0; j < lane.len - 2; j++) {
    const pc = pcs[j];
    const pcd = pco[pc];
    if (pc === undefined || pcd === undefined) {
      break;
    }

    const asm = pcd.asm.replace(/<.+>/, '\u25C6');
    const mLane = ['g', tt(0, Math.round(j * yStep))];

    // striped background
    if (j & 1) {
      mLane.push(['rect', {width: width, height: yStep - 1, class: 'pc-odd'}]);
      // ['rect', {width: width, height: yStep - 2, class: (j & 1) ? 'pc-odd' : 'pc-even'}],
    }

    // dotted separator
    if ((j > 0) && (pc - pcs[j - 1] > 4)) {
      mLane.push(['line', {class: 'gap', x1: 0, y1: 0, x2: width, y2: 0}]);
    }

    // row header
    mLane.push(['text', {class: 'pc', 'xml:space': 'preserve', y: Math.round(yStep * .7)},
      ['tspan', {class: 'pc-addr'}, parseInt(pc, 10).toString(16).padStart(12, ' ')],
      ['tspan', {class: 'pc-opcode'}, pcd.op.padStart(9, ' ')],
      ' ',
      ['tspan', {class: 'pc-asm'}, asm]
    ]);

    // bricks in row
    pcd.bricks.map(e => {
      mLane.push(['g', tt(Math.round(getX(pstate, e.t))),
        ['rect', {
          class: (e.label === '') ? e.name : 'ct' + hash(e.name).toString(36),
          width: brickWidth,
          height: (e.tail ? (yStep >> 1) : yStep) - 3,
          y: e.tail ? ((yStep >> 1) + 1) : 1,
          'data-stage': e.label
        }],
        ...((brickWidth > 20) ? [['text', {class: e.name, width: brickWidth, x: brickWidth / 2, y: 16}, e.label]] : [])
      ]);
    });

    mLanes.push(mLane);
  }
  return mLanes;
};


module.exports = water;
