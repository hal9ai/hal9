import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import EnvironmentPlugin from 'vite-plugin-environment';
import vue2 from '@vitejs/plugin-vue2';
import packageFile from './package.json';
import copy from 'rollup-plugin-copy';

console.log('vite.config.js environment: ' + process.env.HAL9_ENV);

// https://vitejs.dev/config/
export default defineConfig({
  clearScreen: false,
  plugins: [
    EnvironmentPlugin({ HAL9_ENV: null }),
    vue2({
      template: {
        transformAssetUrls: {
          // these are in addition to the defaults listed here: https://github.com/vitejs/vite-plugin-vue2#asset-url-handling
          object: ['data'],
        },
      },
    }),
    copy({
      targets: [{ src: 'dist/index.html', dest: 'dist', rename: 'for.html' }],
      hook: 'writeBundle',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 8090,
    host: true,
    // open: '/index.html'
  },
  preview: {
    port: 8090,
    // 'host' and 'open' pulled from 'server' config by default
  },
  build: {
    rollupOptions: {
      input: {
        app: './index.html',
      },
    },
  },
  define: {
    VERSION: JSON.stringify(packageFile.version),
    HAL9ENV: JSON.stringify(process.env.HAL9_ENV ? process.env.HAL9_ENV : 'local'),
  },
});
