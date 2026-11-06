import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
    // Local API requests go to the Cloudflare Worker dev server.
    proxy: {
      '/api': {
        target: process.env.WORKER_API_URL || 'http://127.0.0.1:8787',
        changeOrigin: true,
        secure: false,
      },
    },
  },
}));
