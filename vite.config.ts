import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api': {
        target: 'https://api.aleo1.to/v1/',
        changeOrigin: true,
        timeout: 300000,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
});
