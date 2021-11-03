import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    manifest: {
      lang: 'en',
      name: 'magloop-controller',
      short_name: 'MLA',
      background_color: '#fff',
      theme_color: '#fff',
      display: 'standalone',
      scope: '/magloop-controller/',
      start_url: '/magloop-controller/',
      icons: [
      ]
    }
  })],
  base: './',
  build: {
    outDir: '../docs'
  }
})
