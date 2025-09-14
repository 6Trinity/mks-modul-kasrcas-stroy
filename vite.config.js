import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: path.resolve(__dirname, 'src'),
  build: {
    outDir: '../dist', // сборка в корневую dist
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/index.html')
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
})