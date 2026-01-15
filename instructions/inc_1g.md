# Increment 1G: ESLint and Prettier Configuration Refinement

## Context
The Vue scaffolding includes ESLint and Prettier, but we need to refine the configuration for our TypeScript + Vue 3 project.

## Task
Refine ESLint and Prettier configuration for consistent code style.

## ESLint Configuration
Update `.eslintrc.cjs` (or `eslint.config.js` if using flat config):

1. Extend from:
   - `eslint:recommended`
   - `plugin:vue/vue3-recommended`
   - `@vue/eslint-config-typescript/recommended`
   - `@vue/eslint-config-prettier`

2. Add custom rules:
   - Warn on `console.log` (but allow console.warn and console.error)
   - Error on unused variables (except those prefixed with `_`)
   - Enforce consistent component name casing (PascalCase)
   - Enforce `<script setup>` style for Vue components
   - Allow single-word component names (we'll have components like "MathBlock")

3. Configure for our path aliases:
   - Ensure `@/` imports resolve correctly for linting

## Prettier Configuration
Create or update `.prettierrc.json`:

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "vueIndentScriptAndStyle": true
}
```

This configuration:
- No semicolons (cleaner look, matches much Vue ecosystem code)
- Single quotes for strings
- 2-space indentation
- Trailing commas for cleaner git diffs
- 100 character line width (good balance)
- Indent script and style blocks in Vue SFCs

## VS Code Integration
Create `.vscode/settings.json`:

1. Enable format on save using Prettier
2. Set Prettier as default formatter for JS, TS, Vue, JSON, CSS
3. Enable ESLint auto-fix on save
4. Configure path alias intellisense

Create `.vscode/extensions.json`:
- Recommend Vue Official extension (Vue.volar)
- Recommend ESLint extension
- Recommend Prettier extension

## Package.json Scripts
Ensure these scripts exist:
- `lint`: Run ESLint on src directory
- `lint:fix`: Run ESLint with --fix flag
- `format`: Run Prettier on src directory
- `format:check`: Run Prettier check (for CI)

## Success Criteria
- `npm run lint` runs without configuration errors
- `npm run format:check` passes on all files
- VS Code shows linting errors inline
- Save triggers format and lint fix
- No conflicts between ESLint and Prettier

## Constraints
- Keep rules focused on catching real issues, not style nitpicks (Prettier handles style)
- Don't add rules that will cause excessive noise
- Ensure configuration works with TypeScript in Vue SFCs