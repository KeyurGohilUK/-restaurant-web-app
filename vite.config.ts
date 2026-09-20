import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/restaurant-web-app/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
});
