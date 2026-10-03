import { describe, it, expect } from 'vitest';
import {
  createEmptyLayer,
  createPixelData,
  getPixelIndex,
  inBounds,
  clonePixels,
  generateId,
  hexToRgba,
  rgbaToCss
} from '../pixel.js';

describe('pixel.js', () => {
  describe('createPixelData', () => {
    it('should create an array of correct size filled with default value', () => {
      const data = createPixelData(3, 4, null);
      expect(data).toHaveLength(12);
      expect(data.every(v => v === null)).toBe(true);
    });

    it('should support custom fill value', () => {
      const data = createPixelData(2, 2, '#ff0000');
      expect(data).toHaveLength(4);
      expect(data.every(v => v === '#ff0000')).toBe(true);
    });
  });

  describe('createEmptyLayer', () => {
    it('should create a layer with correct structure', () => {
      const layer = createEmptyLayer(32, 32);
      expect(layer).toHaveProperty('id');
      expect(layer.id.startsWith('layer_')).toBe(true);
      expect(layer.name).toBe('图层');
      expect(layer.visible).toBe(true);
      expect(layer.pixels).toHaveLength(32 * 32);
      expect(layer.pixels.every(v => v === null)).toBe(true);
    });
  });

  describe('getPixelIndex', () => {
    it('should calculate correct index', () => {
      expect(getPixelIndex(0, 0, 32)).toBe(0);
      expect(getPixelIndex(31, 31, 32)).toBe(31 * 32 + 31);
      expect(getPixelIndex(5, 10, 32)).toBe(325);
    });
  });

  describe('inBounds', () => {
    it('should return true for coordinates inside bounds', () => {
      expect(inBounds(0, 0, 10, 10)).toBe(true);
      expect(inBounds(9, 9, 10, 10)).toBe(true);
      expect(inBounds(5, 5, 10, 10)).toBe(true);
    });

    it('should return false for coordinates outside bounds', () => {
      expect(inBounds(-1, 0, 10, 10)).toBe(false);
      expect(inBounds(0, -1, 10, 10)).toBe(false);
      expect(inBounds(10, 0, 10, 10)).toBe(false);
      expect(inBounds(0, 10, 10, 10)).toBe(false);
    });
  });

  describe('clonePixels', () => {
    it('should create a shallow copy of pixel array', () => {
      const original = [null, '#ff0000', '#00ff00'];
      const cloned = clonePixels(original);
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      cloned[0] = '#0000ff';
      expect(original[0]).toBe(null);
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs with prefix', () => {
      const id1 = generateId('test');
      const id2 = generateId('test');
      expect(id1.startsWith('test_')).toBe(true);
      expect(id1).not.toBe(id2);
    });
  });

  describe('hexToRgba', () => {
    it('should convert 6-digit hex to rgba object', () => {
      const result = hexToRgba('#ff8000');
      expect(result).toEqual({ r: 255, g: 128, b: 0, a: 1 });
    });

    it('should convert 3-digit hex to rgba object', () => {
      const result = hexToRgba('#f80');
      expect(result).toEqual({ r: 255, g: 136, b: 0, a: 1 });
    });

    it('should support custom alpha', () => {
      const result = hexToRgba('#ffffff', 0.5);
      expect(result).toEqual({ r: 255, g: 255, b: 255, a: 0.5 });
    });

    it('should return null for transparent', () => {
      expect(hexToRgba('transparent')).toBe(null);
      expect(hexToRgba(null)).toBe(null);
    });
  });

  describe('rgbaToCss', () => {
    it('should convert rgba object to CSS string', () => {
      const result = rgbaToCss({ r: 255, g: 128, b: 0, a: 0.5 });
      expect(result).toBe('rgba(255, 128, 0, 0.5)');
    });

    it('should default alpha to 1', () => {
      const result = rgbaToCss({ r: 0, g: 0, b: 0 });
      expect(result).toBe('rgba(0, 0, 0, 1)');
    });
  });
});
