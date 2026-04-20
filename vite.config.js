import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

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
    chunkSizeWarningLimit: 1200,
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('/antd/')) return 'vendor-ui';
            if (id.includes('/@ant-design/')) return 'vendor-ui';
            if (id.includes('/@rc-component/') || id.includes('/rc-')) return 'vendor-ui';
            if (id.includes('/react-dom/')) return 'vendor-react-dom';
            if (id.includes('/react/')) return 'vendor-react';
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
  server: {
    host: true,
    port: 80,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});

