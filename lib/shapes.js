'use strict';

const or1 = val => (val > 1) ? val : 1;

module.exports = cfg => {
  const h = cfg.h;
  const hh = h >> 1; // half heigth
  return {
    vec: [
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
    ],
    bit: [
      (x, l) => ['path', {d:'M' + x + ',' + h + 'h' + l}],                            // 0 -> 0
      (x, l) => ['path', {d:'M' + x + ',0v' + h + 'h' + l}],                          // 1 -> 0
      (x, l) => ['path', {d:'M' + x + ',' + hh + 'v' + hh + 'h' + l}],                // 2 -> 0
      (x, l) => ['path', {d:'M' + x + ',' + hh + 'v' + hh + 'h' + l}],                // 3 -> 0

      (x, l) => ['path', {d:'M' + x + ',' + h + 'v-' + h + 'h' + l,   class: 'b1'}],  // 0 -> 1
      (x, l) => ['path', {d:'M' + x + ',0h' + l,                      class: 'b1'}],  // 1 -> 1
      (x, l) => ['path', {d:'M' + x + ',' + hh + 'v-' + hh + 'h' + l, class: 'b1'}],  // 2 -> 1
      (x, l) => ['path', {d:'M' + x + ',' + hh + 'v-' + hh + 'h' + l, class: 'b1'}],  // 3 -> 1

      (x, l) => ['path', {d:'M' + x + ',' + h + 'v-' + hh + 'h' + l,  class: 'bx'}],  // 0 -> 2
      (x, l) => ['path', {d:'M' + x + ',0v' + hh + 'h' + l,           class: 'bx'}],  // 1 -> 2
      (x, l) => ['path', {d:'M' + x + ',' + hh + 'h' + l,             class: 'bx'}],  // 2 -> 2
      (x, l) => ['path', {d:'M' + x + ',' + hh + 'h' + l,             class: 'bx'}],  // 3 -> 2

      (x, l) => ['path', {d:'M' + x + ',' + h + 'v-' + hh + 'h' + l,  class: 'bz'}],  // 0 -> 3
      (x, l) => ['path', {d:'M' + x + ',0v' + hh + 'h' + l,           class: 'bz'}],  // 1 -> 3
      (x, l) => ['path', {d:'M' + x + ',' + hh + 'h' + l,             class: 'bz'}],  // 2 -> 3
      (x, l) => ['path', {d:'M' + x + ',' + hh + 'h' + l,             class: 'bz'}]   // 3 -> 3
    ]
  };
};
