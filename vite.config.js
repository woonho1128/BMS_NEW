import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: '/BMS_NEW/',
  plugins: [react()],
  esbuild: {
    drop: ['console', 'debugger'],
  },
  build: {
    target: 'es2020',
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Keep Ant Design + RC ecosystem in one chunk to avoid circular chunk graph,
            // while splitting other stable dependencies.
            if (
              id.includes('/antd/') ||
              id.includes('/@ant-design/') ||
              id.includes('/rc-') ||
              id.includes('/@rc-component/')
            ) {
              return 'vendor-ui';
            }
            if (id.includes('/dayjs/')) return 'vendor-dayjs';
            if (id.includes('/react-router-dom/') || id.includes('/react-router/')) return 'vendor-router';
            if (id.includes('/lucide-react/')) return 'vendor-icons';
            return 'vendor';
          }
          return undefined;
        },
      },
    },
  },
  css: {
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
