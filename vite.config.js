/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/sql-trainer/',
  plugins: [react()],
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
      // include: ['src/**/*.{js,jsx}'], // uncomment to specify files to include
      // exclude: ['src/main.jsx', 'src/i18n.js', 'src/setupTests.js', '**/*.test.{js,jsx}'], // uncomment to specify files to exclude
    },
  },
});
