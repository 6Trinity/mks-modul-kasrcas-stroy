import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import imagemin from 'vite-plugin-imagemin' 

const htmlFiles = fs.readdirSync('.').filter(file => 
  file.endsWith('.html') && file !== 'index.html'
)

const input = {
  main: './index.html'
}

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
  },
  plugins: [
    imagemin({
      gifsicle: { optimizationLevel: 3 },
      mozjpeg: { quality: 80 },           
      pngquant: { quality: [0.8, 0.9] },  
      svgo: {
        plugins: [
          { removeViewBox: false }        
        ]
      }
    })
  ]
})