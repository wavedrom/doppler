'use strict';

const tt = require('onml/tt.js');
const genSVG = require('onml/gen-svg.js');
const stringify = require('onml/stringify.js');
// const getPco = require('./get-pco.js');
const water = require('./water.js');
const bracer = require('./bracer.js');
const vline = require('./vline.js');
const getX = require('./get-x.js');
const vlineStylo = require('./vline-stylo.js');

const defs = ['defs',
  ['linearGradient', {id: 'valid'},
    ['stop', {offset: '30%', 'stop-color': 'hsla(100, 100%, 100%,  0)'}],
    ['stop', {offset: '90%', 'stop-color': 'hsla(100, 100%, 100%, .3)'}]
  ],
  ['linearGradient', {id: 'valid&ready'},
    ['stop', {offset: '30%', 'stop-color': 'hsla(100, 100%, 50%,  0)'}],
    ['stop', {offset: '90%', 'stop-color': 'hsla(100, 100%, 50%, .5)'}]
  ],
  ['linearGradient', {id: 'valid&~ready'},
    ['stop', {offset: '30%', 'stop-color': 'hsla(50, 100%, 50%,  0)'}],
    ['stop', {offset: '90%', 'stop-color': 'hsla(50, 100%, 50%, .5)'}]
  ],
  ...Object.keys(vlineStylo).map(key => {
    const e = vlineStylo[key];
    return ['filter', {id: 'neonGlow-' + key, width: 7, x: -3},
      ['feGaussianBlur', {stdDeviation: 3, in: 'SourceAlpha', result: 'ablur'}],
      ['feFlood', {'flood-color': `hsl(${e.h},100%,${e.l}%)`, result: 'xf'}],
      ['feComposite', {in: 'xf', in2: 'ablur', operator: 'in'}]
    ];
  })
];

const getLabel = (vPre, mPre, x, w, fmt) => {
  const radix = (fmt || {}).radix;
  const base = ({
    b: 2, o: 8, d: 10, h: 16, H: 16
  })[radix] || 16;

  if (mPre) {
    if (vPre) {
      return ['text', {x, class: 'zxviolet'}, '?'];
    } else {
      return ['text', {x, class: 'xred'}, 'x'];
    }
  } else {
    const numPos = (w / 8) |0;
    let txtOrig = vPre.toString(base);
    if (radix === 'H') {
      txtOrig = txtOrig.toUpperCase();
    }

    // ? txtOrig.slice(0, numPos - 1) + '\u22ef' // MSB
    const txtShort = (txtOrig.length > numPos)
      ? ((numPos === 1)
        ? '\u22EE'
        : '\u22EF' + txtOrig.slice(1 - numPos)) // LSB
      : txtOrig;
    return ['text', {x}, ['title', txtOrig], txtShort]; // idx.toString(36)]);
  }
};

const renderValues = function* (desc, pstate) {
  const { width, height, sidebarWidth, yOffset, yStep, topBarHeight, botBarHeight } = pstate;
  const { view } = desc;

  const ilen = height / yStep;
  const iskip = yOffset / yStep;

  console.log(iskip, ilen, view.length);

  const ml = genSVG(width, height - topBarHeight - botBarHeight);

  let ifirst = 0;
  for (let i = 0; i < ilen; i += 1) {
    const lane = view[i];
    if (lane && (lane.name || lane.kind)) {
      if (i > iskip) {
        break;
      }
      ifirst = i;
    }
  }
  ml.push(defs);
  yield;

  const markers = ['g'];
  ml.push(markers);

  for (let i = 0; i < (iskip + ilen); i++) {
    const lane = view[i + (ifirst |0)];

    if (lane && lane.kind === 'DIZ') {
      markers.push(['g', tt(0, Math.round((i - (iskip - ifirst) + 1.18) * yStep))].concat(water(lane, desc, pstate)));
    } else

    if (lane && lane.kind === 'brace') {
      markers.push(['g', tt(0, Math.round((i - (iskip - ifirst) + 1.18) * yStep))].concat(bracer(lane, desc, pstate)));
    } else

    if (lane && lane.ref) {
      const chango = desc.chango[lane.ref];
      if (chango && chango.kind === 'vec') {
        const mLane = ['g', tt(0, Math.round((i - (iskip - ifirst) + .9) * yStep))];
        const { wave } = chango;
        const jlen = wave.length;

        perLane: {
          let [tPre, vPre, mPre] = wave[0];
          let xPre = getX(pstate, tPre);
          for (let j = 1; j <= jlen; j++) {
            const mark = wave[j];
            const [tCur, vCur, mCur] = (mark || [desc.time, 0, 0]);
            const xCur = getX(pstate, tCur);
            if (vPre || mPre) {
              if (xPre > width && xCur > width) { // both time stamps to the right
                break perLane;
              }
              if (!((xPre < sidebarWidth)  && (xCur < sidebarWidth))) { // both time stamps to the left
                const xPreNorm = ((xPre > sidebarWidth) ? xPre : sidebarWidth) |0;
                const xCurNorm = ((xCur < width) ? xCur : width) |0;
                const w = xCurNorm - xPreNorm;
                if (w > 8) {
                  const x = Math.round((xPreNorm + xCurNorm) / 2);
                  mLane.push(getLabel(vPre, mPre, x, w, lane.format));
                }
              }
            }
            xPre = xCur;
            vPre = vCur;
            mPre = mCur;
          }
        }
        ml.push(mLane);
      }
      yield;
    }
  }

  // console.log(view);
  for (let i = 0; i < view.length; i++) {
    const lane = view[i];
    if (lane && lane.kind === 'vline') {
      markers.push(vline(lane, pstate, i));
    }
  }
  yield;
  return stringify(ml);
};

module.exports = renderValues;
/* eslint complexity: [1, 55] */
