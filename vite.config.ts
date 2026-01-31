import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: [
      'estimate-portal-2.preview.emergentagent.com',
      '.preview.emergentagent.com',
      'localhost'
    ]
  }
})
