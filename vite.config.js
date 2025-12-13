import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import imagemin from 'vite-plugin-imagemin'

function getHtmlFiles() {
  const entries = {}
  
  function scanDir(dir, base = '') {
    if (!fs.existsSync(dir)) return
    
    const items = fs.readdirSync(dir)
    
    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        if (!['node_modules', 'dist', 'src', '.git'].includes(item)) {
          scanDir(fullPath, base ? `${base}/${item}` : item)
        }
      } else if (item.endsWith('.html')) {
        let entryName = base ? `${base}/${item.replace('.html', '')}` : item.replace('.html', '')
        
        if (item === 'index.html' && base === '') {
          entryName = 'main'
        }
        
        entries[entryName] = fullPath
      }
    }
  }
  
  scanDir('.')
  return entries
}

// Простой плагин для пост-обработки
function fixHtmlPathsPlugin() {
  return {
    name: 'fix-html-paths',
    closeBundle() {
      // Даем Vite время завершить запись файлов
      setTimeout(() => {
        try {
          const distDir = path.resolve(__dirname, 'dist')
          
          // Находим все собранные файлы
          const assetsDir = path.join(distDir, 'assets')
          if (!fs.existsSync(assetsDir)) return
          
          const assets = fs.readdirSync(assetsDir)
          const cssFile = assets.find(f => f.startsWith('main-') && f.endsWith('.css'))
          const jsFile = assets.find(f => f.startsWith('main-') && f.endsWith('.js'))
          const favicon = assets.find(f => f.includes('logo') && f.endsWith('.ico'))
          const font = assets.find(f => f.includes('Sansation-Regular') && f.endsWith('.woff2'))
          
          console.log('Найдены файлы:', { cssFile, jsFile, favicon, font })
          
          // Обрабатываем ВСЕ HTML файлы
          function processHtmlFiles(dir) {
            const items = fs.readdirSync(dir)
            
            for (const item of items) {
              const fullPath = path.join(dir, item)
              const stat = fs.statSync(fullPath)
              
              if (stat.isDirectory()) {
                // Игнорируем папку assets
                if (item !== 'assets') {
                  processHtmlFiles(fullPath)
                }
              } else if (item.endsWith('.html')) {
                let content = fs.readFileSync(fullPath, 'utf8')
                
                // Определяем глубину вложенности
                const relativePath = path.relative(distDir, fullPath)
                const depth = relativePath.split(path.sep).length - 1
                const prefix = depth > 0 ? '../'.repeat(depth) : './'
                
                console.log(`Обработка ${fullPath}, глубина: ${depth}, префикс: ${prefix}`)
                
                // 1. Исправляем CSS (ВАЖНО: используем регулярное выражение, которое найдет существующий CSS)
                if (cssFile) {
                  // Ищем любую ссылку на CSS и заменяем её
                  content = content.replace(
                    /<link[^>]*?rel="stylesheet"[^>]*?href="[^"]*\.css"[^>]*?>/g,
                    `<link rel="stylesheet" crossorigin href="${prefix}assets/${cssFile}">`
                  )
                }
                
                // 2. Исправляем JS
                if (jsFile) {
                  content = content.replace(
                    /<script[^>]*?type="module"[^>]*?src="[^"]*\.js"[^>]*?><\/script>/g,
                    `<script type="module" crossorigin src="${prefix}assets/${jsFile}"></script>`
                  )
                }
                
                // 3. Исправляем favicon
                if (favicon) {
                  content = content.replace(
                    /<link[^>]*?rel="icon"[^>]*?href="[^"]*\.ico"[^>]*?>/g,
                    `<link rel="icon" type="image/x-icon" href="${prefix}assets/${favicon}">`
                  )
                }
                
                // 4. Исправляем шрифт
                if (font) {
                  content = content.replace(
                    /<link[^>]*?rel="preload"[^>]*?href="[^"]*\.woff2"[^>]*?as="font"[^>]*?>/g,
                    `<link rel="preload" href="${prefix}assets/${font}" as="font" type="font/woff2" crossorigin>`
                  )
                }
                
                fs.writeFileSync(fullPath, content, 'utf8')
                console.log(`✓ Обновлен: ${fullPath}`)
              }
            }
          }
          
          processHtmlFiles(distDir)
          console.log('✅ Все HTML файлы обработаны!')
        } catch (error) {
          console.error('❌ Ошибка при обработке HTML:', error)
        }
      }, 500) // Увеличил задержку
    }
  }
}

export default defineConfig({
  base: './',
  
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: getHtmlFiles()
    }
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@scripts': path.resolve(__dirname, 'src/scripts'),
    }
  },
  
  plugins: [
    fixHtmlPathsPlugin(),
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