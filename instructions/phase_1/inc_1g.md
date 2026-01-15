# SnakeMath - Increment 1G: ESLint and Prettier Configuration

## Context
The Vue scaffolding includes ESLint and Prettier, but we need to refine the configuration for our TypeScript + Vue 3 project and ensure consistent code style.

## Task
Refine ESLint and Prettier configuration, add VS Code integration, and ensure the archive folder is properly excluded.

## Requirements

### 1. Update ESLint Configuration
The Vue scaffolding may use either `.eslintrc.cjs` or the newer flat config `eslint.config.js`. Update whichever exists.

**If using `.eslintrc.cjs`**:
```javascript
/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    // Allow console.warn and console.error, warn on console.log
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    
    // Unused variables - allow underscore prefix for intentionally unused
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    
    // Vue component naming
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/multi-word-component-names': 'off', // Allow single-word names like "MathBlock"
    
    // Enforce script setup style
    'vue/component-api-style': ['error', ['script-setup']],
    
    // Enforce consistent attribute ordering in templates
    'vue/attributes-order': ['error', {
      order: [
        'DEFINITION',      // is, v-is
        'LIST_RENDERING',  // v-for
        'CONDITIONALS',    // v-if, v-else-if, v-else, v-show, v-cloak
        'RENDER_MODIFIERS', // v-pre, v-once
        'GLOBAL',          // id
        'UNIQUE',          // ref, key
        'SLOT',            // v-slot, slot
        'TWO_WAY_BINDING', // v-model
        'OTHER_DIRECTIVES', // v-custom-directive
        'OTHER_ATTR',      // custom attributes
        'EVENTS',          // @click, v-on
        'CONTENT'          // v-html, v-text
      ]
    }],

    // TypeScript specific
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
  },
  ignorePatterns: [
    'dist',
    'node_modules',
    'archive',
    'archive/**/*',
    '*.config.js',
    '*.config.ts',
    'scripts/**/*'
  ]
}
```

**If using flat config `eslint.config.js`**:
```javascript
import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },
  {
    name: 'app/files-to-ignore',
    ignores: [
      '**/dist/**',
      '**/dist-ssr/**',
      '**/coverage/**',
      '**/archive/**',
      '**/node_modules/**',
      'scripts/**',
    ],
  },
  ...pluginVue.configs['flat/recommended'],
  ...vueTsEslintConfig(),
  skipFormatting,
  {
    name: 'app/custom-rules',
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
]
```

### 2. Create Prettier Configuration
Create or update `.prettierrc.json`:

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "vueIndentScriptAndStyle": true,
  "htmlWhitespaceSensitivity": "ignore",
  "endOfLine": "lf"
}
```

Create `.prettierignore`:

```
# Build outputs
dist
dist-ssr
coverage

# Dependencies
node_modules

# Archive (old implementation)
archive

# Generated files
*.min.js
*.min.css

# Config files that have specific formatting
*.config.js
*.config.ts
```

### 3. Create VS Code Settings
Create `.vscode/settings.json`:

```json
{
  // Editor settings
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "editor.tabSize": 2,
  
  // File associations
  "files.associations": {
    "*.css": "css",
    "*.vue": "vue"
  },
  
  // Language-specific formatters
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.wordWrap": "on"
  },
  
  // TypeScript settings
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  
  // Path intellisense for @ alias
  "path-intellisense.mappings": {
    "@": "${workspaceFolder}/src"
  },
  
  // Exclude archive from search and file watching
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/archive": true
  },
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/dist/**": true,
    "**/archive/**": true
  },
  
  // Vue specific
  "vue.codeActions.enabled": true,
  "vue.autoInsert.dotValue": true
}
```

### 4. Create VS Code Extensions Recommendations
Create `.vscode/extensions.json`:

```json
{
  "recommendations": [
    // Vue
    "Vue.volar",
    
    // Linting & Formatting
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    
    // TypeScript
    "ms-vscode.vscode-typescript-next",
    
    // Tailwind CSS
    "bradlc.vscode-tailwindcss",
    
    // General productivity
    "christian-kohler.path-intellisense",
    "streetsidesoftware.code-spell-checker",
    
    // Git
    "eamodio.gitlens"
  ],
  "unwantedRecommendations": [
    // Vetur is deprecated for Vue 3
    "octref.vetur"
  ]
}
```

### 5. Update Package.json Scripts
Ensure these scripts are present:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write \"src/**/*.{vue,ts,tsx,js,jsx,css,json}\"",
    "format:check": "prettier --check \"src/**/*.{vue,ts,tsx,js,jsx,css,json}\""
  }
}
```

### 6. Run Initial Format
After configuration, run:

```bash
npm run format
npm run lint:fix
```

This will format all existing files to match the new configuration.

### 7. Create EditorConfig
Create `.editorconfig` for editors that don't use VS Code settings:

```ini
# EditorConfig - https://editorconfig.org
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false

[*.{yml,yaml}]
indent_size = 2
```

## Success Criteria
- [ ] `npm run lint` runs without configuration errors
- [ ] `npm run lint` shows no errors (warnings are acceptable initially)
- [ ] `npm run format:check` passes on all files after formatting
- [ ] VS Code shows linting errors inline (after installing recommended extensions)
- [ ] Save triggers auto-format and lint fix in VS Code
- [ ] No conflicts between ESLint and Prettier
- [ ] Archive folder is excluded from all linting and formatting
- [ ] Path aliases (`@/`) work correctly with ESLint

## Verification Steps

1. Open a `.vue` file, make a formatting change, save - should auto-format
2. Add `console.log('test')` - should show ESLint warning
3. Add `const x: any = 1` - should show ESLint error
4. Run `npm run lint` - should complete without errors
5. Run `npm run format:check` - should pass

## Constraints
- Keep rules focused on catching real issues, not style nitpicks (Prettier handles style)
- Don't add rules that will cause excessive noise during development
- Ensure configuration works with TypeScript in Vue SFCs
- Allow single-word component names (we have components like `MathBlock`)

## Phase 1 Complete! 🎉

After completing this increment, Phase 1 is complete. The project now has:

- ✅ Vue 3 + TypeScript + Vite foundation
- ✅ Tailwind CSS with theming
- ✅ Vue Router with MVP routes
- ✅ Type definitions for content and math
- ✅ Vitest with initial tests
- ✅ GitHub Actions CI/CD
- ✅ ESLint + Prettier configuration

## Next Phase

Phase 2 will focus on **Layout & Navigation**:
- AppHeader component
- Responsive navigation
- Theme switching
- Breadcrumbs component
- TopicPage layout wrapper
