'use strict';

const defaultElemento = {
  container:  ['div', {class: 'wd-container', id: 'wd-container'}],
  grid:       ['div', {class: 'wd-grid'}],    // style: 'position: absolute; left: 0px;' // z-index: -10'
  view0:      ['div', {class: 'wd-view'}],    // style: 'position: absolute; left: 0px;' // z-index: -10'
  values:     ['div', {class: 'wd-values'}], // style: 'position: absolute; left: 0px;' // z-index: -9'
  cursor:     ['div', {class: 'wd-cursor'}], // style: 'position: absolute; top: 0px; left: 0px;'
  // style: 'overflow: hidden; position: absolute; top: 0px; left: 0px;'
  waveqlPanel: ['div', {class: 'wd-waveql'}],
  rightPanel: ['div', {class: 'wd-help-panel'}],
  menu:       ['div', {class: 'wd-help-icon'}] // style: 'position: absolute; right: 32px; bottom: 32px;'
};

const defaultLayers = [
  'grid',
  'view0',
  'values',
  'waveqlPanel',
  'cursor',
  'rightPanel',
  'menu'
];

const createElemento = elemento => {
  const names = Object.keys(elemento);
  return names.reduce((res, name) => {
    const ml = elemento[name];
    const el = document.createElement(ml[0]);
    const attr = (typeof ml[1] === 'object') ? ml[1] : {};
    Object.keys(attr).map(key => {
      if (key === 'class') {
        el.classList.add(attr.class);
      } else {
        el.setAttribute(key, attr[key]);
      }
    });
    res[name] = el;
    return res;
  }, {});
};

const createContainer = (els, layers) => {
  layers.map(layer => els.container.appendChild(els[layer]));
  return els.container;
};

exports.defaultElemento = defaultElemento;
exports.defaultLayers = defaultLayers;
exports.createElemento = createElemento;
exports.createContainer = createContainer;

/* eslint-env browser */