// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({ 
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'], // Adicione outros assets aqui
      manifest: {
        name: 'TreinaFácil iCTG',
        short_name: 'iCTG Treino',
        description: 'Plataforma de treinamento para o dispositivo iCTG.',
        theme_color: '#ffffff',
        icons: [ // Crie ícones com esses tamanhos
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      } 
    })
  ],
})