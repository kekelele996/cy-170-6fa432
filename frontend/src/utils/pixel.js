export function createEmptyLayer(width, height) {
  return {
    id: generateId('layer'),
    name: '图层',
    visible: true,
    pixels: createPixelData(width, height, null)
  };
}

export function createPixelData(width, height, value = null) {
  return new Array(width * height).fill(value);
}

export function getPixelIndex(x, y, width) {
  return y * width + x;
}

export function inBounds(x, y, width, height) {
  return x >= 0 && y >= 0 && x < width && y < height;
}

export function clonePixels(pixels) {
  return pixels.slice();
}

export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function hexToRgba(hex, alpha = 1) {
  if (!hex || hex === 'transparent') return null;
  const normalized = hex.replace('#', '');
  const full = normalized.length === 3
    ? normalized.split('').map(c => c + c).join('')
    : normalized;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return { r, g, b, a: alpha };
}

export function rgbaToCss({ r, g, b, a = 1 }) {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function resizePixels(pixels, oldW, oldH, newW, newH) {
  const result = createPixelData(newW, newH, null);
  const minW = Math.min(oldW, newW);
  const minH = Math.min(oldH, newH);
  for (let y = 0; y < minH; y++) {
    for (let x = 0; x < minW; x++) {
      result[y * newW + x] = pixels[y * oldW + x];
    }
  }
  return result;
}
