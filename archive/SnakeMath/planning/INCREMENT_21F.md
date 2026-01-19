# Increment 21F: E2E Tests & Polish

**Parent Plan**: [PHASE_21_PLAN.md](./PHASE_21_PLAN.md)
**Depends On**: [INCREMENT_21E.md](./INCREMENT_21E.md)
**Focus**: End-to-end tests, accessibility audits, and final polish

---

## Overview

This increment completes Phase 21 by adding comprehensive E2E tests using Playwright, running accessibility audits, and performing final polish to ensure everything works correctly.

---

## Tasks

### Task 1: Create Integration Explorer E2E Tests

**File**: `e2e/widgets/integration-explorer.spec.ts` (new)

```ts
import { test, expect } from '@playwright/test'

test.describe('IntegrationExplorer Widget', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calculus/integration')
    // Wait for widget to load
    await page.waitForSelector('[data-testid="integration-explorer"]', { timeout: 10000 })
  })

  test.describe('Initial State', () => {
    test('renders with default preset (quadratic)', async ({ page }) => {
      // Check function selector shows quadratic
      const selector = page.locator('#function-select')
      await expect(selector).toHaveValue('quadratic')

      // Check formula is displayed
      await expect(page.locator('text=f(x) = x²')).toBeVisible()
    })

    test('displays default bounds', async ({ page }) => {
      const lowerBound = page.locator('#lower-bound')
      const upperBound = page.locator('#upper-bound')

      await expect(lowerBound).toHaveValue('0')
      await expect(upperBound).toHaveValue('2')
    })

    test('displays default subdivisions', async ({ page }) => {
      const subdivisions = page.locator('#subdivisions')
      await expect(subdivisions).toHaveValue('10')
    })

    test('shows approximation and exact values', async ({ page }) => {
      // Should show approximation close to 2.667
      await expect(page.locator('text=Approximation')).toBeVisible()
      await expect(page.locator('text=Exact Value')).toBeVisible()
    })
  })

  test.describe('Preset Selection', () => {
    test('changes function when preset selected', async ({ page }) => {
      const selector = page.locator('#function-select')

      await selector.selectOption('sine')

      // Formula should update
      await expect(page.locator('text=sin(x)')).toBeVisible()

      // Bounds should update to sine defaults
      const upperBound = page.locator('#upper-bound')
      // π ≈ 3.14159
      const value = await upperBound.inputValue()
      expect(parseFloat(value)).toBeCloseTo(Math.PI, 1)
    })

    test('all presets are selectable', async ({ page }) => {
      const presets = ['linear', 'quadratic', 'sine', 'exponential', 'reciprocal', 'cubic-signed', 'semicircle', 'constant']
      const selector = page.locator('#function-select')

      for (const preset of presets) {
        await selector.selectOption(preset)
        await expect(selector).toHaveValue(preset)
      }
    })
  })

  test.describe('Bounds Controls', () => {
    test('updates visualization when lower bound changes', async ({ page }) => {
      const lowerBound = page.locator('#lower-bound')

      await lowerBound.fill('1')
      await lowerBound.blur()

      // Wait for recalculation
      await page.waitForTimeout(100)

      // Approximation should change (1 to 2 gives different result than 0 to 2)
      const approx = page.locator('.font-mono').first()
      await expect(approx).not.toHaveText('2.6667')
    })

    test('shows error for invalid bounds (a >= b)', async ({ page }) => {
      const lowerBound = page.locator('#lower-bound')

      await lowerBound.fill('5')
      await lowerBound.blur()

      // Error message should appear
      await expect(page.locator('text=Lower bound must be less than upper bound')).toBeVisible()
    })

    test('subdivisions slider updates value', async ({ page }) => {
      const slider = page.locator('#subdivisions-slider')
      const input = page.locator('#subdivisions')

      // Drag slider or set value
      await slider.fill('50')

      // Input should reflect new value
      await expect(input).toHaveValue('50')
    })

    test('subdivisions input clamps to valid range', async ({ page }) => {
      const input = page.locator('#subdivisions')

      // Try to set beyond max
      await input.fill('500')
      await input.blur()

      // Should be clamped to 200
      await expect(input).toHaveValue('200')

      // Try to set below min
      await input.fill('0')
      await input.blur()

      // Should be clamped to 1
      await expect(input).toHaveValue('1')
    })
  })

  test.describe('Method Selection', () => {
    test('changes method when button clicked', async ({ page }) => {
      // Click on Left method
      await page.locator('text=Left').click()

      // Method description should update
      await expect(page.locator('text=Sample at left endpoint')).toBeVisible()
    })

    test('all methods are selectable', async ({ page }) => {
      const methods = ['Left', 'Right', 'Midpoint', 'Trapezoidal', "Simpson's"]

      for (const method of methods) {
        await page.locator(`label:has-text("${method}")`).click()

        // Should be selected (has primary background)
        const label = page.locator(`label:has-text("${method}")`)
        await expect(label).toHaveClass(/bg-primary/)
      }
    })

    test('different methods produce different approximations', async ({ page }) => {
      // Get midpoint approximation
      await page.locator('text=Midpoint').click()
      const midpointApprox = await page.locator('.text-lg.font-mono.font-semibold.text-primary').textContent()

      // Get left approximation
      await page.locator('text=Left').click()
      await page.waitForTimeout(100)
      const leftApprox = await page.locator('.text-lg.font-mono.font-semibold.text-primary').textContent()

      // They should be different
      expect(midpointApprox).not.toBe(leftApprox)
    })
  })

  test.describe('SVG Canvas', () => {
    test('renders function curve', async ({ page }) => {
      const curve = page.locator('svg path.stroke-primary')
      await expect(curve).toBeVisible()
    })

    test('renders Riemann rectangles', async ({ page }) => {
      const rectangles = page.locator('svg rect.fill-blue-500\\/40, svg rect.fill-red-500\\/40')
      const count = await rectangles.count()
      expect(count).toBeGreaterThan(0)
    })

    test('shows bound markers', async ({ page }) => {
      // Look for dashed amber lines (bound markers)
      const boundLines = page.locator('svg line.stroke-amber-500')
      await expect(boundLines.first()).toBeVisible()
    })
  })

  test.describe('Results Display', () => {
    test('shows approximation, exact, and error', async ({ page }) => {
      await expect(page.locator('text=Approximation')).toBeVisible()
      await expect(page.locator('text=Exact Value')).toBeVisible()
      await expect(page.locator('text=Abs. Error')).toBeVisible()
      await expect(page.locator('text=Rel. Error')).toBeVisible()
    })

    test('error decreases as n increases', async ({ page }) => {
      // Get error at n=10
      const nInput = page.locator('#subdivisions')
      await nInput.fill('10')
      await nInput.blur()
      await page.waitForTimeout(100)

      const errorText10 = await page.locator('text=Rel. Error').locator('..').locator('.font-mono').textContent()
      const error10 = parseFloat(errorText10?.replace('%', '') ?? '100')

      // Get error at n=100
      await nInput.fill('100')
      await nInput.blur()
      await page.waitForTimeout(100)

      const errorText100 = await page.locator('text=Rel. Error').locator('..').locator('.font-mono').textContent()
      const error100 = parseFloat(errorText100?.replace('%', '') ?? '100')

      // Error at n=100 should be significantly less than at n=10
      expect(error100).toBeLessThan(error10 / 2)
    })
  })

  test.describe('Convergence Animation', () => {
    test('animation panel is collapsible', async ({ page }) => {
      // Find and expand the animation panel
      const panelHeader = page.locator('text=Convergence Animation').first()
      await panelHeader.click()

      // Play button should be visible
      await expect(page.locator('button:has-text("Play")')).toBeVisible()
    })

    test('reset button returns n to starting value', async ({ page }) => {
      // Expand animation panel
      await page.locator('text=Convergence Animation').first().click()

      // Set n to a high value
      const nInput = page.locator('#subdivisions')
      await nInput.fill('100')
      await nInput.blur()

      // Click reset
      await page.locator('button:has-text("Reset")').click()

      // n should be back to starting value (4)
      await expect(nInput).toHaveValue('4')
    })
  })

  test.describe('URL State Sync', () => {
    test('preset in URL is loaded', async ({ page }) => {
      await page.goto('/calculus/integration?preset=sine')

      const selector = page.locator('#function-select')
      await expect(selector).toHaveValue('sine')
    })

    test('bounds in URL are loaded', async ({ page }) => {
      await page.goto('/calculus/integration?preset=quadratic&a=1&b=3')

      const lowerBound = page.locator('#lower-bound')
      const upperBound = page.locator('#upper-bound')

      await expect(lowerBound).toHaveValue('1')
      await expect(upperBound).toHaveValue('3')
    })

    test('method in URL is loaded', async ({ page }) => {
      await page.goto('/calculus/integration?method=trapezoidal')

      const label = page.locator('label:has-text("Trapezoidal")')
      await expect(label).toHaveClass(/bg-primary/)
    })

    test('changing preset updates URL', async ({ page }) => {
      await page.locator('#function-select').selectOption('exponential')

      // Wait for URL update (debounced)
      await page.waitForTimeout(500)

      const url = page.url()
      expect(url).toContain('preset=exponential')
    })
  })
})
```

---

### Task 2: Create Accessibility Tests

**File**: `e2e/accessibility/integration.spec.ts` (new)

```ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Integration Page Accessibility', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/calculus/integration')

    // Wait for content to load
    await page.waitForSelector('h1')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('widget controls are keyboard accessible', async ({ page }) => {
    await page.goto('/calculus/integration')

    // Tab to function selector
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Should be able to change selection with keyboard
    const selector = page.locator('#function-select')
    await selector.focus()
    await page.keyboard.press('ArrowDown')

    // Value should change
    const value = await selector.inputValue()
    expect(value).toBeDefined()
  })

  test('form inputs have associated labels', async ({ page }) => {
    await page.goto('/calculus/integration')

    // Check that inputs have labels
    const lowerBoundLabel = page.locator('label[for="lower-bound"]')
    const upperBoundLabel = page.locator('label[for="upper-bound"]')
    const subdivisionsLabel = page.locator('label[for="subdivisions"]')

    await expect(lowerBoundLabel).toBeVisible()
    await expect(upperBoundLabel).toBeVisible()
    await expect(subdivisionsLabel).toBeVisible()
  })

  test('SVG canvas has aria-label', async ({ page }) => {
    await page.goto('/calculus/integration')

    const svg = page.locator('svg[role="img"]')
    await expect(svg).toHaveAttribute('aria-label')
  })

  test('color is not the only indicator', async ({ page }) => {
    await page.goto('/calculus/integration')

    // Legend should have text labels, not just colors
    await expect(page.locator('text=Positive area')).toBeVisible()
    await expect(page.locator('text=Negative area')).toBeVisible()
  })
})
```

---

### Task 3: Add Data Test IDs

**File**: `src/components/widgets/IntegrationExplorer/IntegrationExplorer.vue` (update)

Add a data-testid to the root element for E2E test targeting:

```vue
<template>
  <div
    data-testid="integration-explorer"
    class="space-y-4 p-4 rounded-lg border border-border bg-surface"
  >
    <!-- rest of template -->
  </div>
</template>
```

---

### Task 4: Run and Fix Linting/Type Errors

Run the following commands and fix any issues:

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Unit tests
npm run test

# Build
npm run build
```

Common issues to watch for (from LL_LI.md):

- **LL-068**: Ensure all computed properties have explicit returns (add default cases to switch statements)
- **LL-069**: Use `as _name` for unused imports
- **LL-070**: Use `&lt;` and `&gt;` for `<` and `>` in template text

---

### Task 5: Visual QA Checklist

Perform manual visual QA in both light and dark modes:

**Light Mode**:
- [ ] Widget background is correct (white/light)
- [ ] Borders are visible
- [ ] Text is readable
- [ ] Riemann rectangles visible (blue/red)
- [ ] Function curve is primary color
- [ ] Error boxes use correct amber styling

**Dark Mode**:
- [ ] Widget background is dark
- [ ] Borders are visible (not too dark)
- [ ] Text is readable (light text on dark)
- [ ] Riemann rectangles visible with correct opacity
- [ ] All color variants have `dark:` classes

**Responsive**:
- [ ] Widget renders correctly at 320px width
- [ ] Controls wrap appropriately
- [ ] SVG canvas scales properly
- [ ] Method buttons wrap on small screens

---

### Task 6: Final Documentation Updates

**File**: `docs/CURRENT_STATE.md` (update)

Add Phase 21 completion:

```markdown
## Calculus Section

- **Limits** ✅ (Phase 13)
- **Derivatives** ✅ (Phase 14)
- **Integration** ✅ (Phase 21) — NEW
```

**File**: `docs/ROADMAP.md` (update)

Mark Phase 21 as complete:

```markdown
### Phase 21: Integration ✅
- IntegrationExplorer widget
- Riemann sum visualization (5 methods)
- Convergence animation
- Content page with FTC explanation
```

**File**: `docs/DECISIONS.md` (update)

Add Phase 21 decisions:

```markdown
## Phase 21: Integration

| ID | Decision | Rationale |
|----|----------|-----------|
| D-120 | Widget name: IntegrationExplorer | Consistent with LimitsExplorer and DerivativeVisualizer |
| D-121 | Single view with collapsible panels | Matches existing widget patterns |
| D-122 | Preset-based functions only | Safety and teachability |
| D-123 | Include Simpson's rule | Shows O(1/n⁴) convergence importance |
| D-124 | Blue/red for signed area | Standard convention |
| D-125 | Smooth n increment animation | Better UX for convergence demo |
| D-126 | Geometric interpretation focus | Consistent with D-112 |
| D-127 | URL state sync | Shareable configurations |
```

---

## File Checklist

| File | Action | Status |
|------|--------|--------|
| `e2e/widgets/integration-explorer.spec.ts` | Create new | ⬜ |
| `e2e/accessibility/integration.spec.ts` | Create new | ⬜ |
| `src/components/widgets/IntegrationExplorer/IntegrationExplorer.vue` | Add data-testid | ⬜ |
| Fix any lint/type errors | Various files | ⬜ |
| `docs/CURRENT_STATE.md` | Update | ⬜ |
| `docs/ROADMAP.md` | Update | ⬜ |
| `docs/DECISIONS.md` | Update | ⬜ |

---

## Success Criteria

- [ ] All E2E tests pass (`npm run test:e2e`)
- [ ] Accessibility audit passes (no WCAG 2.1 AA violations)
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes
- [ ] `npm run test` passes (all unit tests)
- [ ] `npm run build` succeeds
- [ ] Visual QA passes in light and dark mode
- [ ] Documentation updated

---

## Testing Commands

```bash
# Run all E2E tests
npm run test:e2e

# Run only integration tests
npm run test:e2e -- --grep "Integration"

# Run accessibility tests only
npm run test:e2e -- e2e/accessibility/integration.spec.ts

# Run with headed browser (see what's happening)
npm run test:e2e -- --headed

# Full verification
npm run type-check && npm run lint && npm run test && npm run build
```

---

## Phase Completion Checklist

Before marking Phase 21 complete:

- [ ] All increment files completed (21A through 21F)
- [ ] All unit tests pass (70+ for integration utilities)
- [ ] All E2E tests pass
- [ ] Accessibility audit passes
- [ ] Build succeeds
- [ ] Visual QA in both themes
- [ ] Documentation updated (CURRENT_STATE, ROADMAP, DECISIONS)
- [ ] Widget accessible at `/calculus/integration`
- [ ] URL state sync works
- [ ] Animation panel works

---

## Notes

- E2E tests may need adjustment based on actual DOM structure
- Some tests use `page.waitForTimeout()` which isn't ideal but helps with reactivity timing
- Accessibility tests use `@axe-core/playwright` which should already be installed
- If tests fail on CI but pass locally, check for timing issues
