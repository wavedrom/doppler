#!/usr/bin/bash

cp node_modules/codemirror/lib/codemirror.css wavehub
cp node_modules/codemirror/theme/blackboard.css wavehub

cp node_modules/vcd-stream/out/vcd.wasm wavehub

cp src/wavehub.html wavehub/index.html
cp src/wavehub.css wavehub
cp src/wavehub.ico wavehub
cp src/*.woff2 wavehub

browserify ./lib/wavehub.js | terser --compress -o wavehub/wavehub.js
