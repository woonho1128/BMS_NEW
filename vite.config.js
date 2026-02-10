import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  base: '/BMS_NEW/',
  plugins: [react()],
  css: {
    // PostCSS config auto-discovery can pick up a parent-directory config.
    // Inline it here to ensure Tailwind v4 uses @tailwindcss/postcss (not tailwindcss).
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  server: {
    host: true, // 0.0.0.0 바인딩 (내 IP로도 접속 가능)
    port: 80,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
