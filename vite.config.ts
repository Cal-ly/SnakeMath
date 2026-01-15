import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],

  // GitHub Pages base path - matches repository name
  base: '/SnakeMath/',

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },

  // Exclude archive from processing
  build: {
    rollupOptions: {
      external: [/^\.\/archive\/.*/]
    },
    // Don't generate source maps for production
    sourcemap: false,
  },

  // Exclude archive from file watching
  server: {
    watch: {
      ignored: ['**/archive/**']
    }
  }
})
