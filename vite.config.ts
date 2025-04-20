import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Comment out the viteBackendServer import during development until it's fixed
// import { viteBackendServer } from './vite-server-plugin.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Disable the backend server plugin until issues are fixed
    // viteBackendServer(),
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
  optimizeDeps: {
    include: ['@clerk/clerk-react'],
  },
})