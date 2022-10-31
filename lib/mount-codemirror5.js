'use strict';

require('codemirror/addon/fold/foldcode.js');
require('codemirror/addon/fold/foldgutter.js');
require('codemirror/addon/fold/brace-fold.js');
require('codemirror/addon/hint/show-hint.js');
// require('codemirror/addon/fold/xml-fold.js');

const CodeMirror = require('codemirror');

const waveql = require('./waveql.js');

const mountCodeMirror5 = (sidebar, deso, pstate, render) => {
  sidebar.innerHTML = deso.waveql;

  waveql.cmMode(CodeMirror, deso);
  // waveql.cmHint(CodeMirror, desc);

  const cm = CodeMirror.fromTextArea(sidebar, {
    extraKeys: {'Ctrl-Space': 'autocomplete'},
    theme: 'waveql',
    mode: 'text/x-waveql',
    // lineNumbers: true,
    lineWrapping: false,
    tabSize: 2,
    autofocus: true,
    scrollbarStyle: null,
    styleActiveSelected: true,
    // styleActiveLine: true,
    styleActiveLine: {nonEmpty: true},
    // styleSelectedText: true,
    viewportMargin: Infinity,
    foldGutter: true,
    hintOptions: {hint: waveql.cmHint(CodeMirror, deso)},
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
  });

  cm.scrollTo(null, pstate.yOffset);

  cm.on('scroll', cm => {
    const info = cm.getScrollInfo();
    pstate.yOffset = info.top;
    render();
  });

  const parser = waveql.parser(deso.wires);

  const onCmChange = cm => {
    const str = cm.getValue();
    deso.view = parser(str);
    pstate.numLanes = deso.view.length;
    render();
  };

  cm.on('change', onCmChange);
  onCmChange(cm);

  return {
    getScrollInfo: () => cm.getScrollInfo(), // => {top: <Number>, clientHeight: <Number>}
    scrollTo: (a, b) => cm.scrollTo(a, b),
    hasFocus: () => cm.hasFocus()
  };
};

module.exports = mountCodeMirror5;
