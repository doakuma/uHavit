import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
      '@components': path.resolve(process.cwd(), './src/components'),
      '@pages': path.resolve(process.cwd(), './src/pages'),
      '@hooks': path.resolve(process.cwd(), './src/hooks'),
      '@services': path.resolve(process.cwd(), './src/services'),
      '@utils': path.resolve(process.cwd(), './src/utils'),
      '@constants': path.resolve(process.cwd(), './src/constants'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
