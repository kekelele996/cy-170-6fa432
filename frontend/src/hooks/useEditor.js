import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { DEFAULT_FPS, MIN_FPS, MAX_FPS, DEFAULT_PALETTE, TOOL_PENCIL } from '../constants/index.js';
import { createEmptyLayer, createPixelData, getPixelIndex, inBounds, generateId, resizePixels } from '../utils/pixel.js';
import { floodFill } from '../utils/floodFill.js';
import { bresenhamPoints } from '../utils/drawLine.js';
import { composeFramePixels, mergeLayerPixels } from '../utils/compose.js';
import { logger } from '../utils/logger.js';

function createFrame(width, height) {
  return {
    id: generateId('frame'),
    layers: [createEmptyLayer(width, height)]
  };
}

export function useEditor(initialWidth, initialHeight) {
  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);
  const [frames, setFrames] = useState(() => [createFrame(initialWidth, initialHeight)]);
  const [activeFrameIdx, setActiveFrameIdx] = useState(0);
  const [activeLayerId, setActiveLayerId] = useState(() => frames[0].layers[0].id);
  const [currentTool, setCurrentTool] = useState(TOOL_PENCIL);
  const [currentColor, setCurrentColor] = useState(DEFAULT_PALETTE[0]);
  const [palette, setPalette] = useState(DEFAULT_PALETTE);
  const [fps, setFps] = useState(DEFAULT_FPS);
  const [playing, setPlaying] = useState(false);
  const [previewIdx, setPreviewIdx] = useState(0);

  const timerRef = useRef(null);

  const currentFrame = frames[activeFrameIdx];

  const activeLayer = useMemo(() => {
    return currentFrame.layers.find(l => l.id === activeLayerId) || currentFrame.layers[0];
  }, [currentFrame, activeLayerId]);

  const updateFrame = useCallback((idx, updater) => {
    setFrames(prev => {
      const next = prev.slice();
      next[idx] = typeof updater === 'function' ? updater(next[idx]) : updater;
      return next;
    });
  }, []);

  const resizeAll = useCallback((newW, newH) => {
    setWidth(newW);
    setHeight(newH);
    setFrames(prev => prev.map(f => ({
      ...f,
      layers: f.layers.map(l => ({
        ...l,
        pixels: resizePixels(l.pixels, width, height, newW, newH)
      }))
    })));
  }, [width, height]);

  const applyPixelTool = useCallback((x, y, _opts = {}) => {
    if (!inBounds(x, y, width, height)) return;
    const idx = getPixelIndex(x, y, width);

    updateFrame(activeFrameIdx, (frame) => {
      const layers = frame.layers.map(layer => {
        if (layer.id !== activeLayerId) return layer;
        let pixels = layer.pixels;
        if (currentTool === 'eraser') {
          pixels = pixels.slice();
          pixels[idx] = null;
        } else if (currentTool === 'fill') {
          pixels = floodFill(pixels, width, height, x, y, currentColor);
        } else {
          pixels = pixels.slice();
          pixels[idx] = currentColor;
        }
        return { ...layer, pixels };
      });
      return { ...frame, layers };
    });
  }, [currentTool, currentColor, activeFrameIdx, activeLayerId, width, height, updateFrame]);

  const paintLine = useCallback((x0, y0, x1, y1) => {
    if (currentTool !== 'pencil' && currentTool !== 'eraser') {
      applyPixelTool(x1, y1);
      return;
    }
    for (const [x, y] of bresenhamPoints(x0, y0, x1, y1)) {
      applyPixelTool(x, y);
    }
  }, [currentTool, applyPixelTool]);

  const addFrame = useCallback(() => {
    setFrames(prev => {
      const copy = {
        id: generateId('frame'),
        layers: prev[activeFrameIdx].layers.map(l => ({ ...l, id: generateId('layer'), pixels: l.pixels.slice() }))
      };
      const next = prev.slice();
      next.splice(activeFrameIdx + 1, 0, copy);
      return next;
    });
    setActiveFrameIdx(i => i + 1);
    logger.info('frame added');
  }, [activeFrameIdx]);

  const removeFrame = useCallback((idx) => {
    setFrames(prev => {
      if (prev.length <= 1) return prev;
      const next = prev.slice();
      next.splice(idx, 1);
      return next;
    });
    setActiveFrameIdx(i => Math.max(0, i - (idx <= i ? 1 : 0)));
    logger.info('frame removed');
  }, []);

  const duplicateFrame = useCallback((idx) => {
    setFrames(prev => {
      const source = prev[idx];
      const copy = {
        id: generateId('frame'),
        layers: source.layers.map(l => ({ ...l, id: generateId('layer'), pixels: l.pixels.slice() }))
      };
      const next = prev.slice();
      next.splice(idx + 1, 0, copy);
      return next;
    });
    logger.info('frame duplicated');
  }, []);

  const addLayer = useCallback(() => {
    updateFrame(activeFrameIdx, (frame) => {
      const newLayer = createEmptyLayer(width, height);
      newLayer.name = `图层 ${frame.layers.length + 1}`;
      setActiveLayerId(newLayer.id);
      return { ...frame, layers: [newLayer, ...frame.layers] };
    });
    logger.info('layer added');
  }, [activeFrameIdx, width, height, updateFrame]);

  const removeLayer = useCallback((layerId) => {
    updateFrame(activeFrameIdx, (frame) => {
      if (frame.layers.length <= 1) return frame;
      const layers = frame.layers.filter(l => l.id !== layerId);
      if (layerId === activeLayerId) setActiveLayerId(layers[0].id);
      return { ...frame, layers };
    });
  }, [activeFrameIdx, activeLayerId, updateFrame]);

  const toggleLayerVisible = useCallback((layerId) => {
    updateFrame(activeFrameIdx, (frame) => ({
      ...frame,
      layers: frame.layers.map(l => l.id === layerId ? { ...l, visible: !l.visible } : l)
    }));
  }, [activeFrameIdx, updateFrame]);

  const renameLayer = useCallback((layerId, name) => {
    updateFrame(activeFrameIdx, (frame) => ({
      ...frame,
      layers: frame.layers.map(l => l.id === layerId ? { ...l, name } : l)
    }));
  }, [activeFrameIdx, updateFrame]);

  const mergeDown = useCallback((layerId) => {
    updateFrame(activeFrameIdx, (frame) => {
      const idx = frame.layers.findIndex(l => l.id === layerId);
      if (idx < 0 || idx >= frame.layers.length - 1) return frame;
      const current = frame.layers[idx];
      const below = frame.layers[idx + 1];
      const mergedPixels = mergeLayerPixels(current.pixels, below.pixels);
      const layers = frame.layers.slice();
      layers[idx + 1] = { ...below, pixels: mergedPixels };
      layers.splice(idx, 1);
      if (activeLayerId === layerId) setActiveLayerId(layers[idx] ? layers[idx].id : layers[0].id);
      return { ...frame, layers };
    });
    logger.info('layer merged');
  }, [activeFrameIdx, activeLayerId, updateFrame]);

  const setFpsSafe = useCallback((v) => {
    const clamped = Math.max(MIN_FPS, Math.min(MAX_FPS, Number(v) || DEFAULT_FPS));
    setFps(clamped);
  }, []);

  const togglePlay = useCallback(() => {
    setPlaying(p => !p);
  }, []);

  useEffect(() => {
    if (!playing || frames.length <= 1) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    timerRef.current = setInterval(() => {
      setPreviewIdx(i => (i + 1) % frames.length);
    }, 1000 / fps);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing, frames.length, fps]);

  useEffect(() => {
    setPreviewIdx(activeFrameIdx);
  }, [activeFrameIdx]);

  useEffect(() => {
    const frame = frames[activeFrameIdx];
    if (!frame) return;
    const exists = frame.layers.some(l => l.id === activeLayerId);
    if (!exists) {
      setActiveLayerId(frame.layers[0].id);
    }
  }, [activeFrameIdx, frames, activeLayerId]);

  const getComposedPixels = useCallback((frameIdx) => {
    const frame = frames[frameIdx];
    if (!frame) return createPixelData(width, height, null);
    return composeFramePixels(frame, width, height);
  }, [frames, width, height]);

  const composedActive = useMemo(() => {
    return composeFramePixels(currentFrame, width, height);
  }, [currentFrame, width, height]);

  const composedPreview = useMemo(() => {
    return composeFramePixels(frames[previewIdx] || currentFrame, width, height);
  }, [frames, previewIdx, currentFrame, width, height]);

  return {
    width, height, resizeAll,
    frames, activeFrameIdx, setActiveFrameIdx,
    currentFrame, activeLayer, activeLayerId, setActiveLayerId,
    currentTool, setCurrentTool,
    currentColor, setCurrentColor,
    palette, setPalette,
    fps, setFps: setFpsSafe, MIN_FPS, MAX_FPS,
    playing, previewIdx, togglePlay,
    applyPixelTool, paintLine,
    addFrame, removeFrame, duplicateFrame,
    addLayer, removeLayer, toggleLayerVisible, renameLayer, mergeDown,
    getComposedPixels,
    composedActive, composedPreview
  };
}
