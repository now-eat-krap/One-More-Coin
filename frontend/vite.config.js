import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()], //vueDevTools(),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      // FastAPI 백엔드 프록시
      '/api': {
        target: 'http://fastapi:8000',
        changeOrigin: true,
      },
      // Spring 백엔드 프록시 (OAuth 등)
      '/oauth2': {
        target: 'http://spring:8080',
        changeOrigin: true,
      },
      '/login': {
        target: 'http://spring:8080',
        changeOrigin: true,
      },
    }
  }
})