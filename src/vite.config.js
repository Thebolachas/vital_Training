import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import { VitePWA } from 'vite-plugin-pwa'; // Assumindo que você usa este plugin

export default defineConfig({
  plugins: [
    react(),
    VitePWA({ // Configuração do seu PWA, mantida como a última que você forneceu
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'masked-icon.svg',
      ],
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
      },
      manifest: {
        name: 'TreinaFácil iCTG',
        short_name: 'iCTG Treino',
        description: 'Plataforma de treinamento para o dispositivo iCTG.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'pwa-512x512.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/ICTG_imagens/pwa-512x512.png', // Verifique este caminho
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  optimizeDeps: {
    esbuild: {
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  resolve: {
    alias: {
      'stream': 'stream-browserify',
      'buffer': 'buffer/',
      'util': 'util/',
    },
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
});