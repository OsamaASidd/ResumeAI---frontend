import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteBackendServer } from './vite-server-plugin.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Disable the backend server during development to avoid the import issue
    viteBackendServer(),
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