import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
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
            src: 'public/pwa-512x512.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'public/pwa-192x192.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/ICTG_imagens/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
});
