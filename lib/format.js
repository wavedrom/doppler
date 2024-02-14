'use strict';

const format = (fmt, len) => {
  len = BigInt(len);
  {
    const m = fmt.match(/^%(?<sign>[s])?(?<radix>[bodh])(?<elen>\d+)?$/);
    if (m) {
      const radix = ({b: 2, o: 8, d: 10, h: 16, H: 16})[m.groups.radix];
      if (m.groups.sign) {
        return (val, pos) => {
          if ((val >> (len - 1n)) & 1n) {
            val = val - (2n ** len);
          }
          let txtOrig = val.toString(radix);
          if (txtOrig.length <= pos) {
            return txtOrig;
          }
          const sign = (val < 0) ? '-' : '+';
          if (pos === 1) {
            return sign;
          }
          if (pos === 2) {
            return sign + '\u205D';
          }
          return sign + '\u205D' + txtOrig.slice(2 - pos);
        };
      }
      if (Number(m.groups.elen) > 0) {
        const elen = BigInt(m.groups.elen);
        return (val, pos) => {
          let txtRes = [];
          for (let i = 0n; i < len; i += elen) {
            const chunk = (val >> i) & (2n ** elen - 1n);
            txtRes.unshift(chunk.toString(radix));
          }
          txtRes = '{' + txtRes.join(', ') + '}';
          if (txtRes.length <= pos) {
            return txtRes;
          }
          if (pos === 1) {
            return '\u205D';
          }
          return '\u205D' + txtRes.slice(1 - pos);
        };
      }
      return (val, pos) => {
        let txtOrig = val.toString(radix);
        if (txtOrig.length <= pos) {
          return txtOrig;
        }
        if (pos === 1) {
          return '\u205D';
        }
        return '\u205D' + txtOrig.slice(1 - pos);
      };
    }
  } {
    const m = fmt.match(/^%a$/);
    if (m) {
      return (val, pos) => {
        let txtRes = '';
        for (let i = 0n; i < len; i += 8n) {
          txtRes = String.fromCharCode(Number((val >> i) & 0xffn)) + txtRes;
        }
        txtRes = txtRes.trim();
        if (txtRes.length <= pos) {
          return txtRes;
        }
        txtRes = txtRes.slice(0, pos - 1) + '\u205D';
        return txtRes;
      };
    }
  } {
    const m = fmt.match(/^%(?<form>[fe])(?<elen>32|64)$/);
    if (m) {
      const buf = new ArrayBuffer(8);
      const bufBInt = new BigInt64Array(buf);
      const elen = BigInt(m.groups.elen);
      const bufFloat = new ((elen === 32n) ? Float32Array : Float64Array)(buf);
      const mask = (elen === 32n) ? 0xffffffffn : 0xffffffffffffffffn;
      if (m.groups.form === 'f') {
        if (len > elen) {
          return (val, pos) => {
            let txtRes = [];
            for (let i = 0n; i < len; i += elen) {
              bufBInt[0] = (val >> i) & mask;
              const fval =  bufFloat[0];
              txtRes.unshift(fval.toString());
            }
            txtRes = '{' + txtRes.join(', ') + '}';
            if (txtRes.length <= pos) {
              return txtRes;
            }
            if (pos === 1) {
              return '\u205D';
            }
            return '\u205D' + txtRes.slice(1 - pos);
          };
        }
        return (val, pos) => {
          bufBInt[0] = val & mask;
          const fval =  bufFloat[0];
          let txtOrig;
          txtOrig = fval.toString();
          if (txtOrig.length <= pos) {
            return txtOrig;
          }
          for (let i = pos; i >= 0; i--) {
            txtOrig = fval.toPrecision(i + 1);
            if (txtOrig.length <= pos) {
              return txtOrig;
            }
            txtOrig = fval.toExponential(i);
            if (txtOrig.length <= pos) {
              return txtOrig;
            }
          }
          return (val < 0) ? '-' : '+';
        };
      } else {// e
        return (val, pos) => {
          bufBInt[0] = val & mask;
          const fval =  bufFloat[0];
          let txtOrig;
          txtOrig = fval.toExponential();
          if (txtOrig.length <= pos) {
            return txtOrig;
          }
          for (let i = 4; i <= pos; i++) {
            txtOrig = fval.toExponential(pos - i);
            if (txtOrig.length <= pos) {
              return txtOrig;
            }
          }
          return (val < 0) ? '-' : '+';
        };
      }
    }
  }
  return () => '?';
};

module.exports = format;
