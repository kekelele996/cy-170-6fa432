import { describe, it, expect } from 'vitest';
import { PixelEditorError, createError, throwError } from '../errors.js';

describe('errors.js', () => {
  it('PixelEditorError should have correct name', () => {
    const err = new PixelEditorError('test');
    expect(err.name).toBe('PixelEditorError');
    expect(err.message).toBe('test');
  });

  it('PixelEditorError should store cause', () => {
    const cause = new Error('root cause');
    const err = new PixelEditorError('wrapper', cause);
    expect(err.cause).toBe(cause);
  });

  it('createError should use MESSAGES key', () => {
    const err = createError('ERROR_EXPORT_FAILED');
    expect(err).toBeInstanceOf(PixelEditorError);
    expect(err.message).toBe('导出失败');
  });

  it('createError should use raw message if key not found', () => {
    const err = createError('UNKNOWN_KEY');
    expect(err.message).toBe('UNKNOWN_KEY');
  });

  it('throwError should throw PixelEditorError', () => {
    expect(() => throwError('ERROR_EXPORT_FAILED')).toThrow(PixelEditorError);
  });
});
