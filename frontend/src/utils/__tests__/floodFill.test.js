import { describe, it, expect } from 'vitest';
import { floodFill } from '../floodFill.js';

describe('floodFill.js', () => {
  it('should fill a single isolated cell', () => {
    const pixels = new Array(9).fill(null);
    const result = floodFill(pixels, 3, 3, 1, 1, '#ff0000');
    expect(result[4]).toBe('#ff0000');
    expect(result.filter(v => v === '#ff0000')).toHaveLength(9);
  });

  it('should fill all cells of same color in a region', () => {
    const pixels = new Array(16).fill('#ffffff');
    pixels[5] = '#000000';
    pixels[6] = '#000000';
    pixels[9] = '#000000';
    pixels[10] = '#000000';
    const result = floodFill(pixels, 4, 4, 0, 0, '#ff0000');
    expect(result[0]).toBe('#ff0000');
    expect(result[1]).toBe('#ff0000');
    expect(result[4]).toBe('#ff0000');
    expect(result[5]).toBe('#000000');
    expect(result[6]).toBe('#000000');
    expect(result[15]).toBe('#ff0000');
  });

  it('should not change anything if target color matches start color', () => {
    const pixels = new Array(4).fill('#ff0000');
    const result = floodFill(pixels, 2, 2, 0, 0, '#ff0000');
    expect(result).toEqual(pixels);
  });

  it('should handle empty canvas', () => {
    const pixels = new Array(4).fill(null);
    const result = floodFill(pixels, 2, 2, 0, 0, '#0000ff');
    expect(result.every(v => v === '#0000ff')).toBe(true);
  });

  it('should handle single-pixel canvas', () => {
    const pixels = [null];
    const result = floodFill(pixels, 1, 1, 0, 0, '#ff0000');
    expect(result[0]).toBe('#ff0000');
  });

  it('should not affect different-colored adjacent pixels', () => {
    const pixels = [
      '#ff0000', '#ff0000', '#0000ff',
      '#ff0000', '#ff0000', '#0000ff',
      '#0000ff', '#0000ff', '#0000ff'
    ];
    const result = floodFill(pixels, 3, 3, 0, 0, '#00ff00');
    expect(result[0]).toBe('#00ff00');
    expect(result[1]).toBe('#00ff00');
    expect(result[2]).toBe('#0000ff');
    expect(result[3]).toBe('#00ff00');
    expect(result[4]).toBe('#00ff00');
    expect(result[5]).toBe('#0000ff');
    expect(result[6]).toBe('#0000ff');
    expect(result[8]).toBe('#0000ff');
  });
});
