import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteBackendServer } from './vite-server-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteBackendServer(), // Add the backend server plugin
  ],
  server: {
    port: 5173,
    proxy: {
      // Proxy API requests to backend server during development
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})