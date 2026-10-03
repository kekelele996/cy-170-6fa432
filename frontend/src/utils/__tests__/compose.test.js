import { describe, it, expect } from 'vitest';
import { composeFramePixels, mergeLayerPixels } from '../compose.js';
import { createPixelData } from '../pixel.js';

describe('compose.js', () => {
  describe('mergeLayerPixels', () => {
    it('should return lower layer unchanged if upper is all null', () => {
      const upper = new Array(4).fill(null);
      const lower = ['#ff0000', null, '#00ff00', '#0000ff'];
      const result = mergeLayerPixels(upper, lower);
      expect(result).toEqual(lower);
      expect(result).not.toBe(lower);
    });

    it('should overwrite lower pixels with non-null upper pixels', () => {
      const upper = ['#ff0000', null, '#00ff00', null];
      const lower = [null, '#0000ff', null, '#ffffff'];
      const result = mergeLayerPixels(upper, lower);
      expect(result).toEqual(['#ff0000', '#0000ff', '#00ff00', '#ffffff']);
    });

    it('should keep all upper values when lower is empty', () => {
      const upper = ['#ff0000', '#00ff00', '#0000ff'];
      const lower = new Array(3).fill(null);
      const result = mergeLayerPixels(upper, lower);
      expect(result).toEqual(upper);
    });

    it('should not mutate input arrays', () => {
      const upper = ['#ff0000', null];
      const lower = [null, '#00ff00'];
      const upperClone = upper.slice();
      const lowerClone = lower.slice();
      mergeLayerPixels(upper, lower);
      expect(upper).toEqual(upperClone);
      expect(lower).toEqual(lowerClone);
    });

    it('should handle empty arrays', () => {
      const result = mergeLayerPixels([], []);
      expect(result).toEqual([]);
    });
  });

  describe('composeFramePixels', () => {
    it('should return all null for a frame with no visible layers', () => {
      const frame = {
        layers: [
          { id: '1', visible: false, pixels: ['#ff0000', null, null, null] },
          { id: '2', visible: false, pixels: [null, '#00ff00', null, null] }
        ]
      };
      const result = composeFramePixels(frame, 2, 2);
      expect(result).toEqual([null, null, null, null]);
    });

    it('should compose pixels from multiple visible layers', () => {
      const frame = {
        layers: [
          { id: '1', visible: true, pixels: ['#ff0000', null, null, null] },
          { id: '2', visible: true, pixels: [null, '#00ff00', null, null] },
          { id: '3', visible: true, pixels: [null, null, '#0000ff', null] }
        ]
      };
      const result = composeFramePixels(frame, 2, 2);
      expect(result).toEqual(['#ff0000', '#00ff00', '#0000ff', null]);
    });

    it('should give top layer priority when overlapping', () => {
      const frame = {
        layers: [
          { id: '1', visible: true, pixels: ['#ff0000', null] },
          { id: '2', visible: true, pixels: ['#00ff00', '#0000ff'] }
        ]
      };
      const result = composeFramePixels(frame, 1, 2);
      expect(result).toEqual(['#ff0000', '#0000ff']);
    });

    it('should skip hidden layers', () => {
      const frame = {
        layers: [
          { id: '1', visible: true, pixels: ['#ff0000', null] },
          { id: '2', visible: false, pixels: ['#00ff00', null] },
          { id: '3', visible: true, pixels: [null, '#0000ff'] }
        ]
      };
      const result = composeFramePixels(frame, 1, 2);
      expect(result).toEqual(['#ff0000', '#0000ff']);
    });

    it('should handle frame with no layers', () => {
      const frame = { layers: [] };
      const result = composeFramePixels(frame, 2, 2);
      expect(result).toEqual([null, null, null, null]);
    });

    it('should compose frame with large pixel array', () => {
      const w = 4, h = 4;
      const pixels1 = createPixelData(w, h, '#ff0000');
      const pixels2 = createPixelData(w, h, null);
      pixels2[5] = '#00ff00';
      pixels2[10] = '#0000ff';
      const frame = {
        layers: [
          { id: '1', visible: true, pixels: pixels2 },
          { id: '2', visible: true, pixels: pixels1 }
        ]
      };
      const result = composeFramePixels(frame, w, h);
      expect(result[0]).toBe('#ff0000');
      expect(result[2]).toBe('#ff0000');
      expect(result[5]).toBe('#00ff00');
      expect(result[10]).toBe('#0000ff');
      expect(result[15]).toBe('#ff0000');
    });
  });
});
