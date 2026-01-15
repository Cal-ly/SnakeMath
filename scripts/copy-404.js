/**
 * Copy index.html to 404.html for GitHub Pages SPA routing
 *
 * GitHub Pages serves 404.html for unknown routes, which allows
 * Vue Router to handle client-side routing for direct URL access.
 */
import { copyFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')
const indexPath = join(distDir, 'index.html')
const notFoundPath = join(distDir, '404.html')

if (existsSync(indexPath)) {
  copyFileSync(indexPath, notFoundPath)
  console.log('Created 404.html for GitHub Pages SPA routing')
} else {
  console.error('index.html not found in dist/')
  process.exit(1)
}
