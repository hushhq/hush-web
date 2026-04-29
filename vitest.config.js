import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  // Mirror the `@` alias from vite.config.js so test files (and any
  // imported shadcn primitives that resolve `@/lib/utils`) can be
  // transformed by Vitest's Vite-based pipeline. Kept in sync manually
  // since vitest.config.js is the single source for the test runner.
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: false,
    include: ['src/**/*.test.{js,jsx,ts,tsx}'],
    setupFiles: ['src/test/setup.js'],
  },
});
