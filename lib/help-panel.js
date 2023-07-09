'use strict';

const genSVG = require('onml/gen-svg.js');

const width = exports.width = 320;

exports.toggle = (pstate) => {
  console.log('toggle');
  const visible = pstate.rightPanelVisible = !pstate.rightPanelVisible;
  pstate.container.style.setProperty(
    '--right-panel-width',
    (visible ? width : 0) + 'px'
  );
};

exports.mlIcon = () => {
  const qMark = ['g', {w: 24, h: 24},
    ['circle', {style: 'fill: #facd6a26', r: 12, cx: 12, cy: 12}],
    ['path', {style: 'fill: #6e6f19', d: 'M 12 4 a 7 7 0 1 1 0 16 a 7 7 0 1 1 0 -16 z v -1 a 8 8 0 1 0 0 18 a 8 8 0 1 0 0 -18 z'}],
    ['path', {style: 'fill: #c8a100', d: 'M 9.255 9.786 a .237 .237 0 0 0 .241 .247 h .825 c .138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0 -.552 -.42 -.94 -1.029 -.94 -.584 0 -1.009 .388 -1.009 .94 z'}]
  ];

  const svg = genSVG(24, 24);
  svg[1].width = 48;
  svg[1].height = 48;
  svg.push(qMark);
  // return ['a', {href, target: '_blank'}, svg];
  return svg;
};

const mouseOutline = ['path', {
  style: 'stroke:#fff;fill:none',
  d: 'm 14,8 c 1,0 2,1 2,2 v 5 c 0,1 -1,2 -2,2 -1,0 -2,-1 -2,-2 v -5 c 0,-1 1,-2 2,-2 m 0,0 V 6 m 0,13 V 17 M 3,22 V 13 C 3,8 10,6 13,6 h 2 c 3,0 10,2 10,7 v 9'
}];

const mouseWheel = ['path', {
  style: 'stroke:none;fill:#aa0',
  d: 'm 14,8.5 c 1,0 2,1 2,2 v 5 c 0,1 -1,2 -2,2 -1,0 -2,-1 -2,-2 v -5 c 0,-1 1,-2 2,-2'
}];

const icons = {
  scrollUp: genSVG(28, 24).concat([
    mouseWheel,
    mouseOutline,
    ['path', {style: 'stroke:#fff;fill:none', d: 'm 10,4 4,-3 4,3'}]
  ]),
  scrollDown: genSVG(28, 24).concat([
    mouseWheel,
    mouseOutline,
    ['path', {style: 'stroke:#fff;fill:none', d: 'm 10,20 4,3 4,-3'}]
  ])
};

exports.mlPanel = (keyBindo) => {
  const ml = ['div',
    ['div', {class: 'wd-help-panel-row'},
      ['h3', 'Keyboard / Mouse shortcuts']
    ]
  ];
  const descMap = Object.keys(keyBindo).reduce((res, key) => {
    const val = keyBindo[key];
    const desc = val.desc;
    if (desc) {
      res[desc] = (res[desc] || []).concat(key);
    }
    return res;
  }, {});

  Object.keys(descMap).map((desc, i) => {
    ml.push(['div',
      {class: 'wd-help-panel-row' + ((i & 1) ? '' : ' wd-even')},
      ['span', {class: 'wd-key-help-desc'}, desc],
      ['span', {class: 'wd-key-help-comb'},
        ...descMap[desc].map((d) => ['span',
          {class: 'wd-key-group'},
          ...d.split('+').flatMap((item, i) => {
            const res = (i === 0) ? [] : ['+'];
            const kind = item.split(':');
            if (kind[0] === 'icon') {
              res.push(icons[kind[1]]);
            } else {
              res.push(['span', {class: 'wd-key-item'}, item]);
            }
            return res;
          })
        ])
      ]
    ]);
  });
  return ml;
};

exports.css = {
  '.wd-help-icon': {
    cursor: 'help',
    position: 'absolute',
    right: 'calc(var(--right-panel-width) * ' + (1 - 80 / width) + ' + 20px)',
    transition: 'right .3s',
    bottom: '32px'
  },
  '.wd-help-panel': {
    width,
    'font-size': 16,
    position: 'absolute',
    right: 'calc(var(--right-panel-width) - ' + width + 'px)',
    transition: 'right .3s',
    top: '0px',
    height: '100%',
    'overflow-y': 'auto'
  },
  '.wd-even': {
    background: '#ffffff11'
  },
  '.wd-help-panel-row': {
    display: 'flex',
    padding: '10px 10px 10px 10px'
  },
  '.wd-key-help-desc': {
    display: 'flex',
    'align-items': 'center',
    'flex-grow': 1
  },
  '.wd-key-help-comb': {
    display: 'flex',
    'flex-direction': 'column'
  },
  '.wd-key-item': {
    'border-style': 'outset',
    'border-radius': '6px',
    'border-color': '#655 #27a #27a #655',
    padding: '0 4',
    margin: '0 2'
  },
  '.wd-key-group': {
    display: 'flex',
    padding: '0 0 4 0'
  }
};
