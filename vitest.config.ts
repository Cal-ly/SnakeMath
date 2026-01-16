import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'archive/**/*', 'e2e/**/*'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      // Enable globals (describe, it, expect without imports)
      globals: true,
      // Setup file for global test utilities
      setupFiles: ['./src/test/setup.ts'],
      // Coverage configuration
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'archive/',
          'src/test/',
          '**/*.d.ts',
          '**/*.config.*',
          '**/index.ts', // barrel exports
        ],
      },
    },
  }),
)
