'use strict';

const tt = require('onml/tt.js');
const tAtX = require('./t-at-x.js');
const getX = require('./get-x.js');

const progress = (lane, desc, tStart, tFinish) => {
  const pco = {};

  const { tgcd, listing } = desc;
  const { signals, len } = lane;

  signals.map(sig => { sig.i = 0; });

  tStart /= tgcd;
  tFinish /= tgcd;

  console.log(tStart, tFinish);

  let cursor = tStart;

  for (let k = 0; k < 500; k++) {
    // move signal indexes to the first point after cursor
    signals.map(signal => {
      const wave = signal.wave;
      for (let i = signal.i || 0; i < wave.length; i++) {
        const t = wave[i][0];
        if (t > cursor) {
          signal.i = i;
          break;
        }
      }
    });

    // move cursor to the first point
    cursor = Math.min(...signals.map(e => e.wave[e.i][0]));

    if (cursor > tFinish) {
      break;
    }
    console.log(cursor);

    // collect all bricks at cursor
    signals.map(sig => {
      const [t, v] = sig.wave[sig.i];
      if (t === cursor) {
        const le = listing[v];
        if (le) {
          if (pco[v] === undefined) {
            if (Object.keys(pco).length > len) {
              return;
            }
            pco[v] = {op: le.op, asm: le.asm, bricks: []};
          }
          pco[v].bricks.push({name: sig.name, label: sig.label, t});
        }
      }
    });
  }


  Object.keys(pco).map((key, idx) => {
    if (pco[key] !== undefined) {
      pco[key].idx = idx;
    }
  });

  return pco;
};

const water = (lane, desc, pstate) => {
  const { width, sidebarWidth, yStep } = pstate;
  const xStartExact = tAtX(sidebarWidth, pstate);
  const xFinishExact = tAtX(width, pstate);
  const brickWidth = getX(pstate, 2) - getX(pstate, 0);

  lane.signals.map(signal => {
    signal.wave = desc.chango[signal.ref].wave;
  });

  const pco = progress(lane, desc, xStartExact, xFinishExact);

  const pcs = Object.keys(pco);

  console.log(lane.signals, pco);

  const mLanes = [];

  // const pco = getPco(desc, pstate, lane); // signals, dats, cycles, listing, state.cursor);
  // console.log(lane);
  for (let j = 0; j < lane.len - 2; j++) {
    const pc = pcs[j];
    const pcd = pco[pc];
    if (pc === undefined || pcd === undefined) {
      break;
    }

    const asm = pcd.asm.replace(/<.+>/, '\u25C6');
    const mLane = ['g', tt(0, Math.round(j * yStep / 2)),
      // row header
      ...((j & 1) ? [['rect', {width: width, height: yStep / 2 - 2, class: 'pc-odd'}]] : []),
      // ['rect', {width: width, height: yStep / 2 - 2, class: (j & 1) ? 'pc-odd' : 'pc-even'}],
      ['text', {x: 0,   'xml:space': 'preserve', y: yStep * 0.35, class: 'pc-addr'}, parseInt(pc, 10).toString(16).padStart(12, ' ')],
      ['text', {x: 88,  y: yStep * 0.35, class: 'pc-opcode'}, pcd.op],
      ['text', {x: 150, y: yStep * 0.35, class: 'pc-asm'}, asm],
      // bricks in row
      ...pcd.bricks.map(e => ['g', tt(getX(pstate, e.t)),
        ['rect', {class: e.name, width: brickWidth, height: 19, y: 1}],
        ...((brickWidth > 20) ? [['text', {class: e.name, width: brickWidth, x: brickWidth / 2, y: 16}, e.label]] : [])
      ])
    ];
    mLanes.push(mLane);
  }

  return mLanes;
};


module.exports = water;
