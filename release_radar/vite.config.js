import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Dışarıdan erişim için önemli
    port: 3000       // Portu sabitlemek istersen buraya ekle
  }
})
