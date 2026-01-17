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
 * - Epsilon-delta controls
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

    test("shows DNE for limits that don't exist", async ({ page }) => {
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
  // Epsilon-Delta Controls Tests
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
      await deltaSlider.fill('0.50')

      await expect(page.locator('text=δ (delta) = 0.50')).toBeVisible()
    })

    test('Find delta button works', async ({ page }) => {
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
      const integrationCard = page.locator('text=Coming Soon').first()
      await expect(integrationCard).toBeVisible()
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
      const epsilonDelta = page.locator('text=Epsilon-Delta Definition')
      await epsilonDelta.click()

      // Content should be visible
      await expect(page.locator('text=For every epsilon')).toBeVisible()
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
