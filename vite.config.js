import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'

// Автоматически находим все HTML-файлы в корне
const htmlFiles = fs.readdirSync('.').filter(file => 
  file.endsWith('.html') && file !== 'index.html'
)

const input = {
  main: './index.html'
}

// Добавляем остальные страницы
htmlFiles.forEach(file => {
  const name = file.replace('.html', '')
  input[name] = `./${file}`
})

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: input
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})