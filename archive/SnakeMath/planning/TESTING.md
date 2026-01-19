# Testing Strategy

This document explains the testing strategy for SnakeMath and how to work with each type of test.

## Testing Layers

SnakeMath uses a multi-layered testing approach:

| Layer | Tool | Purpose | Location |
|-------|------|---------|----------|
| Unit Tests | Vitest | Test pure functions, utilities | `src/**/*.test.ts` |
| E2E Tests | Playwright | Test user interactions | `e2e/**/*.spec.ts` (with `@e2e` tag) |
| Accessibility | Playwright + axe-core | WCAG 2.1 AA compliance | `e2e/accessibility/` (with `@a11y` tag) |
| Visual Regression | Playwright | Detect UI changes | `e2e/visual/` (with `@visual` tag) |

## Running Tests

### Quick Commands

```bash
# Unit tests
npm run test              # Run once
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage report

# E2E tests (functional)
npm run test:e2e          # Run E2E tests (excludes visual)

# Accessibility tests
npm run test:a11y         # Run accessibility audits only

# Visual regression (local only)
npm run test:visual       # Run visual tests
npm run test:visual:update # Update baselines

# Run everything
npm run test:all          # Unit + E2E + A11y
```

### Before Committing

```bash
npm run type-check && npm run lint && npm run test && npm run build
```

## CI Workflow

The CI workflow uses a **tiered approach** for efficiency:

### Tier 1: Quick Check (Always runs)
Triggers on every push to `main` or `develop`:
- Type checking
- Linting
- Unit tests
- Build verification

### Tier 2: Full Test (PR only)
Triggers on pull requests to `main`:
- All of Tier 1
- E2E functional tests
- Accessibility audits

**Note**: Visual regression tests are NOT included in CI due to cross-platform rendering differences. They run locally only.

## Test Tags

Tests use tags for selective execution:

- `@e2e` - Functional end-to-end tests
- `@a11y` - Accessibility tests (WCAG audits, keyboard nav)
- `@visual` - Visual regression tests (screenshots)

Example usage:
```typescript
test.describe('MyFeature @e2e', () => {
  test('should work correctly', async ({ page }) => {
    // ...
  })
})
```

## Unit Tests

### Location
Co-located with source files:
```
src/utils/math/
├── numberClassification.ts
└── numberClassification.test.ts
```

### What to Test
- **Always test**: Math utilities, classification logic, data transformations
- **Test selectively**: Component logic via composables
- **Don't test**: Vue internals, Tailwind classes, static content

### Example
```typescript
import { describe, it, expect } from 'vitest'
import { classifyNumber } from './numberClassification'

describe('classifyNumber', () => {
  it('classifies positive integers as natural', () => {
    const result = classifyNumber('5')
    expect(result.isNatural).toBe(true)
  })
})
```

## E2E Tests

### Location
```
e2e/
├── navigation.spec.ts         # Site navigation
├── basics/
│   └── number-types.spec.ts   # NumberTypeExplorer
├── algebra/
│   ├── summation.spec.ts      # SummationExplorer
│   └── quadratic-explorer.spec.ts  # QuadraticExplorer
└── accessibility/
    └── audit.spec.ts          # WCAG audits
```

### Writing E2E Tests

```typescript
import { test, expect } from '@playwright/test'

const BASE = '/SnakeMath'

test.describe('MyWidget @e2e', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/path/to/page`)
  })

  test('user interaction works', async ({ page }) => {
    // Use data-testid for reliable selectors
    await page.locator('[data-testid="my-input"]').fill('42')
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.locator('[data-testid="result"]')).toContainText('42')
  })
})
```

### Important: BASE Path
All page URLs must include the `/SnakeMath` base path:
```typescript
const BASE = '/SnakeMath'
await page.goto(`${BASE}/algebra/quadratics`)
```

### data-testid Convention
Add `data-testid` attributes to elements that tests need to interact with:
- Input fields
- Buttons
- Result displays
- Toggle controls

## Accessibility Tests

### WCAG 2.1 AA Compliance
Every page is audited for accessibility violations using axe-core:

```typescript
import AxeBuilder from '@axe-core/playwright'

test('page passes WCAG 2.1 AA @a11y', async ({ page }) => {
  await page.goto(`${BASE}/basics/number-types`)
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()

  expect(results.violations).toEqual([])
})
```

### What Gets Tested
- Color contrast
- Heading hierarchy
- Form labels
- ARIA attributes
- Keyboard navigation
- Focus management

### Adding New Pages
When adding a new page, add it to `pagesToAudit` in `e2e/accessibility/audit.spec.ts`:

```typescript
const pagesToAudit = [
  // ... existing pages
  { name: 'New Page', path: `${BASE}/path/to/new-page` },
]
```

## Visual Regression Tests

### Local Only
Visual tests are **not run in CI** because:
- Cross-platform rendering differences cause false positives
- Font rendering varies between systems
- The overhead doesn't match the value for this project

### Running Locally

```bash
# Run visual tests
npm run test:visual

# Update baselines when you intentionally change UI
npm run test:visual:update
```

### Baselines
Screenshots are stored in `e2e/__screenshots__/` and committed to git.

See [VISUAL_TESTING.md](../VISUAL_TESTING.md) for more details.

## Adding Tests for New Features

### New Widget
1. Create unit tests for any utility functions
2. Create E2E test file: `e2e/widgets/my-widget.spec.ts`
3. Add `data-testid` attributes to interactive elements
4. Add page to accessibility audit list
5. Optionally add visual regression tests

### New Page
1. Add to navigation tests if needed
2. Add to accessibility audit list
3. Optionally add visual regression tests

## Troubleshooting

### Tests Timeout
- Ensure the preview server is running for E2E tests
- Check network conditions
- Increase timeout for slow-rendering content (KaTeX, Shiki)

### Element Not Found
- Verify `data-testid` attributes exist
- Check the BASE path is included in URLs
- Use `await page.waitForLoadState('networkidle')`

### Accessibility Violations
- Check browser console for the specific violation
- Run `npx playwright show-report` to see details
- Review axe-core documentation for fixes

### Visual Test Differences
- Check if change is intentional
- Update baselines if intentional: `npm run test:visual:update`
- Investigate if unexpected

## Configuration Files

- `vitest.config.ts` - Unit test configuration
- `playwright.config.ts` - E2E test configuration
- `src/test/setup.ts` - Vitest setup file
