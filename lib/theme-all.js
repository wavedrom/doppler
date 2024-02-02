'use strict';

const helpPanel = require('./help-panel.js');

const body = {
  '*': {
    // width: '90%',
    'scrollbar-width': 'auto',
    'scrollbar-color': '#aaa #555'
  },
  '*::-webkit-scrollbar': {
    width: '8px'
  },
  '*::-webkit-scrollbar-track': {
    background: '#555'
  },
  '*::-webkit-scrollbar-thumb': {
    'background-color': '#777',
    'border-radius': '4px',
    border: '1px solid #aaa'
  },
  body: {
    /* overflow-x: hidden; */
    /* overflow-y: auto; */
    overflow: 'hidden',
    /* overflow: auto; */
    padding: '0px',
    margin: '0px',
    border: '0px',
    background: '#111',
    color: '#fff',
    'font-family': 'Iosevka Drom Web',
    /* font-size: 16px; */
    height: '100%'
  }
};

const wd = {
  '.wd-container': {
    /* background-color: #1c1c1c; */
    /* overflow-x: hidden; */
    /* overflow-y: auto; */
    /* overflow: hidden; */
    /* overflow: auto; */
    '--right-panel-width': '0px',
    width: 'calc(100% - var(--right-panel-width))',
    // height: '100%',
    cursor: 'col-resize',
    transition: 'width .3s',
    position: 'absolute',
    top: '0px',
    bottom: '0px',
    left: '0px',
    right: '0px'
  },
  '.wd-grid': {
    position: 'absolute'
  },
  '.wd-view': {
    position: 'absolute',
    top: '24px',
    bottom: '24px'
  },
  '.wd-values': {
    position: 'absolute',
    top: '24px',
    bottom: '24px'
  },
  '.wd-waveql': {
    position: 'absolute',
    top: '24px',
    bottom: '24px',
    width: '100%',
    transition: 'width .3s'
    // width: '100%'
  },
  '.wd-cursor': {
    position: 'absolute',
    /* z-index: 1; */
    'pointer-events': 'none'
  },
  'line.wd-cursor-line': {
    'stroke-dasharray': '4 3',
    stroke: '#fff7',
    'stroke-width': '1px'
  },
  'text.wd-cursor-time': {
    'font-size': '20px',
    fill: 'hsl(70, 100%, 50%)',
    'text-anchor': 'middle',
    'z-index': 1
  },
  'rect.wd-cursor-time': {
    fill: '#222'
  },
  '.wd-values text': {
    'font-size': '14px',
    'text-anchor': 'middle',
    fill: '#fff'
  },
  'line.wd-grid-time': {
    stroke: '#333',
    'stroke-width': '1px'
  },
  'text.wd-grid-time': {
    'text-anchor': 'middle',
    fill: 'hsla(49, 100%, 50%, 0.7)'
  },

  '.wd-progress': {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },

  'text.xred': {
    fill: 'hsl(0, 100%, 50%)'
  },
  'text.zxviolet': {
    fill: 'hsl(287, 100%, 67%)'
  },

  'text.pc':          { 'text-anchor': 'start' },
  'tspan.pc-addr':    { fill: 'hsl(202 100% 71%)' },
  'tspan.pc-opcode':  { fill: 'hsl(37 100% 50%)' },
  'tspan.pc-asm':     { fill: 'hsl(0 0% 100%)' },
  'rect.pc-odd':      { fill: '#222' },
  'rect.pc-even':     { fill: '#444' },

  '.event0': { fill: 'hsla(0, 0%, 100%, 0.3)' },
  '.event1': { fill: 'hsl(101, 100%, 50%)' },
  '.event2': { fill: 'hsl(57, 100%, 50%)' },
  '.event3': { fill: 'hsl(32, 100%, 50%)' },

  'line.gap': { stroke: '#fff', 'stroke-dasharray': '4 3' }
};

const cto = {};
for (let i = 0; i < 36; i++) {
  cto['rect.ct' + i.toString(36)] = {
    fill: 'hsla(' + (i * 10) + ', 100%, 50%, 0.5)'
  };
}

const pco = {};
for (let i = 0; i < 8; i++) {
  cto['rect.pc' + i] = {
    fill: 'none',
    'stroke-width': '4px',
    stroke: 'hsl(' + ((30 + i * 135) % 360) + ', 100%, 75%)'
  };
}

module.exports = Object.assign(body, wd, helpPanel.css, cto, pco);

/* eslint-env browser */
