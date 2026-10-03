import { TOOLS, TOOL_PENCIL } from '../constants/index.js';

export function Toolbar({ currentTool, onToolChange }) {
  return (
    <div className="toolbar">
      {TOOLS.map(tool => (
        <button
          key={tool.id}
          className={`tool-btn ${currentTool === tool.id ? 'active' : ''}`}
          onClick={() => onToolChange(tool.id)}
          title={tool.label}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  );
}

export { TOOL_PENCIL };
