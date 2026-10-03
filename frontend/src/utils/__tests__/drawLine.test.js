import { describe, it, expect } from 'vitest';
import { bresenhamPoints } from '../drawLine.js';

describe('drawLine.js (bresenham)', () => {
  it('should return a single point when start equals end', () => {
    const result = bresenhamPoints(5, 5, 5, 5);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual([5, 5]);
  });

  it('should draw a horizontal line from left to right', () => {
    const result = bresenhamPoints(0, 0, 4, 0);
    expect(result).toHaveLength(5);
    expect(result[0]).toEqual([0, 0]);
    expect(result[4]).toEqual([4, 0]);
    expect(result.every(([, y]) => y === 0)).toBe(true);
  });

  it('should draw a horizontal line from right to left', () => {
    const result = bresenhamPoints(4, 0, 0, 0);
    expect(result).toHaveLength(5);
    expect(result[0]).toEqual([4, 0]);
    expect(result[4]).toEqual([0, 0]);
  });

  it('should draw a vertical line from top to bottom', () => {
    const result = bresenhamPoints(0, 0, 0, 4);
    expect(result).toHaveLength(5);
    expect(result[0]).toEqual([0, 0]);
    expect(result[4]).toEqual([0, 4]);
    expect(result.every(([x]) => x === 0)).toBe(true);
  });

  it('should draw a vertical line from bottom to top', () => {
    const result = bresenhamPoints(0, 4, 0, 0);
    expect(result).toHaveLength(5);
    expect(result[0]).toEqual([0, 4]);
    expect(result[4]).toEqual([0, 0]);
  });

  it('should draw a 45-degree diagonal line', () => {
    const result = bresenhamPoints(0, 0, 3, 3);
    expect(result).toHaveLength(4);
    expect(result[0]).toEqual([0, 0]);
    expect(result[1]).toEqual([1, 1]);
    expect(result[2]).toEqual([2, 2]);
    expect(result[3]).toEqual([3, 3]);
  });

  it('should draw a diagonal with slope > 1', () => {
    const result = bresenhamPoints(0, 0, 2, 6);
    expect(result.length).toBeGreaterThan(3);
    expect(result[0]).toEqual([0, 0]);
    expect(result[result.length - 1]).toEqual([2, 6]);
    for (const [x, y] of result) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(2);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(6);
    }
  });

  it('should draw a diagonal with slope < 1', () => {
    const result = bresenhamPoints(0, 0, 6, 2);
    expect(result.length).toBeGreaterThan(3);
    expect(result[0]).toEqual([0, 0]);
    expect(result[result.length - 1]).toEqual([6, 2]);
    for (const [x, y] of result) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(6);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(2);
    }
  });

  it('should draw a line with negative slope', () => {
    const result = bresenhamPoints(0, 4, 4, 0);
    expect(result).toHaveLength(5);
    expect(result[0]).toEqual([0, 4]);
    expect(result[4]).toEqual([4, 0]);
  });

  it('should have no duplicate consecutive points', () => {
    const result = bresenhamPoints(0, 0, 10, 7);
    for (let i = 1; i < result.length; i++) {
      expect(result[i]).not.toEqual(result[i - 1]);
    }
  });

  it('should handle single step in both directions', () => {
    const result = bresenhamPoints(0, 0, 1, 1);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual([0, 0]);
    expect(result[1]).toEqual([1, 1]);
  });

  it('should cover every pixel for a line with dx=dy', () => {
    const result = bresenhamPoints(0, 0, 5, 5);
    expect(result).toHaveLength(6);
    for (let i = 0; i <= 5; i++) {
      expect(result[i]).toEqual([i, i]);
    }
  });
});
