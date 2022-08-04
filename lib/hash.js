'use strict';

// Fletcher Style checksum

const hash = str => {
  let sum1 = 599;
  let sum2 = 173;
  for (let i = 0; i < str.length; i++) {
    sum1 = (sum1 + str.charCodeAt(i)) & 255;
    sum2 = (sum2 + sum1) & 255;
  }
  return (sum2 ^ sum1 ^ (sum2 >> 5) ^ (sum1 >> 5)) % 36;
};

module.exports = hash;
