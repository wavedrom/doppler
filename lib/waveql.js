'use strict';

const get = require('lodash.get');

exports.parser = wires => str => {
  const arr = str.split('\n');
  const path = [];
  let mat;
  const res = arr.map(row => {
    row = row.trim();
    const rowo = {};
    const cols = row.split(/\s+/);
    cols.map(col => {
      if (col === '...') { path.pop(); path.pop(); return; }
      if (col === '..')  { path.pop(); return; }
      if (col === '.')   { return; }
      if (col === '/')   { path.length = 0; return; }

      mat = col.match(/^%([<>^])?([+-])?([su])?([bodhHac])$/); if (mat) {
        rowo.format = {
          align: mat[1],
          plus:  mat[2],
          sign:  mat[3],
          radix: mat[4]
        };
        return;
      }

      const newPath = path.concat(col);
      const ref = get(wires, newPath, false);

      if (typeof ref === 'string') {
        rowo.name = col;
        rowo.ref = ref;
      } else
      if (typeof ref === 'object') {
        path.push(col);
      }
    });
    return rowo;
  });
  return res;
};

exports.cmMode = function(CodeMirror, desc) {
  const { wires } = desc;
  CodeMirror.defineMode('waveql', function() {
    return {
      startState: function() {
        return {path: []};
      },
      token: function (stream, stt) {
        // const line = stream.lineOracle.line;
        let mat;

        if (stream.eatSpace()) { return null; }

        mat = stream.match(/^\.\.\.(\s+|$)/); if (mat) { stt.path.pop(); stt.path.pop(); return 'punct'; }
        mat = stream.match(/^\.\.(\s+|$)/);   if (mat) { stt.path.pop(); return 'punct'; }
        mat = stream.match(/^\.(\s+|$)/);     if (mat) { return 'punct'; }
        mat = stream.match(/^\/(\s+|$)/);     if (mat) { stt.path.length = 0; return 'punct'; }

        mat = stream.match(/^%([<>^])?([+-])?([su])?([bodhHac])(\s+|$)/); if (mat) {
          return 'format';
        }

        mat = stream.match(/^(\S+)(\s+|$)/); if (mat) {
          const sigName = mat[1];
          const newPath = stt.path.concat(sigName);
          const ref = get(wires, newPath, false);
          if (typeof ref === 'string') {
            return 'signal';
          }
          if (typeof ref === 'object') {
            stt.path = newPath;
            return 'path';
          }
          return 'comment';
        }
      }
    };
  });
  CodeMirror.defineMIME('text/x-waveql', 'waveql');
};
