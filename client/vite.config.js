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
      // Proxying API requests to the backend server
      '/api': {
        target: 'http://localhost:3000', // Your backend server URL
        changeOrigin: true,
        timeout: 600000,
      }
    }
  }
})
