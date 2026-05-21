import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      // Proxy for Discipline Images
      '/portal-assets': {
        target: 'https://portal.attlarp.gr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/portal-assets/, '')
      },
      // Proxy for the Main Site Logo
      '/attlarp-assets': {
        target: 'https://attlarp.gr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/attlarp-assets/, '')
      }
    }
  }
})