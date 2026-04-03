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
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('/antd/') ||
              id.includes('/@ant-design/') ||
              id.includes('/rc-') ||
              id.includes('/@rc-component/') ||
              id.includes('/dayjs/')
            ) {
              return 'vendor-ui';
            }
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
