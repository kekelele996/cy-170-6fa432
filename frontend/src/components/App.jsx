import { PixelCanvas } from './PixelCanvas.jsx';
import { FrameThumb } from './FrameThumb.jsx';
import { Toolbar } from './Toolbar.jsx';
import { Palette } from './Palette.jsx';
import { FrameTimeline } from './FrameTimeline.jsx';
import { LayerPanel } from './LayerPanel.jsx';
import { ExportPanel } from './ExportPanel.jsx';
import { useEditor } from '../hooks/useEditor.js';
import { DEFAULT_GRID_SIZE, MIN_GRID_SIZE, MAX_GRID_SIZE } from '../constants/index.js';
import { logger } from '../utils/logger.js';

export function App() {
  const editor = useEditor(DEFAULT_GRID_SIZE, DEFAULT_GRID_SIZE);

  const handlePaintStart = (x, y) => {
    editor.applyPixelTool(x, y);
  };

  const handlePaintMove = (x0, y0, x1, y1) => {
    editor.paintLine(x0, y0, x1, y1);
  };

  const handleResize = (e) => {
    const val = Number(e.target.value);
    if (!Number.isNaN(val) && val >= MIN_GRID_SIZE && val <= MAX_GRID_SIZE) {
      editor.resizeAll(val, val);
    }
  };

  logger.debug('App render', { frames: editor.frames.length, width: editor.width });

  return (
    <div className="app">
      <header className="app-header">
        <h1>Pixel Art Editor</h1>
        <div className="app-header-actions">
          <label>
            尺寸:
            <input
              type="number"
              min={MIN_GRID_SIZE}
              max={MAX_GRID_SIZE}
              value={editor.width}
              onChange={handleResize}
            />
          </label>
          <ExportPanel editor={editor} />
        </div>
      </header>

      <div className="app-main">
        <aside className="sidebar-left">
          <Toolbar
            currentTool={editor.currentTool}
            onToolChange={editor.setCurrentTool}
          />
          <Palette
            palette={editor.palette}
            currentColor={editor.currentColor}
            onColorChange={editor.setCurrentColor}
          />
        </aside>

        <main className="canvas-area">
          <PixelCanvas
            width={editor.width}
            height={editor.height}
            pixels={editor.playing ? editor.composedPreview : editor.composedActive}
            onPaintStart={handlePaintStart}
            onPaintMove={handlePaintMove}
            onPaintEnd={() => {}}
          />
          <div className="canvas-preview">
            <span>预览:</span>
            <FrameThumb
              pixels={editor.playing ? editor.composedPreview : editor.composedActive}
              width={editor.width}
              height={editor.height}
              size={96}
            />
          </div>
        </main>

        <aside className="sidebar-right">
          <LayerPanel
            layers={editor.currentFrame.layers}
            activeLayerId={editor.activeLayerId}
            onSelect={editor.setActiveLayerId}
            onAdd={editor.addLayer}
            onRemove={editor.removeLayer}
            onToggleVisible={editor.toggleLayerVisible}
            onRename={editor.renameLayer}
            onMergeDown={editor.mergeDown}
          />
        </aside>
      </div>

      <footer className="app-footer">
        <FrameTimeline
          frames={editor.frames}
          activeFrameIdx={editor.activeFrameIdx}
          onSelect={editor.setActiveFrameIdx}
          onAdd={editor.addFrame}
          onRemove={editor.removeFrame}
          onDuplicate={editor.duplicateFrame}
          getComposedPixels={editor.getComposedPixels}
          width={editor.width}
          height={editor.height}
          fps={editor.fps}
          onFpsChange={editor.setFps}
          playing={editor.playing}
          onTogglePlay={editor.togglePlay}
          MIN_FPS={editor.MIN_FPS}
          MAX_FPS={editor.MAX_FPS}
        />
      </footer>
    </div>
  );
}
