'use strict';

const getX = require('./get-x.js');
const surferer = require('./surferer.js');

const skipT = (wave, iStart, tLimit) => {
  let iRes = iStart;
  let [tRes, vRes] = wave[iStart];
  for (let i = iStart; i < wave.length; i++) {
    const [t, v] = wave[i];
    if (t >= tLimit) {
      break;
    }
    iRes = i;
    tRes = t;
    vRes = v;
  }
  return [iRes, vRes, tRes];
};

const bracer = (lane, desc, pstate) => {
  const body = lane.body;
  const { yStep } = pstate;
  let { clock, valid, ready, up } = body;
  up = up || 1;

  const res = [];
  let count = 0;

  if (clock && clock.ref) {
    const clockWave = desc.chango[clock.ref].wave;
    const clockEr = surferer(clockWave, pstate);
    let tPrevClock = 0;

    if (valid && valid.ref) {
      const validWave = desc.chango[valid.ref].wave;
      let iValid = 0;
      let vValid;

      if (ready && ready.ref) {
        const readyWave = desc.chango[ready.ref].wave;
        let iReady = 0;
        let vReady;

        for (const iClock of clockEr) {
          const [tClock, vClock] = clockWave[iClock];
          if (vClock) {
            [iValid, vValid] = skipT(validWave, iValid, tClock);
            [iReady, vReady] = skipT(readyWave, iReady, tClock);
            const xClock = getX(pstate, tClock);
            const xPrevClock = getX(pstate, tPrevClock);
            const width = xClock - xPrevClock;
            const height = up * yStep;
            if (xClock > 0 && xPrevClock > 0 && width > 0) {
              if (vValid) {
                if (width >= 1) {
                  if (vReady) {
                    res.push(['rect', {fill: 'url(\'#valid&ready\')', width: Math.round(width), height, x: Math.round(xPrevClock), y: -height}]);
                  } else {
                    res.push(['rect', {fill: 'url(\'#valid&~ready\')', width: Math.round(width), height, x: Math.round(xPrevClock), y: -height}]);
                  }
                  count++;
                } else {
                  count += 10;
                }
              }
            }
            tPrevClock = tClock;
            if (count > 500) {
              return res;
            }
          }
        }
      } else {
        for (const iClock of clockEr) {
          const [tClock, vClock] = clockWave[iClock];
          if (vClock) {
            [iValid, vValid] = skipT(validWave, iValid, tClock);
            const xClock = getX(pstate, tClock);
            const xPrevClock = getX(pstate, tPrevClock);
            const width = xClock - xPrevClock;
            const height = up * yStep;
            if (xClock > 0 && xPrevClock > 0 && width > 0) {
              if (vValid) {
                if (width >= 1) {
                  res.push(['rect', {fill: 'url(\'#valid\')', width: Math.round(width), height, x: Math.round(xPrevClock), y: -height}]);
                  count++;
                } else {
                  count += 10;
                }
              }
            }
            tPrevClock = tClock;
            if (count > 500) {
              return res;
            }
          }
        }
      }
    }
  }
  return res;
};

module.exports = bracer;

/* eslint complexity: [1, 55] */