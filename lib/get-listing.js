'use strict';

const lister = require('./lister.js');

const getListing = async (readers) => {
  let listing = [];
  const r = readers.find(reader => reader.ext === 'lst');
  if (r) {
    const utf8Decoder = new TextDecoder('utf-8');
    const list = lister();
    for (let i = 0; i < 10000; i++) {
      let { done, value } = await r.reader.read();
      if (typeof value !== 'string') {
        value = utf8Decoder.decode(value, {stream: true});
      }
      list.onChunk(value);
      if (done) {
        listing = list.getTrace();
        break;
      }
    }
  }
  return listing;
};

module.exports = getListing;
