'use strict';

const defaultElemento = {
  container: ['div', {
    class: 'wd-container'
  }],
  view0: ['div', {
    class: 'wd-view',
    style: 'position: absolute; left: 0px;' // z-index: -10'
  }],
  values: ['div', {
    class: 'wd-values',
    style: 'position: absolute; left: 0px;' // z-index: -9'
  }],
  cursor: ['div', {
    class: 'wd-cursor'
    // style: 'position: absolute; top: 0px; left: 0px;'
    // style: 'overflow: hidden; position: absolute; top: 0px; left: 0px;'
  }],
  // sidebar: ['textarea', {}],
  sidebar: ['div', {}],
  menu: ['div', {
    class: 'wd-menu',
    style: 'position: absolute; right: 32px; bottom: 32px;'
  }]
};

const defaultLayers = [
  'cursor',
  'view0',
  'values',
  'sidebar',
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