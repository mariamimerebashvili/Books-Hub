import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const api = process.env.VITE_PROXY_TARGET || 'http://localhost:4100'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': api,
      '/uploads': api,
    },
  },
})
