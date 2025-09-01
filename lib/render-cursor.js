'use strict';

const genSVG = require('onml/gen-svg.js');
const stringify = require('onml/stringify.js');
const formatTime = require('./format-time.js');

const renderCursor = (cfg, pstate) => {
  const {xmargin, fontWidth, fontHeight} = cfg;
  const {height, xScale, xOffset, tgcd, timescale, xCursor} = pstate;

  const xx = Math.round((xCursor - xOffset) / xScale) * tgcd;
  const label = formatTime(xx, timescale);
  const lWidth = (label.length + 1) * fontWidth;

  const body = [
    // vertical line
    ['line', {
      class: 'wd-cursor-line',
      x1: xmargin + 0.5,
      x2: xmargin + 0.5,
      y1: 0,
      y2: height
    }],
    // top time label
    ['rect', {
      class: 'wd-cursor-time',
      x: Math.round(xmargin - lWidth / 2),
      y: 0,
      width: lWidth,
      height: Math.round(fontHeight * 1.1)
    }],
    ['text', {
      class: 'wd-cursor-time',
      x: xmargin,
      y: fontHeight
    }, label],
    // bottom time label
    ['rect', {
      class: 'wd-cursor-time',
      x: Math.round(xmargin - lWidth / 2),
      y: Math.round(height - fontHeight * 1.1),
      width: lWidth,
      height: Math.round(fontHeight * 1.1)
    }],
    ['text', {
      class: 'wd-cursor-time',
      x: xmargin,
      y: Math.round(height - fontHeight * .25)
    }, label]
  ];
  return stringify(genSVG(2 * xmargin, height).concat(body));
};

module.exports = renderCursor;
