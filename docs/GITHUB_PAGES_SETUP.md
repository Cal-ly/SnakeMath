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
- Run `npm run lint` locally to auto-fix issues
- Commit the fixes

### 404 on direct URL access
- Ensure `scripts/copy-404.js` runs after build
- Check that `dist/404.html` exists after build

### Assets not loading
- Verify `base` in `vite.config.ts` matches your repo name
- Check browser console for 404 errors on asset URLs
