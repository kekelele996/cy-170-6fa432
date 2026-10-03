import { useRef, useEffect } from 'react';
import { CELL_SIZE } from '../constants/index.js';

export function PixelCanvas({
  width,
  height,
  pixels,
  cellSize = CELL_SIZE,
  onPaintStart,
  onPaintMove,
  onPaintEnd
}) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const lastPosRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = width * cellSize;
    const h = height * cellSize;
    canvas.width = w;
    canvas.height = h;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const c = pixels[y * width + x];
        if (c) {
          ctx.fillStyle = c;
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }

    ctx.strokeStyle = 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cellSize + 0.5, 0);
      ctx.lineTo(x * cellSize + 0.5, h);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cellSize + 0.5);
      ctx.lineTo(w, y * cellSize + 0.5);
      ctx.stroke();
    }
  }, [pixels, width, height, cellSize]);

  const getCellFromEvent = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor(((e.clientX - rect.left) * scaleX) / cellSize);
    const y = Math.floor(((e.clientY - rect.top) * scaleY) / cellSize);
    return { x, y };
  };

  const handleMouseDown = (e) => {
    drawingRef.current = true;
    const pos = getCellFromEvent(e);
    lastPosRef.current = pos;
    onPaintStart && onPaintStart(pos.x, pos.y);
  };

  const handleMouseMove = (e) => {
    if (!drawingRef.current) return;
    const pos = getCellFromEvent(e);
    const last = lastPosRef.current;
    if (!last) {
      onPaintMove && onPaintMove(pos.x, pos.y, pos.x, pos.y);
    } else {
      onPaintMove && onPaintMove(last.x, last.y, pos.x, pos.y);
    }
    lastPosRef.current = pos;
  };

  const handleMouseUp = () => {
    drawingRef.current = false;
    lastPosRef.current = null;
    onPaintEnd && onPaintEnd();
  };

  const handleMouseLeave = () => {
    drawingRef.current = false;
    lastPosRef.current = null;
    onPaintEnd && onPaintEnd();
  };

  return (
    <canvas
      ref={canvasRef}
      className="pixel-canvas"
      style={{ cursor: 'crosshair', imageRendering: 'pixelated' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    />
  );
}
