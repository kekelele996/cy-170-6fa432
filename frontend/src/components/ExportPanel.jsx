import { encodeGif } from '../utils/gifEncoder.js';
import { createError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

function renderFrameToCanvas(pixels, width, height, scale = 1) {
  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const c = pixels[y * width + x];
      if (c) {
        ctx.fillStyle = c;
        ctx.fillRect(x * scale, y * scale, scale, scale);
      }
    }
  }
  return canvas;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportPNG(editor) {
  try {
    const canvas = renderFrameToCanvas(
      editor.composedActive,
      editor.width,
      editor.height,
      8
    );
    canvas.toBlob((blob) => {
      if (!blob) {
        logger.error('PNG blob failed');
        return;
      }
      downloadBlob(blob, `pixel-art-${Date.now()}.png`);
    }, 'image/png');
  } catch (err) {
    logger.error(createError('ERROR_EXPORT_FAILED', err));
  }
}

export function exportGIF(editor) {
  try {
    const { frames, width, height, fps, getComposedPixels, palette } = editor;
    const framePixels = frames.map((_, idx) => getComposedPixels(idx));
    const bytes = encodeGif(framePixels, width, height, fps, palette);
    const blob = new Blob([bytes], { type: 'image/gif' });
    downloadBlob(blob, `pixel-animation-${Date.now()}.gif`);
  } catch (err) {
    logger.error(createError('ERROR_GIF_ENCODE_FAILED', err));
  }
}

export function ExportPanel({ editor }) {
  return (
    <div className="export-panel">
      <button onClick={() => exportPNG(editor)}>导出 PNG</button>
      <button onClick={() => exportGIF(editor)}>导出 GIF</button>
    </div>
  );
}
