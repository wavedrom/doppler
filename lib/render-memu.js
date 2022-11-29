'use strict';

const genSVG = require('onml/gen-svg.js');
const stringify = require('onml/stringify.js');


const renderMenu = href => {

  const qMark = ['g', {w: 24, h: 24},
    ['circle', {style: 'fill: #facd6a26', r: 12, cx: 12, cy: 12}],
    ['path', {style: 'fill: #6e6f19', d: 'M 12 4 a 7 7 0 1 1 0 16 a 7 7 0 1 1 0 -16 z v -1 a 8 8 0 1 0 0 18 a 8 8 0 1 0 0 -18 z'}],
    ['path', {style: 'fill: #c8a100', d: 'M 9.255 9.786 a .237 .237 0 0 0 .241 .247 h .825 c .138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0 -.552 -.42 -.94 -1.029 -.94 -.584 0 -1.009 .388 -1.009 .94 z'}]
  ];

  const svg = genSVG(24, 24);
  svg[1].width = 48;
  svg[1].height = 48;
  svg.push(qMark);

  const menu = ['a', {href, target: '_blank'}, svg];

  return stringify(menu);
};

module.exports = renderMenu;
