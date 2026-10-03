import { getPixelIndex, inBounds, clonePixels } from './pixel.js';

export function floodFill(pixels, width, height, startX, startY, targetColor) {
  const startIdx = getPixelIndex(startX, startY, width);
  const startColor = pixels[startIdx];
  if (startColor === targetColor) return pixels;

  const result = clonePixels(pixels);
  const stack = [[startX, startY]];

  while (stack.length > 0) {
    const [x, y] = stack.pop();
    if (!inBounds(x, y, width, height)) continue;
    const idx = getPixelIndex(x, y, width);
    if (result[idx] !== startColor) continue;
    result[idx] = targetColor;
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  return result;
}
