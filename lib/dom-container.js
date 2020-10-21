'use strict';

const onml = require('onml');

const tt = require('./tt.js');
const shaper = require('./shapes.js');
const genSVG = require('./gen-svg.js');
const timeline = require('./timeline.js');
const genKeyHandler = require('./gen-key-handler');
const scale = require('./scale.js');

const lane = {
  h: 16,
  gap: 8,
  step: 24,
  fontsize: 14
};

const genOnWheel = (element, pstate, render) => {
  return (event) => {
    if (event.ctrlKey) {
      event.preventDefault();
      if (event.deltaY < 0) {
        scale.plus(pstate);
        render();
      } else
      if (event.deltaY > 0) {
        scale.minus(pstate);
        render();
      }
    }
  };
};

const bit = (desc, pstate, idx) => {
  const {scale, time, t0} = pstate;
  const shapes = shaper(lane).bit;
  const wave = desc.wave;
  const res = ['g', tt(0, idx * lane.step + 8)];
  let stime = t0;
  let state = 0;
  let oldState = state;
  for (const point of wave) {
    const [newTime, newState] = point;
    const tdelta = newTime - stime;
    res.push(shapes[(state << 2) + oldState](stime * scale, tdelta * scale - 1));
    oldState = state;
    state = newState;
    stime = newTime;
  }
  const tdelta = time - stime;
  res.push(shapes[(state << 2) + oldState](stime * scale, tdelta * scale - 1));
  return res;
};

const vec = (desc, pstate, idx) => {
  const {scale, time, t0} = pstate;
  const shapes = shaper(lane).vec;
  const wave = desc.wave;
  const res = ['g', tt(0, idx * lane.step + 8)];
  let stime = t0;
  let state = 0;
  for (const point of wave) {
    const [newTime, newState] = point;
    const tdelta = newTime - stime;
    res.push(shapes[0](stime * scale, tdelta * scale - 1, state));
    stime = newTime;
    state = newState;
  }
  const tdelta = time - stime;
  res.push(shapes[0](stime * scale, tdelta * scale - 1, state));
  return res;
};

const waves = (obj, pstate) => {
  const chango = obj.chango || {};
  const view = obj.view;
  if (view !== undefined) {
    return view.map((e, i) => {
      const val = chango[e.ref];
      if (val.kind === 'bit') {
        return bit(val, pstate, i);
      }
      if (val.kind === 'vec') {
        return vec(val, pstate, i);
      }
    });
  }
  return Object.keys(chango).map((key, i) => {
    const val = chango[key];
    if (val.kind === 'bit') {
      return bit(val, pstate, i);
    }
    if (val.kind === 'vec') {
      return vec(val, pstate, i);
    }
  });
};


const mainSVG = (desc, pstate) => {
  const wires = waves(desc, pstate);
  return genSVG(
    (((desc.time - desc.t0) * pstate.scale) |0) + 200 + 1,
    wires.length * lane.step + 8,
    [['g', tt(200 - ((desc.t0 * pstate.scale) |0) + .5, .5, {class: 'bit'})].concat(wires)]
  );
};

const sidebarSVG = (desc) => genSVG(
  200,
  desc.view.length * lane.step + 8,
  desc.view.map((e, i) =>
    ['text', {class: 'txt', x: 10, y: lane.step * i + 24}, e.name]
  )
);

const createElements = els => {
  const names = Object.keys(els);
  return names.reduce((res, name) => {
    const ml = els[name];
    const el = document.createElement(ml[0]);
    const attr = (typeof ml[1] === 'object') ? ml[1] : {};
    attr.class && el.classList.add(attr.class);
    attr.style && el.setAttribute('style', attr.style);
    res[name] = el;
    return res;
  }, {});
};

module.exports = (content, desc) => {

  desc.t0 = desc.t0 || 0;
  const pstate = {
    scale: 64,
    t0: desc.t0 || 0,
    time: desc.time
  };

  const {timetopSVG, timebotSVG} = timeline(desc);

  const els = createElements({
    container: ['div', {
      class: 'wd-container',
      style: 'height: inherit; min-height: inherit; max-height: inherit; background-color: #111; overflow: auto; position: relative; scrollbar-color: #555 #222;'
    }],
    timetop: ['div', {
      class: 'timeline',
      style: 'position: sticky; top: 0; background-color: #222e; z-index: 1;'
    }],
    view0: ['div', {
      class: 'view',
      style: 'position: absolute; left: 0px;'
    }],
    sidebar: ['div', {
      class: 'sidebar',
      style: 'background-color: #222e; position: sticky; overflow: visible; left: 0px; width: 200px; z-index: 2;'
    }],
    timebot: ['div', {
      class: 'timeline',
      style: 'position: sticky; bottom: 0; background-color: #222e; z-index: 1;'
    }]
  });

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
    console.log('render time: ' + (Date.now() - t0));
  };

  els.container.addEventListener('keydown', genKeyHandler(content, pstate, render));
  els.container.addEventListener('mousewheel', genOnWheel(content, pstate, render));

  render();
};

/* eslint-env browser */
