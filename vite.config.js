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
        // 'apple-touch-icon.png', // Removido ou ajustado se não for mais usado
        'masked-icon.svg', // Se ainda usar um ícone mascarado genérico
        // Ícones específicos para Android
        '/print/android-launchericon-192-192.png',
        '/print/android-launchericon-512-512.png',
        // Ícone específico para iOS (iPhone) com o caminho e tamanho fornecidos
        '/print/180.png', 
      ],
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
      },
      manifest: {
        name: 'TreinaFácil iCTG',
        short_name: 'iCTG Treino',
        description: 'Plataforma de treinamento para o dispositivo iCTG.',
        theme_color: '#A9D5EC', // Cor do tema (ajuste se necessário)
        background_color: '#A9D5EC', // Cor de fundo (ajuste se necessário)
        display: 'standalone',
        start_url: '/',
        icons: [
          // Ícone para Android (e outras plataformas que usam o manifest) - 192x192
          {
            src: '/print/android-launchericon-192-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          // Ícone para Android (e outras plataformas que usam o manifest) - 512x512
          {
            src: '/print/android-launchericon-512-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable', // Importante para ícones adaptáveis em Android
          },
          // Ícone específico para iOS (iPhone) no manifest (redundância, mas bom ter)
          {
            src: '/print/180.png', 
            sizes: '180x180', // Tamanho do ícone para iPhone
            type: 'image/png',
            // purpose: 'apple touch icon' // Não é um 'purpose' padrão do manifest, apenas informativo
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