'use strict';

const onml = require('onml');
const range = require('lodash.range');
// const json5 = require('json5');

const w3 = require('./w3.js');
const tt = require('./tt.js');
const bitShapes = require('./bit-shapes.js');

const or1 = val => (val > 1) ? val : 1;

const vecShapes = h => {
  return [
    (x, l, label) => {
      const ll = or1(l - 4);
      const mb = -(ll + 4);
      const path = ['path', {d: 'M' + x + ',0h0l4,' + h + 'h' + ll + 'm' + mb + ',0h0l4,-' + h + 'h' + ll}];
      if (l < 32) {
        return path;
      }
      return ['g', path, ['text', {class: 'txt', x: x + 6, y: (0.75 * h)|0}, label.toString(16)]];
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
  const shapes = bitShapes(24);
  const wave = desc.wave;
  let state = wave[0][1];
  let stime = 0;
  const res = ['g', tt(0, idx * 32 + 8)];
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
  const shapes = vecShapes(24);
  const wave = desc.wave;
  let stime = 0;
  const res = ['g', tt(8, idx * 32 + 8)];
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

const genSVG = (w, h, body) => {
  w = Math.ceil(w);
  h = Math.ceil(h);
  return ['svg', {
    xmlns: w3.svg, 'xmlns:xlink': w3.xlink,
    width: w, height: h,
    viewBox: '0 0 ' + w + ' ' + h
  }].concat(body || []);
};

const timetopSVG = (desc, pstate) => {
  const w = desc.time * pstate.scale |0;
  return genSVG(
    w + 8 + 200 + 1,
    16,
    [['g', tt(200.5, 11.5, {style: 'stroke: #fff; fill: none; stroke-width: 1px; stroke-linecap: square;'})]
      .concat(range(10).map(i =>
        ['g', tt(i * 10), ['line', {y2: 4}], ['text', {class: 'txt', y: -2}, i]]
      ))
    ]
  );
};

const timebotSVG = (desc, pstate) => {
  const w = desc.time * pstate.scale |0;
  return genSVG(
    w + 8 + 200 + 1,
    16,
    [['g', tt(200.5, 8.5, {style: 'stroke: #fff; fill: none; stroke-width: 1px; stroke-linecap: square;'})]
      .concat(range(10).map(i =>
        ['g', tt(i * 10), ['line', {y2: -8}], ['text', {class: 'txt', y: 7}, i]],
      ))
    ]
  );
};

const mainSVG = (desc, pstate) => {
  const wires = waves(desc, pstate);
  return genSVG(
    desc.time * pstate.scale + 8,
    wires.length * 32 + 8,
    [['g', tt(200.5, .5, {class: 'bit'})].concat(wires)]
  );
};

const sidebarSVG = (desc) => genSVG(
  200,
  desc.view.length * 32 + 8,
  desc.view.map((e, i) =>
    ['text', {class: 'txt', x: 10, y: 32 * i + 24}, e.name]
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
    els.timetop.innerHTML = onml.stringify(timetopSVG(desc, pstate));
    els.timebot.innerHTML = onml.stringify(timebotSVG(desc, pstate));
    console.log(Date.now() - t0);
  };

  document.addEventListener('keydown', genKeyHandler(content, pstate, render));
  document.addEventListener('scroll', genOnScroll(content));
  render();

};

/* eslint-env browser */
