import { describe, it, expect } from 'vitest';
import { resizePixels } from '../pixel.js';

describe('pixel.js resizePixels', () => {
  it('should return same pixels when size is unchanged', () => {
    const pixels = ['#ff0000', null, '#00ff00', null];
    const result = resizePixels(pixels, 2, 2, 2, 2);
    expect(result).toEqual(pixels);
    expect(result).not.toBe(pixels);
  });

  it('should expand canvas and preserve existing pixels', () => {
    const pixels = ['#ff0000', null, '#00ff00', null];
    const result = resizePixels(pixels, 2, 2, 4, 4);
    expect(result).toHaveLength(16);
    expect(result[0]).toBe('#ff0000');
    expect(result[1]).toBe(null);
    expect(result[4]).toBe('#00ff00');
    expect(result[15]).toBe(null);
  });

  it('should shrink canvas and keep only top-left pixels', () => {
    const pixels = new Array(16).fill(null);
    pixels[0] = '#ff0000';
    pixels[1] = '#00ff00';
    pixels[4] = '#0000ff';
    pixels[5] = '#ffffff';
    pixels[10] = '#ff00ff';
    const result = resizePixels(pixels, 4, 4, 2, 2);
    expect(result).toHaveLength(4);
    expect(result[0]).toBe('#ff0000');
    expect(result[1]).toBe('#00ff00');
    expect(result[2]).toBe('#0000ff');
    expect(result[3]).toBe('#ffffff');
  });

  it('should fill new area with null when expanding', () => {
    const pixels = ['#ff0000'];
    const result = resizePixels(pixels, 1, 1, 3, 3);
    expect(result[0]).toBe('#ff0000');
    expect(result.slice(1).every(v => v === null)).toBe(true);
  });

  it('should handle from 1x1 to larger sizes', () => {
    const pixels = ['#00ff00'];
    const result = resizePixels(pixels, 1, 1, 3, 3);
    expect(result).toHaveLength(9);
    expect(result[0]).toBe('#00ff00');
  });

  it('should handle non-square resize', () => {
    const pixels = ['#ff0000', '#00ff00', '#0000ff', '#ffffff'];
    const result = resizePixels(pixels, 2, 2, 3, 2);
    expect(result).toHaveLength(6);
    expect(result[0]).toBe('#ff0000');
    expect(result[1]).toBe('#00ff00');
    expect(result[3]).toBe('#0000ff');
    expect(result[4]).toBe('#ffffff');
    expect(result[2]).toBe(null);
    expect(result[5]).toBe(null);
  });
});
