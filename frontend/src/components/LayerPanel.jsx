export function LayerPanel({
  layers,
  activeLayerId,
  onSelect,
  onAdd,
  onRemove,
  onToggleVisible,
  onRename,
  onMergeDown
}) {
  return (
    <div className="layer-panel">
      <div className="layer-panel-header">
        <span>图层</span>
        <button onClick={onAdd}>+ 新建</button>
      </div>
      <div className="layer-list">
        {layers.map((layer, idx) => (
          <div
            key={layer.id}
            className={`layer-item ${layer.id === activeLayerId ? 'active' : ''}`}
            onClick={() => onSelect(layer.id)}
          >
            <button
              className="layer-visibility"
              onClick={(e) => { e.stopPropagation(); onToggleVisible(layer.id); }}
              title={layer.visible ? '隐藏' : '显示'}
            >
              {layer.visible ? '👁' : '◯'}
            </button>
            <input
              className="layer-name"
              value={layer.name}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => onRename(layer.id, e.target.value)}
            />
            <div className="layer-actions">
              <button
                onClick={(e) => { e.stopPropagation(); onMergeDown(layer.id); }}
                disabled={idx >= layers.length - 1}
                title="向下合并"
              >⇩</button>
              <button
                onClick={(e) => { e.stopPropagation(); onRemove(layer.id); }}
                disabled={layers.length <= 1}
                title="删除"
              >✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
