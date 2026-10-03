export function Palette({ palette, currentColor, onColorChange }) {
  const handleCustom = (e) => {
    const c = e.target.value;
    onColorChange(c);
  };

  return (
    <div className="palette">
      <div className="palette-title">调色板</div>
      <div className="palette-grid">
        {palette.map((color, i) => (
          <button
            key={`${color}-${i}`}
            className={`palette-swatch ${currentColor === color ? 'active' : ''}`}
            style={{ background: color }}
            onClick={() => onColorChange(color)}
            title={color}
          />
        ))}
      </div>
      <div className="palette-current">
        <span>当前:</span>
        <div className="palette-swatch" style={{ background: currentColor }} />
        <input type="color" value={currentColor} onChange={handleCustom} />
      </div>
    </div>
  );
}
