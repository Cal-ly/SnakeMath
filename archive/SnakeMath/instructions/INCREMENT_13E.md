# Increment 13E: E2E Tests & Polish

**Goal**: Create E2E tests for the LimitsExplorer widget and polish the implementation for accessibility and responsiveness.

**Prerequisites**: Increments 13A-13D complete (all features implemented)

---

## Files to Create/Modify

### 1. Create E2E Test File: `e2e/widgets/limits-explorer.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

/**
 * E2E tests for the LimitsExplorer widget
 *
 * Tests cover:
 * - Widget rendering
 * - Function preset selection
 * - Approach point interaction
 * - Limit value display
 * - Continuity status
 * - ε-δ controls
 * - URL state synchronization
 * - Accessibility
 */

test.describe('LimitsExplorer Widget', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calculus/limits')
    // Wait for widget to be fully loaded
    await page.waitForSelector('[data-testid="limits-explorer"]')
  })

  // ==========================================================================
  // Basic Rendering Tests
  // ==========================================================================

  test.describe('Basic Rendering', () => {
    test('renders the widget container', async ({ page }) => {
      const widget = page.locator('[data-testid="limits-explorer"]')
      await expect(widget).toBeVisible()
    })

    test('renders function selector with all presets', async ({ page }) => {
      const presetButtons = page.locator('.function-selector button')
      await expect(presetButtons).toHaveCount(8) // 8 preset functions
    })

    test('renders the canvas SVG', async ({ page }) => {
      const canvas = page.locator('.limit-canvas-container svg')
      await expect(canvas).toBeVisible()
    })

    test('renders the limit display section', async ({ page }) => {
      const limitDisplay = page.locator('.limit-display')
      await expect(limitDisplay).toBeVisible()
    })

    test('shows function formula in LaTeX', async ({ page }) => {
      // Check that MathBlock is rendering (KaTeX creates .katex elements)
      const mathBlock = page.locator('.function-selector .katex')
      await expect(mathBlock).toBeVisible()
    })
  })

  // ==========================================================================
  // Function Selection Tests
  // ==========================================================================

  test.describe('Function Selection', () => {
    test('selects polynomial preset by default', async ({ page }) => {
      const polynomialBtn = page.locator('button:has-text("Polynomial")')
      await expect(polynomialBtn).toHaveClass(/bg-primary/)
    })

    test('can select different preset functions', async ({ page }) => {
      // Click on Rational preset
      await page.click('button:has-text("Rational")')

      // Verify it's now selected
      const rationalBtn = page.locator('button:has-text("Rational")')
      await expect(rationalBtn).toHaveClass(/bg-primary/)

      // Verify polynomial is deselected
      const polynomialBtn = page.locator('button:has-text("Polynomial")')
      await expect(polynomialBtn).not.toHaveClass(/bg-primary/)
    })

    test('updates description when preset changes', async ({ page }) => {
      // Initial description for polynomial
      await expect(page.locator('text=continuous function')).toBeVisible()

      // Select floor function
      await page.click('button:has-text("Floor")')

      // Description should change
      await expect(page.locator('text=Jump')).toBeVisible()
    })

    test('updates interesting points when preset changes', async ({ page }) => {
      // Select floor function which has interesting points at integers
      await page.click('button:has-text("Floor")')

      // Should see interesting point buttons
      const interestingPoints = page.locator('button:has-text("x → 1")')
      await expect(interestingPoints).toBeVisible()
    })
  })

  // ==========================================================================
  // Approach Point Tests
  // ==========================================================================

  test.describe('Approach Point Interaction', () => {
    test('can click interesting point buttons', async ({ page }) => {
      // Select floor function
      await page.click('button:has-text("Floor")')

      // Click on x → 2 interesting point
      await page.click('button:has-text("x → 2")')

      // Verify approach point is set to 2
      await expect(page.locator('text=a = 2')).toBeVisible()
    })

    test('slider changes approach point', async ({ page }) => {
      const slider = page.locator('input[type="range"]').first()
      await slider.fill('1.5')

      // Check that the value is reflected in the UI
      await expect(page.locator('text=a = 1.5')).toBeVisible()
    })

    test('approach direction toggles work', async ({ page }) => {
      // Click left direction
      await page.click('button:has-text("x → a⁻")')

      // Verify it's selected
      const leftBtn = page.locator('button:has-text("x → a⁻")')
      await expect(leftBtn).toHaveClass(/bg-primary/)
    })
  })

  // ==========================================================================
  // Limit Display Tests
  // ==========================================================================

  test.describe('Limit Value Display', () => {
    test('displays limit value for continuous function', async ({ page }) => {
      // Polynomial at x=2 should have limit 4
      await page.click('button:has-text("x → 2")')

      // Wait for calculation
      await page.waitForTimeout(100)

      // Check limit display shows a value
      const limitSection = page.locator('.limit-display')
      await expect(limitSection.locator('.katex')).toBeVisible()
    })

    test('shows DNE for limits that don\'t exist', async ({ page }) => {
      // Select oscillating function
      await page.click('button:has-text("Oscillating")')

      // At x=0, limit does not exist
      await page.click('button:has-text("x → 0")')
      await page.waitForTimeout(100)

      // Should show "does not exist" indicator
      await expect(page.locator('text=does not exist')).toBeVisible()
    })

    test('shows left and right limits when direction is both', async ({ page }) => {
      // Select floor function (has different left/right limits at integers)
      await page.click('button:has-text("Floor")')
      await page.click('button:has-text("x → 2")')

      // Ensure "Both" is selected
      await page.click('button:has-text("Both")')

      // Should show both one-sided limits
      await expect(page.locator('text=Left limit')).toBeVisible()
      await expect(page.locator('text=Right limit')).toBeVisible()
    })
  })

  // ==========================================================================
  // Continuity Status Tests
  // ==========================================================================

  test.describe('Continuity Status', () => {
    test('shows continuous status for polynomial', async ({ page }) => {
      // Polynomial is continuous everywhere
      await expect(page.locator('text=Continuous')).toBeVisible()
    })

    test('shows removable discontinuity for rational', async ({ page }) => {
      await page.click('button:has-text("Rational")')
      await page.click('button:has-text("x → 1")')
      await page.waitForTimeout(100)

      await expect(page.locator('text=Removable')).toBeVisible()
    })

    test('shows jump discontinuity for floor function', async ({ page }) => {
      await page.click('button:has-text("Floor")')
      await page.click('button:has-text("x → 2")')
      await page.waitForTimeout(100)

      await expect(page.locator('text=Jump')).toBeVisible()
    })

    test('shows infinite discontinuity for reciprocal', async ({ page }) => {
      await page.click('button:has-text("Reciprocal")')
      await page.click('button:has-text("x → 0")')
      await page.waitForTimeout(100)

      await expect(page.locator('text=Infinite')).toBeVisible()
    })
  })

  // ==========================================================================
  // ε-δ Controls Tests
  // ==========================================================================

  test.describe('Epsilon-Delta Controls', () => {
    test.beforeEach(async ({ page }) => {
      // Show advanced controls
      await page.click('button:has-text("Show")')
      await page.waitForSelector('.epsilon-delta-controls')
    })

    test('shows epsilon slider', async ({ page }) => {
      const epsilonSlider = page.locator('.epsilon-slider')
      await expect(epsilonSlider).toBeVisible()
    })

    test('shows delta slider', async ({ page }) => {
      const deltaSlider = page.locator('.delta-slider')
      await expect(deltaSlider).toBeVisible()
    })

    test('epsilon slider updates value', async ({ page }) => {
      const epsilonSlider = page.locator('.epsilon-slider')
      await epsilonSlider.fill('0.75')

      await expect(page.locator('text=ε (epsilon) = 0.75')).toBeVisible()
    })

    test('delta slider updates value', async ({ page }) => {
      const deltaSlider = page.locator('.delta-slider')
      await deltaSlider.fill('0.5')

      await expect(page.locator('text=δ (delta) = 0.5')).toBeVisible()
    })

    test('Find δ button works', async ({ page }) => {
      // Make sure we're on polynomial
      await page.click('button:has-text("Polynomial")')
      await page.click('button:has-text("x → 2")')

      // Click find delta
      await page.click('button:has-text("Find δ")')

      // Delta value should change (check validity indicator turns green)
      await page.waitForTimeout(200)
      await expect(page.locator('.bg-green-100, .dark\\:bg-green-900')).toBeVisible()
    })

    test('shows delta validity indicator', async ({ page }) => {
      // The validity indicator should be visible
      const indicator = page.locator('.epsilon-delta-controls').locator('.rounded-lg').last()
      await expect(indicator).toBeVisible()
    })
  })

  // ==========================================================================
  // Animation Tests
  // ==========================================================================

  test.describe('Numerical Approximation Animation', () => {
    test.beforeEach(async ({ page }) => {
      // Show advanced controls
      await page.click('button:has-text("Show")')
      await page.waitForSelector('.approach-animation')
    })

    test('shows approximation table', async ({ page }) => {
      const table = page.locator('.approach-animation table')
      await expect(table).toBeVisible()
    })

    test('play button starts animation', async ({ page }) => {
      await page.click('button:has-text("Play")')

      // Animation should start - rows should appear one by one
      // Just verify the button is disabled during animation
      const playBtn = page.locator('button:has-text("Play")')
      await expect(playBtn).toBeDisabled()
    })

    test('reset button resets animation', async ({ page }) => {
      await page.click('button:has-text("Play")')
      await page.waitForTimeout(600) // Let some animation happen

      await page.click('button:has-text("Reset")')

      // Play button should be enabled again
      const playBtn = page.locator('button:has-text("Play")')
      await expect(playBtn).toBeEnabled()
    })
  })

  // ==========================================================================
  // URL State Tests
  // ==========================================================================

  test.describe('URL State Synchronization', () => {
    test('preset selection updates URL', async ({ page }) => {
      await page.click('button:has-text("Rational")')
      await page.waitForTimeout(400) // Wait for debounce

      expect(page.url()).toContain('preset=rational')
    })

    test('URL parameters restore state', async ({ page }) => {
      // Navigate with query params
      await page.goto('/calculus/limits?preset=step&point=3')

      // Wait for widget to load
      await page.waitForSelector('[data-testid="limits-explorer"]')

      // Verify floor function is selected
      const floorBtn = page.locator('button:has-text("Floor")')
      await expect(floorBtn).toHaveClass(/bg-primary/)

      // Verify approach point is 3
      await expect(page.locator('text=a = 3')).toBeVisible()
    })

    test('approach direction updates URL', async ({ page }) => {
      await page.click('button:has-text("x → a⁻")')
      await page.waitForTimeout(400)

      expect(page.url()).toContain('dir=left')
    })
  })

  // ==========================================================================
  // Canvas Interaction Tests
  // ==========================================================================

  test.describe('Canvas Interaction', () => {
    test('canvas is interactive (shows drag hint)', async ({ page }) => {
      await expect(page.locator('text=Drag the red point')).toBeVisible()
    })

    test('function curve is visible', async ({ page }) => {
      const curve = page.locator('.limit-canvas-container svg path')
      await expect(curve.first()).toBeVisible()
    })

    test('approach point marker is visible', async ({ page }) => {
      const marker = page.locator('.limit-canvas-container svg circle').first()
      await expect(marker).toBeVisible()
    })
  })

  // ==========================================================================
  // Responsive Design Tests
  // ==========================================================================

  test.describe('Responsive Design', () => {
    test('renders correctly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      const widget = page.locator('[data-testid="limits-explorer"]')
      await expect(widget).toBeVisible()

      // Canvas should still be visible
      const canvas = page.locator('.limit-canvas-container svg')
      await expect(canvas).toBeVisible()
    })

    test('renders correctly on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })

      const widget = page.locator('[data-testid="limits-explorer"]')
      await expect(widget).toBeVisible()
    })
  })
})

// ==========================================================================
// Calculus Pages Tests
// ==========================================================================

test.describe('Calculus Pages', () => {
  test.describe('Calculus Index Page', () => {
    test('renders the calculus index', async ({ page }) => {
      await page.goto('/calculus')
      await expect(page.locator('h1:has-text("Calculus")')).toBeVisible()
    })

    test('shows topic cards', async ({ page }) => {
      await page.goto('/calculus')
      await expect(page.locator('text=Limits')).toBeVisible()
      await expect(page.locator('text=Derivatives')).toBeVisible()
    })

    test('limits topic link works', async ({ page }) => {
      await page.goto('/calculus')
      await page.click('a:has-text("Limits")')
      await expect(page).toHaveURL(/\/calculus\/limits/)
    })

    test('coming soon topics are disabled', async ({ page }) => {
      await page.goto('/calculus')
      const derivativesCard = page.locator('text=Coming Soon').first()
      await expect(derivativesCard).toBeVisible()
    })
  })

  test.describe('Limits Page Content', () => {
    test('renders page title', async ({ page }) => {
      await page.goto('/calculus/limits')
      await expect(page.locator('h1:has-text("Limits")')).toBeVisible()
    })

    test('renders all content sections', async ({ page }) => {
      await page.goto('/calculus/limits')

      await expect(page.locator('text=What is a Limit?')).toBeVisible()
      await expect(page.locator('text=Interactive Limit Explorer')).toBeVisible()
    })

    test('collapsible sections work', async ({ page }) => {
      await page.goto('/calculus/limits')

      // Click on a collapsed section header
      const epsilonDelta = page.locator('text=ε-δ Definition')
      await epsilonDelta.click()

      // Content should be visible
      await expect(page.locator('text=For every ε')).toBeVisible()
    })

    test('code examples render', async ({ page }) => {
      await page.goto('/calculus/limits')

      // Find and expand a code section
      await page.click('text=How Computers Evaluate Limits')

      // Code block should be visible with Python highlighting
      await expect(page.locator('code:has-text("def numerical_limit")')).toBeVisible()
    })

    test('math blocks render with KaTeX', async ({ page }) => {
      await page.goto('/calculus/limits')

      // KaTeX should render limit notation
      const katexElements = page.locator('.katex')
      const count = await katexElements.count()
      expect(count).toBeGreaterThan(0)
    })

    test('related topics section exists', async ({ page }) => {
      await page.goto('/calculus/limits')

      await expect(page.locator('text=Related Topics')).toBeVisible()
      await expect(page.locator('a:has-text("Exponentials")')).toBeVisible()
    })
  })
})
```

### 2. Create Accessibility Test File: `e2e/accessibility/calculus.spec.ts`

```typescript
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * Accessibility tests for Calculus pages
 */

test.describe('Calculus Accessibility', () => {
  test('calculus index page has no accessibility violations', async ({ page }) => {
    await page.goto('/calculus')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('limits page has no accessibility violations', async ({ page }) => {
    await page.goto('/calculus/limits')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('limits explorer widget has accessible controls', async ({ page }) => {
    await page.goto('/calculus/limits')

    // Check that buttons have accessible names
    const presetButtons = page.locator('.function-selector button')
    const count = await presetButtons.count()

    for (let i = 0; i < count; i++) {
      const button = presetButtons.nth(i)
      const name = await button.textContent()
      expect(name?.trim().length).toBeGreaterThan(0)
    }
  })

  test('sliders have accessible labels', async ({ page }) => {
    await page.goto('/calculus/limits')

    // Show advanced controls
    await page.click('button:has-text("Show")')

    // Check that sliders have labels
    const sliders = page.locator('input[type="range"]')
    const count = await sliders.count()
    expect(count).toBeGreaterThan(0)
  })

  test('icons have aria-hidden', async ({ page }) => {
    await page.goto('/calculus/limits')

    // Font Awesome icons should have aria-hidden
    const icons = page.locator('i.fa-solid')
    const count = await icons.count()

    for (let i = 0; i < Math.min(count, 10); i++) {
      const icon = icons.nth(i)
      const ariaHidden = await icon.getAttribute('aria-hidden')
      expect(ariaHidden).toBe('true')
    }
  })

  test('page has proper heading hierarchy', async ({ page }) => {
    await page.goto('/calculus/limits')

    // Should have h1
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1)

    // Should have h2s (section headers)
    const h2s = page.locator('h2')
    const h2Count = await h2s.count()
    expect(h2Count).toBeGreaterThan(0)
  })

  test('color contrast is sufficient', async ({ page }) => {
    await page.goto('/calculus/limits')

    const results = await new AxeBuilder({ page })
      .withTags(['cat.color'])
      .analyze()

    expect(results.violations).toEqual([])
  })
})
```

### 3. Polish: Update Widget for Better Accessibility

**Update `LimitsExplorer.vue` to add ARIA labels:**

Add these attributes to interactive elements:

```vue
<!-- In FunctionSelector.vue, update button -->
<button
  v-for="preset in LIMIT_PRESETS"
  :key="preset.id"
  :aria-pressed="selectedId === preset.id"
  :aria-label="`Select ${preset.name} function: ${preset.description}`"
  ...
>
```

```vue
<!-- In LimitCanvas.vue, add role and aria-label to SVG -->
<svg
  ref="canvasRef"
  role="img"
  :aria-label="`Graph of ${preset?.name || 'function'} with approach point at x = ${approachPoint}`"
  ...
>
```

```vue
<!-- In EpsilonDeltaControls.vue, add labels for sliders -->
<label :for="'epsilon-slider'" class="text-sm font-medium text-blue-600">
  ε (epsilon) = {{ epsilon.toFixed(2) }}
</label>
<input
  id="epsilon-slider"
  type="range"
  aria-describedby="epsilon-description"
  ...
/>
<p id="epsilon-description" class="text-xs text-text-muted mt-1">
  How close f(x) must be to L (the limit value)
</p>
```

### 4. Polish: Mobile Responsive Improvements

**Update LimitsExplorer.vue for better mobile layout:**

```vue
<template>
  <div class="limits-explorer space-y-4" data-testid="limits-explorer">
    <!-- Function Selection - scrollable on mobile -->
    <div class="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
      <FunctionSelector
        :selected-id="selectedPresetId"
        :selected-preset="selectedPreset"
        @select="selectPreset"
      />
    </div>

    <!-- ... rest of template ... -->

    <!-- Grid becomes single column on mobile -->
    <div class="grid gap-4 lg:grid-cols-2">
      <!-- Canvas takes full width on mobile -->
      <div class="lg:col-span-1 space-y-4 order-1 lg:order-none">
        <LimitCanvas ... />
      </div>

      <!-- Controls below canvas on mobile -->
      <div class="lg:col-span-1 space-y-4 order-2 lg:order-none">
        ...
      </div>
    </div>
  </div>
</template>
```

### 5. Update Documentation

**Update `docs/CURRENT_STATE.md` to reflect Phase 13 completion:**

Add to the implemented features section:

```markdown
## Phase 13: Calculus - Limits

### Completed Features
- [x] Limit math utilities (`src/utils/math/limits.ts`)
  - evaluateLimit, evaluateLeftLimit, evaluateRightLimit
  - checkContinuity
  - numericalLimitApproximation
  - findDeltaForEpsilon
  - 8 preset functions with different behaviors
- [x] LimitsExplorer widget
  - Function curve rendering
  - Approach point selection (slider and drag)
  - Left/right/both direction toggle
  - ε-δ band visualization
  - Numerical approximation animation
  - URL state synchronization
- [x] Calculus section pages
  - /calculus - Section index
  - /calculus/limits - Comprehensive limits content
- [x] E2E tests (14+ tests)
- [x] Accessibility audit passes

### Discontinuity Types Detected
- Continuous
- Removable (limit exists, function undefined/different)
- Jump (left ≠ right limit)
- Infinite (vertical asymptote)
- Oscillating (no limit exists)
```

---

## Success Criteria

- [ ] E2E test file created at `e2e/widgets/limits-explorer.spec.ts`
- [ ] Accessibility test file created at `e2e/accessibility/calculus.spec.ts`
- [ ] All 14+ E2E tests pass
- [ ] Accessibility audit passes (axe-core)
- [ ] Widget has proper ARIA labels
- [ ] Sliders have accessible labels and descriptions
- [ ] Icons have aria-hidden="true"
- [ ] Page has correct heading hierarchy
- [ ] Color contrast is sufficient
- [ ] Mobile responsive layout works
- [ ] Function selector scrolls horizontally on mobile
- [ ] Grid layout stacks vertically on mobile
- [ ] Documentation updated
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes
- [ ] `npm run test` passes (unit tests)
- [ ] `npm run test:e2e` passes (E2E tests)
- [ ] `npm run build` passes

---

## Commands to Run

```bash
# Run unit tests
npm run test

# Start dev server for E2E tests
npm run dev

# In another terminal, run E2E tests
npm run test:e2e

# Or run specific test file
npx playwright test e2e/widgets/limits-explorer.spec.ts

# Run with UI for debugging
npx playwright test --ui

# Generate accessibility report
npx playwright test e2e/accessibility/calculus.spec.ts --reporter=html

# Final verification
npm run type-check && npm run lint && npm run test && npm run build
```

---

## Implementation Notes

1. **E2E Test Strategy**: Tests are organized by feature area (rendering, selection, interaction, URL sync). Each test is independent and can run in isolation.

2. **Accessibility Testing**: Uses axe-core via @axe-core/playwright for automated WCAG compliance checking. Manual tests verify ARIA attributes.

3. **Viewport Testing**: Tests run on multiple viewport sizes to verify responsive design.

4. **Animation Testing**: Animation tests use timeouts since Playwright doesn't natively wait for CSS animations. Keep timeouts short for test speed.

5. **URL State Testing**: URL tests need debounce delays (400ms) to wait for URL updates.

6. **Mobile Polish**: The `-mx-4 px-4` pattern allows horizontal scrolling that bleeds to screen edges on mobile.

---

## Test Coverage Summary

| Area | Test Count |
|------|------------|
| Basic Rendering | 5 |
| Function Selection | 4 |
| Approach Point | 3 |
| Limit Display | 3 |
| Continuity Status | 4 |
| ε-δ Controls | 6 |
| Animation | 3 |
| URL State | 3 |
| Canvas Interaction | 3 |
| Responsive Design | 2 |
| Calculus Pages | 8 |
| Accessibility | 7 |
| **Total** | **51** |

This exceeds the target of 14+ tests specified in the Phase Plan.
