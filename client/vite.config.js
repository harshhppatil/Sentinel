import { defineConfig } from 'vite'
import react       from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // auth-service (Node/Express) → port 5000
      '/auth-api': {
        target:       'http://localhost:5000',
        changeOrigin: true,
        rewrite:      (path) => path.replace(/^\/auth-api/, ''),
      },
      // api-service (Node/Express) → port 5001
      '/api': {
        target:       'http://localhost:5001',
        changeOrigin: true,
      },
      // architect-service (Spring Boot) → port 8080
      '/architect-api': {
        target:       'http://localhost:8080',
        changeOrigin: true,
        rewrite:      (path) => path.replace(/^\/architect-api/, ''),
      },
    },
  },
})