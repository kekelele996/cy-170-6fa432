import { defineConfig } from 'vitest/config';

export default defineConfig({
  server: {
    host: '127.0.0.1'
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/utils/**/*.js', 'src/hooks/**/*.js'],
      exclude: ['src/**/*.test.js']
    }
  }
});
