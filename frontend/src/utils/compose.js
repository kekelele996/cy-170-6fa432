import { createPixelData } from './pixel.js';

export function composeFramePixels(frame, width, height) {
  const composed = createPixelData(width, height, null);
  for (let li = frame.layers.length - 1; li >= 0; li--) {
    const layer = frame.layers[li];
    if (!layer.visible) continue;
    for (let i = 0; i < layer.pixels.length; i++) {
      if (layer.pixels[i] !== null) {
        composed[i] = layer.pixels[i];
      }
    }
  }
  return composed;
}

export function mergeLayerPixels(upper, lower) {
  const result = lower.slice();
  for (let i = 0; i < upper.length; i++) {
    if (upper[i] !== null) {
      result[i] = upper[i];
    }
  }
  return result;
}
