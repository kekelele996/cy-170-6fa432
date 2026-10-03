export const DEFAULT_GRID_SIZE = 32;
export const MIN_GRID_SIZE = 4;
export const MAX_GRID_SIZE = 128;

export const CELL_SIZE = 16;

export const DEFAULT_FPS = 8;
export const MIN_FPS = 1;
export const MAX_FPS = 60;

export const DEFAULT_PALETTE = [
  '#000000', '#ffffff', '#7f7f7f', '#c3c3c3',
  '#880015', '#ed1c24', '#ff7f27', '#fff200',
  '#22b14c', '#00a2e8', '#3f48cc', '#a349a4',
  '#b97a57', '#ffaec9', '#b5e61d', '#99d9ea'
];

export const TRANSPARENT_COLOR = 'transparent';

export const TOOL_PENCIL = 'pencil';
export const TOOL_ERASER = 'eraser';
export const TOOL_FILL = 'fill';

export const TOOLS = [
  { id: TOOL_PENCIL, label: '铅笔', icon: 'P' },
  { id: TOOL_ERASER, label: '橡皮', icon: 'E' },
  { id: TOOL_FILL, label: '油漆桶', icon: 'B' }
];

export const MESSAGES = {
  ERROR_CANVAS_NOT_FOUND: '画布元素未找到',
  ERROR_EXPORT_FAILED: '导出失败',
  ERROR_GIF_ENCODE_FAILED: 'GIF 编码失败',
  INFO_FRAME_ADDED: '已添加新帧',
  INFO_FRAME_REMOVED: '已删除帧',
  INFO_LAYER_ADDED: '已添加新图层',
  INFO_LAYER_MERGED: '图层已合并'
};
