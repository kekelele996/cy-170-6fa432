import { MESSAGES } from '../constants/index.js';

export class PixelEditorError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'PixelEditorError';
    this.cause = cause || null;
  }
}

export function createError(key, cause) {
  const message = MESSAGES[key] || key;
  return new PixelEditorError(message, cause);
}

export function throwError(key, cause) {
  throw createError(key, cause);
}
