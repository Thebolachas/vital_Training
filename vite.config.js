// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import polyfillNode from 'rollup-plugin-polyfill-node'; // Importar o polyfill

export default defineConfig({
  plugins: [
    react(),
    VitePWA({ /* ...suas configurações PWA... */ }),
    polyfillNode({
      include: ['_stream_passthrough', 'stream']
    })
  ],
  server: {
    host: true,
    // **** REMOVA OU COMENTE ESSAS LINHAS ABAIXO ****
    // headers: {
    //   'Cross-Origin-Opener-Policy': 'same-origin',
    //   'Cross-Origin-Embedder-Policy': 'require-corp',
    // },
  },
  resolve: {
    alias: {
      './runtimeConfig': './runtimeConfig.browser',
    },
  },
  optimizeDeps: {
    exclude: ['firebase']
  }
});