import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base apunta al nombre del repo para GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: '/NavidadDePorcelana/',
})
