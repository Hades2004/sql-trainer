/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

export default defineConfig(({ _mode }) => {
  // _mode to indicate it might be unused
  const vitePlugins = [react()];

  // Add visualizer plugin only when ANALYZE_BUNDLE env var is set
  if (process.env.ANALYZE_BUNDLE) {
    vitePlugins.push(
      visualizer({
        filename: 'stats.html', // Output file name
        open: false, // Don't open automatically, let user open it
        gzipSize: true,
        brotliSize: true,
      })
    );
  }

  return {
    base: '/sql-trainer/',
    plugins: vitePlugins,
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.js',
      coverage: {
        provider: 'v8', // or 'istanbul'
        reporter: ['text', 'json', 'html'],
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70, // Often good to include statements as well
        include: ['src/**/*.{js,jsx}'],
        exclude: [
          'src/main.jsx',
          'src/i18n.js',
          'src/setupTests.js',
          '**/*.test.{js,jsx}',
        ],
      },
    },
  };
});
