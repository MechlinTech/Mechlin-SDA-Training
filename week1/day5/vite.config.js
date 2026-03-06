import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        proxy: {
            // Proxy API requests to our Express server during development
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true
            }
        }
    }
})
