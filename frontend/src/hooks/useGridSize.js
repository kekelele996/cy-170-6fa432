import { useState, useCallback } from 'react';
import { DEFAULT_GRID_SIZE, MIN_GRID_SIZE, MAX_GRID_SIZE } from '../constants/index.js';
import { createPixelData } from '../utils/pixel.js';

export function useGridSize(initial = DEFAULT_GRID_SIZE) {
  const [size, setSize] = useState(initial);

  const updateSize = useCallback((next) => {
    const clamped = Math.max(MIN_GRID_SIZE, Math.min(MAX_GRID_SIZE, Number(next) || DEFAULT_GRID_SIZE));
    setSize(clamped);
    return clamped;
  }, []);

  return { size, setSize: updateSize, MIN: MIN_GRID_SIZE, MAX: MAX_GRID_SIZE };
}

export function createBlankPixels(width, height) {
  return createPixelData(width, height, null);
}
