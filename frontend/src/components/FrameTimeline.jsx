import { FrameThumb } from './FrameThumb.jsx';

export function FrameTimeline({
  frames,
  activeFrameIdx,
  onSelect,
  onAdd,
  onRemove,
  onDuplicate,
  getComposedPixels,
  width,
  height,
  fps,
  onFpsChange,
  playing,
  onTogglePlay,
  MIN_FPS,
  MAX_FPS
}) {
  return (
    <div className="timeline">
      <div className="timeline-controls">
        <button onClick={onTogglePlay}>{playing ? '暂停' : '播放'}</button>
        <label>
          FPS:
          <input
            type="number"
            min={MIN_FPS}
            max={MAX_FPS}
            value={fps}
            onChange={(e) => onFpsChange(e.target.value)}
          />
        </label>
        <button onClick={onAdd}>+ 添加帧</button>
      </div>
      <div className="timeline-frames">
        {frames.map((frame, idx) => (
          <div
            key={frame.id}
            className={`timeline-frame ${idx === activeFrameIdx ? 'active' : ''}`}
            onClick={() => onSelect(idx)}
          >
            <FrameThumb
              pixels={getComposedPixels(idx)}
              width={width}
              height={height}
              size={56}
            />
            <div className="timeline-frame-index">帧 {idx + 1}</div>
            <div className="timeline-frame-actions">
              <button
                onClick={(e) => { e.stopPropagation(); onDuplicate(idx); }}
                title="复制"
              >⎘</button>
              {frames.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); onRemove(idx); }}
                  title="删除"
                >✕</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
