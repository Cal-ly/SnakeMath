# Increment 1F: GitHub Pages Deployment Configuration

## Context
SnakeMath will be deployed to GitHub Pages. The project needs proper Vite configuration for the base path and a GitHub Actions workflow for automated deployment.

## Task
Configure the project for GitHub Pages deployment with CI/CD.

## Vite Configuration Updates
Update `vite.config.ts`:

1. Set the `base` option to `'/SnakeMath/'` (matches the repository name for GitHub Pages)
2. Ensure build output goes to `dist/`
3. Configure proper asset handling for production

Note: The base path means the site will be at `https://<username>.github.io/SnakeMath/`

## GitHub Actions Workflow
Create `.github/workflows/deploy.yml`:

The workflow should:
1. Trigger on push to `main` branch
2. Also allow manual trigger (workflow_dispatch)
3. Use Node.js 20.x
4. Install dependencies with `npm ci`
5. Run type checking (`npm run type-check`)
6. Run tests (`npm run test -- --run`)
7. Run linting (`npm run lint`)
8. Build the project (`npm run build`)
9. Deploy to GitHub Pages using the official `actions/deploy-pages` action

Workflow requirements:
- Use `actions/checkout@v4`
- Use `actions/setup-node@v4` with caching for npm
- Use `actions/configure-pages@v4`
- Use `actions/upload-pages-artifact@v3` pointing to `./dist`
- Use `actions/deploy-pages@v4`
- Set appropriate permissions (contents: read, pages: write, id-token: write)

## Router History Mode Fix
For GitHub Pages with Vue Router history mode, we need a 404.html fallback.

Create a simple script or build step that copies `dist/index.html` to `dist/404.html` after build.

Update `package.json` scripts:
- Add a `postbuild` script that handles the 404.html copy
- Or integrate it into the build script

## Success Criteria
- `npm run build` creates production files in `dist/`
- `dist/404.html` exists after build (copy of index.html)
- Pushing to main triggers the GitHub Actions workflow
- After workflow completes, site is accessible at the GitHub Pages URL
- Vue Router navigation works correctly on GitHub Pages (no 404 on direct URL access)

## Constraints
- Do not use HashHistory mode - we want clean URLs
- The deployment should fail if type-check, tests, or lint fail
- Keep the workflow simple and fast (under 3 minutes ideally)
- Don't include source maps in production build