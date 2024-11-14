'use strict';

const lister = require('./lister.js');

const getListing = async (readers, curListing) => {
  const list = lister(curListing);
  const utf8Decoder = new TextDecoder('utf-8');
  for (const r of readers) {
    if (r.ext !== 'lst') {
      continue;
    }
    for (let i = 0; i < 10000; i++) {
      let { done, value } = await r.reader.read();
      if (typeof value !== 'string') {
        value = utf8Decoder.decode(value, {stream: true});
      }
      list.onChunk(value);
      if (done) {
        break;
      }
    }
  }
  return list.getTrace();
};

module.exports = getListing;
