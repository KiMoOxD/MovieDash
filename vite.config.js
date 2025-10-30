import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'; // Import the plugin


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Dev server proxy to avoid CORS during local development. Any request to
  // /api/* will be forwarded to the backend. Adjust target if needed.
  server: {
    proxy: {
      '/api': {
        target: 'https://adminboard.runasp.net',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
})
