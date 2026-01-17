# Increment 12E: E2E Tests & Polish

**Goal**: Add comprehensive E2E tests, accessibility tests, and polish for production readiness.

**Estimated Time**: 30 minutes

**Prerequisites**: Increment 12D complete (content page integrated and functional)

---

## Files to Create/Update

### 1. `e2e/linear-algebra/matrix-transformations.spec.ts`

Create comprehensive E2E tests:

```typescript
import { test, expect } from '@playwright/test'

// Base path for the app (matches vite.config.ts base)
const BASE = '/SnakeMath'

test.describe('MatrixTransformations Widget @e2e', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/linear-algebra/matrices`)
    await page.waitForLoadState('networkidle')
  })

  test('page loads successfully', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Matrices')
  })

  test('widget is visible', async ({ page }) => {
    const widget = page.locator('[data-testid="matrix-transformations"]')
    await expect(widget).toBeVisible()
  })

  test('transformation canvas is visible', async ({ page }) => {
    const canvas = page.locator('[data-testid="transformation-canvas"]')
    await expect(canvas).toBeVisible()
  })

  test('can select rotation transformation', async ({ page }) => {
    await page.locator('[data-testid="transform-rotation"]').click()

    // Angle slider should appear
    const angleSlider = page.locator('[data-testid="angle-slider"]')
    await expect(angleSlider).toBeVisible()
  })

  test('rotation angle slider updates matrix', async ({ page }) => {
    await page.locator('[data-testid="transform-rotation"]').click()

    // Get initial matrix display
    const matrixDisplay = page.locator('[data-testid="matrix-display"]')
    const initialText = await matrixDisplay.textContent()

    // Change angle
    const angleSlider = page.locator('[data-testid="angle-slider"]')
    await angleSlider.fill('90')

    // Matrix should show 90° rotation values (0, -1, 1, 0)
    await expect(matrixDisplay).toContainText('0')
    await expect(matrixDisplay).toContainText('-1')
    await expect(matrixDisplay).toContainText('1')
  })

  test('can select scale transformation', async ({ page }) => {
    await page.locator('[data-testid="transform-scale"]').click()

    // Scale sliders should appear
    await expect(page.locator('[data-testid="scale-x-slider"]')).toBeVisible()
    await expect(page.locator('[data-testid="scale-y-slider"]')).toBeVisible()
  })

  test('uniform scale shows single slider', async ({ page }) => {
    await page.locator('[data-testid="transform-uniformScale"]').click()

    // Only X slider should be visible (controls both)
    await expect(page.locator('[data-testid="scale-x-slider"]')).toBeVisible()
    await expect(page.locator('[data-testid="scale-y-slider"]')).not.toBeVisible()
  })

  test('can select shear transformation', async ({ page }) => {
    await page.locator('[data-testid="transform-shearX"]').click()

    // Shear slider should appear
    await expect(page.locator('[data-testid="shear-slider"]')).toBeVisible()
  })

  test('identity shows no parameter controls', async ({ page }) => {
    await page.locator('[data-testid="transform-identity"]').click()

    // No sliders should be visible
    await expect(page.locator('[data-testid="angle-slider"]')).not.toBeVisible()
    await expect(page.locator('[data-testid="scale-x-slider"]')).not.toBeVisible()
    await expect(page.locator('[data-testid="shear-slider"]')).not.toBeVisible()
  })

  test('reflection shows negative determinant badge', async ({ page }) => {
    await page.locator('[data-testid="transform-reflectX"]').click()

    // Should show orientation reversing badge
    const badge = page.locator('[data-testid="badge-orientation-reversing"]')
    await expect(badge).toBeVisible()
  })

  test('preset selector loads preset', async ({ page }) => {
    const presetSelect = page.locator('[data-testid="preset-select"]')
    await presetSelect.selectOption('rotate-90')

    // Should switch to rotation with 90° angle
    await expect(page.locator('[data-testid="transform-rotation"]')).toHaveClass(/bg-primary/)
  })

  test('custom matrix input works', async ({ page }) => {
    // Click edit button
    await page.locator('[data-testid="edit-matrix-btn"]').click()

    // Fill in custom values
    await page.locator('[data-testid="matrix-a-input"]').fill('0')
    await page.locator('[data-testid="matrix-b-input"]').fill('1')
    await page.locator('[data-testid="matrix-c-input"]').fill('-1')
    await page.locator('[data-testid="matrix-d-input"]').fill('0')

    // Apply
    await page.locator('[data-testid="apply-matrix-btn"]').click()

    // Should be in custom mode now
    const matrixDisplay = page.locator('[data-testid="matrix-display"]')
    await expect(matrixDisplay).toBeVisible()
  })

  test('cancel custom matrix edit', async ({ page }) => {
    await page.locator('[data-testid="edit-matrix-btn"]').click()
    await page.locator('[data-testid="cancel-matrix-btn"]').click()

    // Should be back to display mode
    await expect(page.locator('[data-testid="matrix-a-input"]')).not.toBeVisible()
  })
})

test.describe('Matrix Transformations URL Sync @e2e', () => {
  test('rotation angle persists in URL', async ({ page }) => {
    await page.goto(`${BASE}/linear-algebra/matrices`)
    await page.waitForLoadState('networkidle')

    // Select rotation and set angle
    await page.locator('[data-testid="transform-rotation"]').click()
    await page.locator('[data-testid="angle-slider"]').fill('60')

    // Wait for URL update (debounced)
    await page.waitForTimeout(400)

    // Check URL contains angle
    expect(page.url()).toContain('type=rotation')
    expect(page.url()).toContain('angle=60')
  })

  test('loads state from URL', async ({ page }) => {
    // Navigate directly with query params
    await page.goto(`${BASE}/linear-algebra/matrices?type=rotation&angle=45`)
    await page.waitForLoadState('networkidle')

    // Rotation should be selected
    await expect(page.locator('[data-testid="transform-rotation"]')).toHaveClass(/bg-primary/)

    // Angle slider should show 45
    const angleSlider = page.locator('[data-testid="angle-slider"]')
    await expect(angleSlider).toHaveValue('45')
  })
})

test.describe('Linear Algebra Navigation @e2e', () => {
  test('linear algebra index page shows matrices link', async ({ page }) => {
    await page.goto(`${BASE}/linear-algebra`)
    await page.waitForLoadState('networkidle')

    // Should have link to matrices
    const matricesLink = page.locator('a[href*="/linear-algebra/matrices"]')
    await expect(matricesLink).toBeVisible()
  })

  test('can navigate from index to matrices page', async ({ page }) => {
    await page.goto(`${BASE}/linear-algebra`)
    await page.waitForLoadState('networkidle')

    // Click the matrices link
    await page.click('a[href*="/linear-algebra/matrices"]')

    // Should be on matrices page
    await expect(page.locator('h1')).toContainText('Matrices')
  })

  test('matrices page has collapsible sections', async ({ page }) => {
    await page.goto(`${BASE}/linear-algebra/matrices`)
    await page.waitForLoadState('networkidle')

    // Check that main sections exist
    await expect(page.locator('#introduction')).toBeVisible()
    await expect(page.locator('#explorer')).toBeVisible()
  })
})
```

### 2. Update `e2e/accessibility/audit.spec.ts`

Add matrices page to the audit list:

```typescript
// Add to pagesToAudit array:
{ name: 'Matrices', path: `${BASE}/linear-algebra/matrices` },
```

Also add keyboard accessibility tests:

```typescript
// Add to 'Accessibility - Keyboard Navigation @a11y' describe block:

test('Matrix transformation type buttons are keyboard accessible', async ({ page }) => {
  await page.goto(`${BASE}/linear-algebra/matrices`)
  await page.waitForLoadState('networkidle')

  // Tab to reach transformation buttons
  let foundButton = false
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press('Tab')
    const focused = page.locator(':focus')
    const testId = await focused.getAttribute('data-testid')
    if (testId?.startsWith('transform-')) {
      foundButton = true
      break
    }
  }

  expect(foundButton).toBe(true)
})

test('Matrix angle slider is keyboard accessible', async ({ page }) => {
  await page.goto(`${BASE}/linear-algebra/matrices`)
  await page.waitForLoadState('networkidle')

  // Click rotation first to show slider
  await page.locator('[data-testid="transform-rotation"]').click()

  // Tab to reach angle slider
  let foundSlider = false
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press('Tab')
    const focused = page.locator(':focus')
    const testId = await focused.getAttribute('data-testid')
    if (testId === 'angle-slider') {
      foundSlider = true
      break
    }
  }

  expect(foundSlider).toBe(true)
})
```

### 3. Visual/UI Polish Checklist

Review and fix any visual issues:

#### Mobile Responsiveness
- [ ] Widget displays correctly on mobile (375px width)
- [ ] Canvas scales appropriately
- [ ] Transformation buttons wrap nicely
- [ ] Sliders are touch-friendly
- [ ] Matrix display readable on small screens

#### Accessibility
- [ ] All interactive elements have visible focus states
- [ ] Color contrast meets WCAG AA
- [ ] All icons have `aria-hidden="true"`
- [ ] Form inputs have associated labels
- [ ] Sliders have `aria-label` attributes

#### Visual Consistency
- [ ] Colors match design system
- [ ] Spacing consistent with other widgets
- [ ] Typography matches rest of site
- [ ] Borders and backgrounds use theme variables

### 4. Update Widget Index (if not done)

Ensure the widget is properly exported:

```typescript
// src/components/widgets/index.ts
export { MatrixTransformations } from './MatrixTransformations'
```

---

## Testing Commands

```bash
# Run E2E tests for matrices only
npx playwright test matrix-transformations

# Run all E2E tests
npm run test:e2e

# Run accessibility tests
npx playwright test accessibility

# Run with UI for debugging
npx playwright test --ui

# Generate test report
npx playwright show-report
```

---

## Success Criteria

- [ ] All E2E tests pass (14+ tests)
- [ ] Accessibility audit passes for matrices page
- [ ] Keyboard navigation works for all interactive elements
- [ ] Mobile layout works correctly
- [ ] Visual consistency with design system
- [ ] URL sync verified working
- [ ] No console errors in browser
- [ ] ESLint and TypeScript pass
- [ ] Build succeeds

---

## Final Verification

Run the complete test suite:

```bash
# All checks
npm run type-check && npm run lint && npm run test && npm run build

# Start dev server and run E2E
npm run dev &
npm run test:e2e

# Manual verification checklist:
# 1. Navigate to /linear-algebra/matrices
# 2. Try all transformation types
# 3. Test URL sync (change params, refresh)
# 4. Test on mobile viewport
# 5. Test keyboard navigation (Tab through widget)
# 6. Verify all code examples display
# 7. Verify math formulas render
```

---

## Phase 12 Completion Summary

After this increment:

### Files Created
- `src/utils/math/matrix.ts` - Matrix operations (50+ tests)
- `src/utils/math/matrix.test.ts` - Unit tests
- `src/composables/useMatrixTransformations.ts` - State management
- `src/components/widgets/MatrixTransformations/` - 6 component files
- `src/views/linear-algebra/MatricesView.vue` - Content page
- `e2e/linear-algebra/matrix-transformations.spec.ts` - E2E tests

### Files Updated
- `src/types/math.ts` - Matrix2x2, TransformationType, TransformationPreset
- `src/router/index.ts` - Matrices route
- `src/data/navigation.ts` - Matrices subtopic
- `src/components/widgets/index.ts` - Export
- `e2e/accessibility/audit.spec.ts` - Matrices page audit

### Test Coverage
- Unit tests: 50+ for matrix utilities
- E2E tests: 14+ for widget functionality
- Accessibility: WCAG 2.1 AA audit

### Documentation to Update
After completion, update:
- `docs/current_state.md` - Phase 12 complete
- `docs/ll_li.md` - Lessons learned
- `docs/decisions.md` - Architectural decisions (D-096 to D-100)
- `docs/ROADMAP_V3.md` (or V4) - Phase 12 marked complete
