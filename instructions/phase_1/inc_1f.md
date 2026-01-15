# SnakeMath - Increment 1F: GitHub Pages Deployment

## Context
SnakeMath will be deployed to GitHub Pages. The project needs proper Vite configuration for the base path and a GitHub Actions workflow for automated deployment.

## Task
Configure the project for GitHub Pages deployment with CI/CD.

## Requirements

### 1. Update `vite.config.ts` for GitHub Pages
Update the Vite configuration to set the correct base path:

```typescript
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  
  // GitHub Pages base path - matches repository name
  base: '/SnakeMath/',
  
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  
  build: {
    // Exclude archive from build
    rollupOptions: {
      external: [/^\.\/archive\/.*/]
    },
    // Don't generate source maps for production
    sourcemap: false,
  },
  
  server: {
    watch: {
      ignored: ['**/archive/**']
    }
  }
})
```

### 2. Create 404.html Handling Script
Create `scripts/copy-404.js` in the project root:

```javascript
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
  console.log('✓ Created 404.html for GitHub Pages SPA routing')
} else {
  console.error('✗ index.html not found in dist/')
  process.exit(1)
}
```

### 3. Update `package.json` Scripts
Add the postbuild script:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "run-p type-check \"build-only {@}\" --",
    "build-only": "vite build",
    "postbuild": "node scripts/copy-404.js",
    "preview": "vite preview",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "type-check": "vue-tsc --build --force",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --ignore-path .gitignore",
    "lint:fix": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --ignore-path .gitignore --fix",
    "format": "prettier --write src/",
    "format:check": "prettier --check src/"
  }
}
```

Note: If `run-p` is not available, you can simplify the build script to:
```json
"build": "vue-tsc --build --force && vite build"
```

### 4. Create GitHub Actions Workflow
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  # Deploy on push to main
  push:
    branches: ['main']
  # Allow manual deployment
  workflow_dispatch:

# Set permissions for GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one deployment at a time
concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  # Build job
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run type-check

      - name: Lint
        run: npm run lint

      - name: Run tests
        run: npm run test:run

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  # Deploy job
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 5. Create `.gitignore` Updates
Ensure `.gitignore` includes:

```gitignore
# Dependencies
node_modules

# Build output
dist
dist-ssr
*.local

# Editor directories
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
.idea

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# OS files
.DS_Store
Thumbs.db

# Test coverage
coverage

# TypeScript cache
*.tsbuildinfo

# Environment files
.env
.env.local
.env.*.local
```

### 6. Verify Router Base Path
Check that the router in `src/router/index.ts` uses `import.meta.env.BASE_URL`:

```typescript
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // ...
})
```

This ensures the router respects the `/SnakeMath/` base path.

### 7. Create GitHub Repository Settings Guide
Create `docs/GITHUB_PAGES_SETUP.md`:

```markdown
# GitHub Pages Setup Guide

## One-time Repository Configuration

After pushing this code to GitHub, you need to configure GitHub Pages:

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Build and deployment**:
   - Source: Select **GitHub Actions**
4. The workflow will automatically deploy on the next push to `main`

## Deployment URL

After successful deployment, your site will be available at:
```
https://<your-username>.github.io/SnakeMath/
```

## Manual Deployment

To trigger a manual deployment:
1. Go to **Actions** tab in your repository
2. Select **Deploy to GitHub Pages** workflow
3. Click **Run workflow**

## Troubleshooting

### Build fails on type-check
- Run `npm run type-check` locally to see errors
- Fix TypeScript errors before pushing

### Build fails on lint
- Run `npm run lint:fix` locally to auto-fix issues
- Commit the fixes

### 404 on direct URL access
- Ensure `scripts/copy-404.js` runs after build
- Check that `dist/404.html` exists after build

### Assets not loading
- Verify `base` in `vite.config.ts` matches your repo name
- Check browser console for 404 errors on asset URLs
```

## Success Criteria
- [ ] `npm run build` creates production files in `dist/`
- [ ] `dist/404.html` exists after build (copy of index.html)
- [ ] Pushing to `main` triggers the GitHub Actions workflow
- [ ] Workflow passes all checks (type-check, lint, test, build)
- [ ] Site is accessible at `https://<username>.github.io/SnakeMath/`
- [ ] Vue Router navigation works on GitHub Pages (no 404 on direct URL)
- [ ] All internal links work correctly with the base path

## Local Preview
To preview the production build locally:
```bash
npm run build
npm run preview
```

The preview server will run at `http://localhost:4173/SnakeMath/`

## Constraints
- Do not use HashHistory mode - we want clean URLs
- The deployment should fail if type-check, tests, or lint fail (quality gate)
- Keep the workflow simple and fast (target under 3 minutes)
- Source maps are disabled in production for smaller bundle size

## Next Increment
After completion, proceed to `inc_1g.md` for ESLint and Prettier configuration refinement.
