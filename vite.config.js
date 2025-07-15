// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'masked-icon.svg',
        // NOVOS ÍCONES DO SEU PROJETO - USANDO OS CAMINHOS EXATOS QUE VOCÊ FORNECEU
        '/print/android-launchericon-192-192.png',
        '/print/android-launchericon-512-512.png',
      ],
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
      },
      manifest: {
        name: 'TreinaFácil iCTG',
        short_name: 'iCTG Treino',
        description: 'Plataforma de treinamento para o dispositivo iCTG.',
        theme_color: '#A9D5EC', // Cor da imagem anterior (azul claro)
        background_color: '#A9D5EC', // Cor da imagem anterior (azul claro)
        display: 'standalone',
        start_url: '/',
        icons: [
          // ÍCONE PRINCIPAL 192x192
          {
            src: '/print/android-launchericon-192-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          // ÍCONE PRINCIPAL 512x512 (para maior resolução e adaptabilidade)
          {
            src: '/print/android-launchericon-512-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable', // Importante para ícones adaptáveis em Android
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