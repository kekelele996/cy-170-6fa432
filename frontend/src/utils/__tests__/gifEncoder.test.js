import { describe, it, expect } from 'vitest';
import { encodeGif } from '../gifEncoder.js';
import { createPixelData } from '../pixel.js';

const DEFAULT_PALETTE = [
  '#000000', '#ffffff', '#7f7f7f', '#c3c3c3',
  '#880015', '#ed1c24', '#ff7f27', '#fff200',
  '#22b14c', '#00a2e8', '#3f48cc', '#a349a4',
  '#b97a57', '#ffaec9', '#b5e61d', '#99d9ea'
];

describe('gifEncoder.js', () => {
  it('should generate valid GIF89a header', () => {
    const frame = createPixelData(4, 4, null);
    const result = encodeGif([frame], 4, 4, 8, DEFAULT_PALETTE);
    const header = new TextDecoder().decode(result.subarray(0, 6));
    expect(header).toBe('GIF89a');
  });

  it('should encode screen dimensions correctly', () => {
    const frame = createPixelData(32, 32, null);
    const result = encodeGif([frame], 32, 32, 8, DEFAULT_PALETTE);
    expect(result[6]).toBe(32 & 0xFF);
    expect(result[7]).toBe((32 >> 8) & 0xFF);
    expect(result[8]).toBe(32 & 0xFF);
    expect(result[9]).toBe((32 >> 8) & 0xFF);
  });

  it('should have global color table flag set', () => {
    const frame = createPixelData(4, 4, null);
    const result = encodeGif([frame], 4, 4, 8, DEFAULT_PALETTE);
    expect(result[10] & 0x80).toBe(0x80);
  });

  it('should include NETSCAPE2.0 extension for loop', () => {
    const frame = createPixelData(4, 4, null);
    const result = encodeGif([frame], 4, 4, 8, DEFAULT_PALETTE);
    const extStart = 13 + 256 * 3;
    expect(result[extStart]).toBe(0x21);
    expect(result[extStart + 1]).toBe(0xFF);
    const label = new TextDecoder().decode(result.subarray(extStart + 3, extStart + 14));
    expect(label).toBe('NETSCAPE2.0');
  });

  it('should end with GIF trailer byte 0x3B', () => {
    const frame = createPixelData(4, 4, null);
    const result = encodeGif([frame], 4, 4, 8, DEFAULT_PALETTE);
    expect(result[result.length - 1]).toBe(0x3B);
  });

  it('should encode multiple frames', () => {
    const frame1 = createPixelData(4, 4, '#ff0000');
    const frame2 = createPixelData(4, 4, '#0000ff');
    const result = encodeGif([frame1, frame2], 4, 4, 8, DEFAULT_PALETTE);
    const imageDescriptors = [];
    for (let i = 0; i < result.length; i++) {
      if (result[i] === 0x2C) imageDescriptors.push(i);
    }
    expect(imageDescriptors.length).toBe(2);
  });

  it('should produce non-zero output for a drawn frame', () => {
    const frame = createPixelData(8, 8, null);
    frame[0] = '#ff0000';
    frame[1] = '#00ff00';
    frame[10] = '#0000ff';
    const result = encodeGif([frame], 8, 8, 8, DEFAULT_PALETTE);
    expect(result.length).toBeGreaterThan(100);
    expect(result.every(b => b === 0)).toBe(false);
  });

  it('should encode frame delay from fps', () => {
    const frame = createPixelData(4, 4, null);
    const result = encodeGif([frame], 4, 4, 10, DEFAULT_PALETTE);
    const gceStart = 13 + 256 * 3 + 19;
    expect(result[gceStart]).toBe(0x21);
    expect(result[gceStart + 1]).toBe(0xF9);
    const delay = result[gceStart + 4] | (result[gceStart + 5] << 8);
    expect(delay).toBe(10);
  });
});
