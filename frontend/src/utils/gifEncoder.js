export function encodeGif(frames, width, height, fps = 8, palette) {
  const delay = Math.round(100 / fps);
  const colorTable = buildColorTable(palette);
  const parts = [];

  parts.push(encodeString('GIF89a'));

  parts.push(encodeUint16(width));
  parts.push(encodeUint16(height));
  parts.push(new Uint8Array([0xF7, 0, 0]));

  parts.push(colorTable.bytes);

  parts.push(new Uint8Array([0x21, 0xFF, 0x0B]));
  parts.push(encodeString('NETSCAPE2.0'));
  parts.push(new Uint8Array([0x03, 0x01, 0x00, 0x00, 0x00]));

  for (const frame of frames) {
    parts.push(new Uint8Array([0x21, 0xF9, 0x04, 0x00]));
    parts.push(encodeUint16(delay));
    parts.push(new Uint8Array([0x00, 0x00]));

    parts.push(new Uint8Array([0x2C]));
    parts.push(encodeUint16(0));
    parts.push(encodeUint16(0));
    parts.push(encodeUint16(width));
    parts.push(encodeUint16(height));
    parts.push(new Uint8Array([0x00]));

    const indexed = toIndexed(frame, colorTable.map);
    const lzw = lzwEncode(indexed, 8);
    parts.push(new Uint8Array([8]));
    parts.push(lzw);
    parts.push(new Uint8Array([0x00]));
  }

  parts.push(new Uint8Array([0x3B]));

  const total = parts.reduce((s, p) => s + p.length, 0);
  const result = new Uint8Array(total);
  let offset = 0;
  for (const p of parts) {
    result.set(p, offset);
    offset += p.length;
  }
  return result;
}

function buildColorTable(palette) {
  const size = 256;
  const bytes = new Uint8Array(size * 3);
  const map = new Map();
  for (let i = 0; i < palette.length && i < size; i++) {
    const rgb = hexToRgb(palette[i]);
    bytes[i * 3] = rgb.r;
    bytes[i * 3 + 1] = rgb.g;
    bytes[i * 3 + 2] = rgb.b;
    map.set(palette[i], i);
  }
  map.set('transparent', 0);
  return { bytes, map };
}

function hexToRgb(hex) {
  if (!hex || hex === 'transparent') return { r: 0, g: 0, b: 0 };
  const normalized = hex.replace('#', '');
  const full = normalized.length === 3
    ? normalized.split('').map(c => c + c).join('')
    : normalized;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16)
  };
}

function toIndexed(pixels, map) {
  const out = new Uint8Array(pixels.length);
  for (let i = 0; i < pixels.length; i++) {
    const c = pixels[i];
    if (!c || c === 'transparent') {
      out[i] = 0;
    } else {
      out[i] = map.has(c) ? map.get(c) : nearestColor(c, map);
    }
  }
  return out;
}

function nearestColor(hex, map) {
  const target = hexToRgb(hex);
  let best = 0;
  let bestDist = Infinity;
  for (const [key, idx] of map.entries()) {
    if (key === 'transparent') continue;
    const c = hexToRgb(key);
    const d = (c.r - target.r) ** 2 + (c.g - target.g) ** 2 + (c.b - target.b) ** 2;
    if (d < bestDist) {
      bestDist = d;
      best = idx;
    }
  }
  return best;
}

function encodeString(str) {
  const out = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) out[i] = str.charCodeAt(i);
  return out;
}

function encodeUint16(v) {
  return new Uint8Array([v & 0xFF, (v >> 8) & 0xFF]);
}

function lzwEncode(indexed, minCodeSize) {
  const clearCode = 1 << minCodeSize;
  const eoiCode = clearCode + 1;
  let codeSize = minCodeSize + 1;
  let nextCode = eoiCode + 1;

  const dict = new Map();
  const resetDict = () => {
    dict.clear();
    for (let i = 0; i < clearCode; i++) dict.set(String.fromCharCode(i), i);
    dict.set('__CLEAR__', clearCode);
    dict.set('__EOI__', eoiCode);
    nextCode = eoiCode + 1;
    codeSize = minCodeSize + 1;
  };
  resetDict();

  const outputBits = [];
  const writeCode = (code, size) => {
    for (let i = 0; i < size; i++) {
      outputBits.push((code >> i) & 1);
    }
  };

  writeCode(clearCode, codeSize);

  let w = String.fromCharCode(indexed[0]);
  for (let i = 1; i < indexed.length; i++) {
    const c = String.fromCharCode(indexed[i]);
    const wc = w + c;
    if (dict.has(wc)) {
      w = wc;
    } else {
      writeCode(dict.get(w), codeSize);
      if (nextCode < 4096) {
        dict.set(wc, nextCode++);
        if (nextCode > (1 << codeSize) && codeSize < 12) codeSize++;
      } else {
        writeCode(clearCode, codeSize);
        resetDict();
      }
      w = c;
    }
  }
  writeCode(dict.get(w), codeSize);
  writeCode(eoiCode, codeSize);

  const byteCount = Math.ceil(outputBits.length / 8);
  const bytes = new Uint8Array(byteCount);
  for (let i = 0; i < outputBits.length; i++) {
    if (outputBits[i]) bytes[i >> 3] |= (1 << (i & 7));
  }

  const blocks = [];
  let offset = 0;
  while (offset < bytes.length) {
    const len = Math.min(255, bytes.length - offset);
    const block = new Uint8Array(len + 1);
    block[0] = len;
    block.set(bytes.subarray(offset, offset + len), 1);
    blocks.push(block);
    offset += len;
  }
  const total = blocks.reduce((s, b) => s + b.length, 0);
  const out = new Uint8Array(total);
  let o = 0;
  for (const b of blocks) {
    out.set(b, o);
    o += b.length;
  }
  return out;
}
