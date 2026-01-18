import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginVitest from '@vitest/eslint-plugin'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  globalIgnores([
    '**/dist/**',
    '**/dist-ssr/**',
    '**/coverage/**',
    '**/archive/**',
    '**/node_modules/**',
    'scripts/**',
  ]),

  ...pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/*.test.ts', 'src/**/__tests__/*'],
    rules: {
      ...pluginVitest.configs.recommended.rules,
      // Recognize expectClose helper as containing assertions
      'vitest/expect-expect': [
        'error',
        {
          assertFunctionNames: ['expect', 'expectClose'],
        },
      ],
    },
  },

  skipFormatting,

  {
    name: 'app/custom-rules',
    rules: {
      // Allow console.warn and console.error, warn on console.log
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // Unused variables - allow underscore prefix for intentionally unused
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // Allow single-word component names like "MathBlock"
      'vue/multi-word-component-names': 'off',

      // Disallow any type
      '@typescript-eslint/no-explicit-any': 'error',
    },
  }
)
