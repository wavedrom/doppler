'use strict';

const onml = require('onml');
// const json5 = require('json5');

const tt = require('./tt.js');
const bitShapes = require('./bit-shapes.js');
const genSVG = require('./gen-svg.js');

const timeline = require('./timeline.js');

const lane = {
  h: 16,
  gap: 8,
  step: 24,
  fontsize: 14
};

const or1 = val => (val > 1) ? val : 1;

const vecShapes = h => {
  return [
    (x, l, label) => {
      label = label.toString(16);
      const ll = or1(l - 4);
      const mb = -(ll + 4);
      const path = ['path', {d: 'M' + x + ',0h0l4,' + h + 'h' + ll + 'm' + mb + ',0h0l4,-' + h + 'h' + ll}];
      if (l < (label.length * 9 + 2)) {
        return path;
      }
      return ['g', path, ['text', {class: 'txt', x: x + 6, y: (0.8 * h)|0}, label]];
    }
  ];
};

const scalePlus = pstate => {
  let scale = pstate.scale;
  if (scale === 1024) {
    return false;
  }
  scale *= 2;
  if (scale > 1024) {
    scale = 1024;
  }
  pstate.scale = scale;
  return true;
};

const scaleMinus = pstate => {
  let scale = pstate.scale;
  if (scale === (1 / 1024)) {
    return false;
  }
  scale /= 2;
  if (scale < (1 / 1024)) {
    scale = (1 / 1024);
  }
  pstate.scale = scale;
  return true;
};

const genKeyHandler = (div, pstate, render) => {
  return event => {
    console.log(event.key);
    switch (event.key) {
    case '+':
    case '=':
      scalePlus(pstate) && render();
      break;
    case '-':
    case '_':
      scaleMinus(pstate) && render();
      break;
    }
  };
};

const genOnScroll = (element) => {
  return event => {
    console.log(document.body.scrollTop, document.body.scrollLeft);
  };
};

const bit = (desc, scale, idx) => {
  const shapes = bitShapes(lane.h);
  const wave = desc.wave;
  let state = wave[0][1];
  let stime = 0;
  const res = ['g', tt(0, idx * lane.step + 8)];
  for (const point of wave) {
    const [newTime, newState] = point;
    const tdelta = newTime - stime;
    res.push(shapes[(newState << 2) + state](stime * scale, tdelta * scale - 1));
    stime = newTime;
    state = newState;
  }
  return res;
};

const vec = (desc, scale, idx) => {
  const shapes = vecShapes(lane.h);
  const wave = desc.wave;
  let stime = 0;
  const res = ['g', tt(0, idx * lane.step + 8)];
  for (const point of wave) {
    const [newTime, newState] = point;
    const tdelta = newTime - stime;
    res.push(shapes[0](stime * scale, tdelta * scale - 1, newState));
    stime = newTime;
  }
  return res;
};

const waves = (obj, pstate) => {
  const chango = obj.chango || {};
  const view = obj.view;
  if (view !== undefined) {
    return view.map((e, i) => {
      const val = chango[e.ref];
      if (val.kind === 'bit') {
        return bit(val, pstate.scale, i);
      }
      if (val.kind === 'vec') {
        return vec(val, pstate.scale, i);
      }
    });
  }
  return Object.keys(chango).map((key, i) => {
    const val = chango[key];
    if (val.kind === 'bit') {
      return bit(val, pstate.scale, i);
    }
    if (val.kind === 'vec') {
      return vec(val, pstate.scale, i);
    }
  });
};


const mainSVG = (desc, pstate) => {
  const wires = waves(desc, pstate);
  return genSVG(
    ((desc.time * pstate.scale) |0) + 200 + 1,
    wires.length * lane.step + 8,
    [['g', tt(200.5, .5, {class: 'bit'})].concat(wires)]
  );
};

const sidebarSVG = (desc) => genSVG(
  200,
  desc.view.length * lane.step + 8,
  desc.view.map((e, i) =>
    ['text', {class: 'txt', x: 10, y: lane.step * i + 24}, e.name]
  )
);

const getFramework = els => els.reduce((res, e) => {
  const el = document.createElement(e.kind || 'div');
  e.class && el.classList.add(e.class);
  e.style && el.setAttribute('style', e.style);
  res[e.name] = el;
  return res;
}, {});

global.Doppler = (divName) => {
  const pstate = {scale: 64};

  const content = document.getElementById(divName);
  const src = content.innerHTML;
  const desc = JSON.parse(src);
  // console.log(desc.wires);
  content.innerHTML = '';

  const {timetopSVG, timebotSVG} = timeline(desc);

  const els = getFramework([{
    name: 'container',
    class: 'wd-container',
    style: 'height: inherit; min-height: inherit; max-height: inherit; background-color: #111; overflow: auto; position: relative; scrollbar-color: #555 #222;'
  }, {
    name: 'timetop',
    class: 'timeline',
    style: 'position: sticky; top: 0; background-color: #222e; z-index: 1;'
  }, {
    name: 'view0',
    class: 'view',
    style: 'position: absolute; left: 0px;'
  }, {
    name: 'sidebar',
    class: 'sidebar',
    style: 'background-color: #222e; position: sticky; overflow: visible; left: 0px; width: 200px; z-index: 2;'
  }, {
    name: 'timebot',
    class: 'timeline',
    style: 'position: sticky; bottom: 0; background-color: #222e; z-index: 1;'
  }]);

  els.timetop.innerHTML = 'top';
  els.timebot.innerHTML = 'bot';

  [els.timetop, els.view0, els.sidebar, els.timebot]
    .map(e => els.container.appendChild(e));

  content.appendChild(els.container);

  els.sidebar.innerHTML = onml.stringify(sidebarSVG(desc, pstate));

  const render = () => {
    const t0 = Date.now();
    els.view0.innerHTML = onml.stringify(mainSVG(desc, pstate));
    els.timetop.innerHTML = onml.stringify(timetopSVG(pstate));
    els.timebot.innerHTML = onml.stringify(timebotSVG(pstate));
    console.log(Date.now() - t0);
  };

  document.addEventListener('keydown', genKeyHandler(content, pstate, render));
  document.addEventListener('scroll', genOnScroll(content));
  render();

};

/* eslint-env browser */
