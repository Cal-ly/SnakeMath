# Visual Regression Testing

This document explains how to work with visual regression tests in SnakeMath.

## Overview

Visual regression tests capture screenshots of pages and widgets, comparing them against baseline images to detect unintended visual changes. We use Playwright's built-in screenshot comparison.

## Test Structure

```
e2e/
├── visual/
│   └── snapshots.spec.ts    # Visual regression test definitions
└── __screenshots__/         # Generated baseline screenshots
    ├── snapshots.spec.ts-visual-desktop/  # Desktop baselines
    └── snapshots.spec.ts-visual-mobile/   # Mobile baselines
```

## Commands

### Run Visual Tests

```bash
# Run desktop visual tests
npm run test:visual

# Run mobile visual tests
npm run test:visual:mobile
```

### Update Baselines

When you intentionally change the UI, update the baseline screenshots:

```bash
# Update desktop baselines
npm run test:visual:update

# Update mobile baselines (if needed)
npx playwright test --project=visual-mobile --update-snapshots
```

### Review Failures

When visual tests fail, Playwright generates diff images showing the changes:

1. Check the HTML report: `npx playwright show-report`
2. Look for the diff images in the report
3. Decide if the change is intentional or a bug

## When to Update vs. Investigate

**Update baselines when:**
- You intentionally changed UI (colors, layout, typography)
- Added new content to a page
- Modified widget styling

**Investigate when:**
- You didn't expect any visual changes
- Changes appear in areas you didn't modify
- Diff shows unexpected artifacts

## Configuration

Visual tests are configured in `playwright.config.ts`:

- **Threshold**: 10% pixel difference allowed (handles minor anti-aliasing differences)
- **Viewport**: Desktop (1280x720), Mobile (375x667)
- **Animations**: Disabled via `prefers-reduced-motion: reduce`

## Best Practices

1. **Disable animations** before taking screenshots (done automatically via `emulateMedia`)
2. **Wait for async content** (KaTeX, Shiki) to load before capturing
3. **Use consistent viewports** across test runs
4. **Capture widget-specific states** for interactive components
5. **Run visual tests locally** before pushing to verify changes

## Adding New Visual Tests

When adding a new page or widget:

1. Add test case in `e2e/visual/snapshots.spec.ts`
2. Run `npm run test:visual:update` to create baseline
3. Commit the new baseline images
4. CI will detect regressions going forward

## CI Integration

Visual regression tests run automatically on:
- Push to `main`
- Pull requests to `main`

On failure, screenshot artifacts are uploaded for review.

## Troubleshooting

### Tests fail inconsistently

- Ensure animations are disabled
- Increase timeout for slow-rendering content
- Check for dynamic content (timestamps, etc.) that should be masked

### Large diff files

- Visual baselines are binary files that can grow large
- Consider using `.gitattributes` to mark as binary
- Only update baselines when necessary

### Platform differences

- Baseline images should be generated on the same platform as CI
- We use Chromium-only testing to reduce cross-browser visual flakiness
