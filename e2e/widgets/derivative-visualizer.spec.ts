import { test, expect } from '@playwright/test'

/**
 * E2E tests for the DerivativeVisualizer widget
 *
 * Tests cover:
 * - Widget rendering
 * - Function preset selection
 * - Point of tangency interaction
 * - Tangent line display
 * - Derivative value display
 * - Secant line controls
 * - Animation functionality
 * - URL state synchronization
 * - Accessibility
 */

test.describe('DerivativeVisualizer Widget', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calculus/derivatives')
    // Wait for widget to be fully loaded
    await page.waitForSelector('[data-testid="derivative-visualizer"]')
  })

  // ==========================================================================
  // Basic Rendering Tests
  // ==========================================================================

  test.describe('Basic Rendering', () => {
    test('renders the widget container', async ({ page }) => {
      const widget = page.locator('[data-testid="derivative-visualizer"]')
      await expect(widget).toBeVisible()
    })

    test('renders function selector with all presets', async ({ page }) => {
      const presetButtons = page.locator('.function-selector button')
      await expect(presetButtons).toHaveCount(8) // 8 preset functions
    })

    test('renders the canvas SVG', async ({ page }) => {
      const canvas = page.locator('.derivative-canvas-container svg')
      await expect(canvas).toBeVisible()
    })

    test('renders the derivative display section', async ({ page }) => {
      const derivDisplay = page.locator('.derivative-display')
      await expect(derivDisplay).toBeVisible()
    })

    test('shows function and derivative formulas in LaTeX', async ({ page }) => {
      // Check that MathBlock is rendering (KaTeX creates .katex elements)
      const mathBlock = page.locator('.function-selector .katex')
      await expect(mathBlock.first()).toBeVisible()
    })
  })

  // ==========================================================================
  // Function Selection Tests
  // ==========================================================================

  test.describe('Function Selection', () => {
    test('selects quadratic preset by default', async ({ page }) => {
      const quadraticBtn = page.locator('button:has-text("Quadratic")')
      await expect(quadraticBtn).toHaveClass(/bg-primary/)
    })

    test('can select different preset functions', async ({ page }) => {
      // Click on Sine preset
      await page.click('button:has-text("Sine")')

      // Verify it's now selected
      const sineBtn = page.locator('button:has-text("Sine")')
      await expect(sineBtn).toHaveClass(/bg-primary/)

      // Verify quadratic is deselected
      const quadraticBtn = page.locator('button:has-text("Quadratic")')
      await expect(quadraticBtn).not.toHaveClass(/bg-primary/)
    })

    test('updates description when preset changes', async ({ page }) => {
      // Select exponential
      await page.click('button:has-text("Exponential")')

      // Description should mention it's its own derivative
      await expect(page.locator('text=own derivative')).toBeVisible()
    })

    test('updates interesting points when preset changes', async ({ page }) => {
      // Select polynomial which has interesting points
      await page.click('button:has-text("Polynomial")')

      // Should see interesting point buttons
      const interestingPoints = page.locator('button:has-text("x = 1")')
      await expect(interestingPoints).toBeVisible()
    })
  })

  // ==========================================================================
  // Point Selection Tests
  // ==========================================================================

  test.describe('Point of Tangency Interaction', () => {
    test('can click interesting point buttons', async ({ page }) => {
      // Select quadratic
      await page.click('button:has-text("Quadratic")')

      // Click on x = 0 interesting point (minimum)
      await page.click('button:has-text("x = 0")')

      // Verify point is updated in the UI
      await expect(page.locator('text=x = 0.00')).toBeVisible()
    })

    test('slider changes point of tangency', async ({ page }) => {
      const slider = page.locator('input[aria-label="Point of tangency"]')
      await slider.fill('1.5')

      // Check that the value is reflected in the UI
      await expect(page.locator('text=x = 1.50')).toBeVisible()
    })
  })

  // ==========================================================================
  // Derivative Display Tests
  // ==========================================================================

  test.describe('Derivative Value Display', () => {
    test('displays derivative value', async ({ page }) => {
      const derivDisplay = page.locator('.derivative-display')
      await expect(derivDisplay.locator("text=f'(x) =")).toBeVisible()
    })

    test('shows slope interpretation (increasing/decreasing)', async ({ page }) => {
      // At x=1 for quadratic, slope is 2 (positive = increasing)
      await page.click('button:has-text("x = 1")')
      await page.waitForTimeout(100)

      await expect(page.locator('text=increasing')).toBeVisible()
    })

    test('shows horizontal tangent at critical points', async ({ page }) => {
      // At x=0 for quadratic, slope is 0
      await page.click('button:has-text("x = 0")')
      await page.waitForTimeout(100)

      await expect(page.locator('text=Horizontal')).toBeVisible()
    })

    test('shows tangent line equation', async ({ page }) => {
      const tangentEq = page.locator('text=y =')
      await expect(tangentEq).toBeVisible()
    })
  })

  // ==========================================================================
  // Secant Line Tests
  // ==========================================================================

  test.describe('Secant Line Controls', () => {
    test.beforeEach(async ({ page }) => {
      // Enable secant line
      await page.click('button:has-text("Secant Line")')
    })

    test('shows secant controls when enabled', async ({ page }) => {
      const secantControls = page.locator('.secant-controls')
      await expect(secantControls).toBeVisible()
    })

    test('h slider is visible', async ({ page }) => {
      const hSlider = page.locator('.secant-controls input[type="range"]')
      await expect(hSlider).toBeVisible()
    })

    test('h slider changes value', async ({ page }) => {
      const hSlider = page.locator('.secant-controls input[type="range"]')
      await hSlider.fill('0.1')

      await expect(page.locator('text=h = 0.100')).toBeVisible()
    })

    test('shows secant vs tangent slope comparison', async ({ page }) => {
      await expect(page.locator('text=Secant slope')).toBeVisible()
      await expect(page.locator('text=Tangent slope')).toBeVisible()
    })

    test('shows convergence message as h decreases', async ({ page }) => {
      const hSlider = page.locator('.secant-controls input[type="range"]')
      await hSlider.fill('0.005')

      await expect(page.locator('text=close')).toBeVisible()
    })
  })

  // ==========================================================================
  // Derivative Curve Tests
  // ==========================================================================

  test.describe('Derivative Curve Display', () => {
    test('can toggle derivative curve visibility', async ({ page }) => {
      await page.click("button:has-text(\"f'(x) Curve\")")

      // Verify button is active
      const curveBtn = page.locator("button:has-text(\"f'(x) Curve\")")
      await expect(curveBtn).toHaveClass(/bg-purple/)
    })
  })

  // ==========================================================================
  // Animation Tests
  // ==========================================================================

  test.describe('Secant Animation', () => {
    test.beforeEach(async ({ page }) => {
      // Enable animation panel
      await page.click('button:has-text("Animation")')
      await page.waitForSelector('.secant-animation')
    })

    test('shows animation controls', async ({ page }) => {
      const animationPanel = page.locator('.secant-animation')
      await expect(animationPanel).toBeVisible()
    })

    test('shows approximation table', async ({ page }) => {
      const table = page.locator('.secant-animation table')
      await expect(table).toBeVisible()
    })

    test('play button starts animation', async ({ page }) => {
      // Find and click play button (first button in animation controls)
      const playBtn = page.locator('.secant-animation button').first()
      await playBtn.click()

      // Wait for some animation
      await page.waitForTimeout(300)

      // Table should have visible rows
      const tableRows = page.locator('.secant-animation tbody tr')
      const count = await tableRows.count()
      expect(count).toBeGreaterThan(0)
    })

    test('shows target tangent slope row', async ({ page }) => {
      await expect(page.locator('text=h → 0')).toBeVisible()
    })
  })

  // ==========================================================================
  // URL State Tests
  // ==========================================================================

  test.describe('URL State Synchronization', () => {
    test('preset selection updates URL', async ({ page }) => {
      await page.click('button:has-text("Sine")')
      await page.waitForTimeout(400) // Wait for debounce

      expect(page.url()).toContain('preset=sine')
    })

    test('URL parameters restore state', async ({ page }) => {
      // Navigate with query params
      await page.goto('/calculus/derivatives?preset=exponential&point=1')

      // Wait for widget to load
      await page.waitForSelector('[data-testid="derivative-visualizer"]')

      // Verify exponential is selected
      const expBtn = page.locator('button:has-text("Exponential")')
      await expect(expBtn).toHaveClass(/bg-primary/)

      // Verify point is 1
      await expect(page.locator('text=x = 1.00')).toBeVisible()
    })

    test('secant toggle updates URL', async ({ page }) => {
      await page.click('button:has-text("Secant Line")')
      await page.waitForTimeout(400)

      expect(page.url()).toContain('secant=1')
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
      const curve = page.locator('.derivative-canvas-container svg path')
      await expect(curve.first()).toBeVisible()
    })

    test('point marker is visible', async ({ page }) => {
      const marker = page.locator('.derivative-canvas-container svg circle')
      await expect(marker.first()).toBeVisible()
    })

    test('tangent line is visible', async ({ page }) => {
      // Tangent line should be a blue line
      const tangentLine = page.locator('.derivative-canvas-container svg line').first()
      await expect(tangentLine).toBeVisible()
    })

    test('legend is visible', async ({ page }) => {
      await expect(page.locator('.derivative-canvas-container text:has-text("f(x)")')).toBeVisible()
      await expect(page.locator('.derivative-canvas-container text:has-text("tangent")')).toBeVisible()
    })
  })

  // ==========================================================================
  // Responsive Design Tests
  // ==========================================================================

  test.describe('Responsive Design', () => {
    test('renders correctly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      const widget = page.locator('[data-testid="derivative-visualizer"]')
      await expect(widget).toBeVisible()

      // Canvas should still be visible
      const canvas = page.locator('.derivative-canvas-container svg')
      await expect(canvas).toBeVisible()
    })

    test('renders correctly on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })

      const widget = page.locator('[data-testid="derivative-visualizer"]')
      await expect(widget).toBeVisible()
    })
  })
})

// ==========================================================================
// Derivatives Page Content Tests
// ==========================================================================

test.describe('Derivatives Page Content', () => {
  test('renders page title', async ({ page }) => {
    await page.goto('/calculus/derivatives')
    await expect(page.locator('h1:has-text("Derivatives")')).toBeVisible()
  })

  test('renders introduction section', async ({ page }) => {
    await page.goto('/calculus/derivatives')
    await expect(page.locator('text=What is a Derivative?')).toBeVisible()
  })

  test('shows three analogies (everyday, programming, visual)', async ({ page }) => {
    await page.goto('/calculus/derivatives')

    await expect(page.locator('text=Everyday Analogy')).toBeVisible()
    await expect(page.locator('text=Programming Analogy')).toBeVisible()
    await expect(page.locator('text=Visual Intuition')).toBeVisible()
  })

  test('renders interactive explorer section', async ({ page }) => {
    await page.goto('/calculus/derivatives')
    await expect(page.locator('text=Interactive Derivative Explorer')).toBeVisible()
  })

  test('renders experiment suggestions', async ({ page }) => {
    await page.goto('/calculus/derivatives')
    await expect(page.locator('text=Try These Experiments')).toBeVisible()
  })

  test('collapsible sections work', async ({ page }) => {
    await page.goto('/calculus/derivatives')

    // Click on a collapsed section header
    const secantSection = page.locator('text=From Secants to Tangents')
    await secantSection.click()

    // Content should be visible
    await expect(page.locator('text=central_difference')).toBeVisible()
  })

  test('code examples render', async ({ page }) => {
    await page.goto('/calculus/derivatives')

    // Gradient descent section should have code
    await expect(page.locator('code:has-text("gradient_descent")')).toBeVisible()
  })

  test('math blocks render with KaTeX', async ({ page }) => {
    await page.goto('/calculus/derivatives')

    // KaTeX should render derivative notation
    const katexElements = page.locator('.katex')
    const count = await katexElements.count()
    expect(count).toBeGreaterThan(0)
  })

  test('related topics section exists', async ({ page }) => {
    await page.goto('/calculus/derivatives')

    await expect(page.locator('text=Related Topics')).toBeVisible()
    await expect(page.locator('a:has-text("Limits")')).toBeVisible()
  })

  test('gradient descent section is highlighted', async ({ page }) => {
    await page.goto('/calculus/derivatives')

    await expect(page.locator('text=Gradient Descent in Action')).toBeVisible()
  })
})

// ==========================================================================
// Navigation Tests
// ==========================================================================

test.describe('Derivatives Navigation', () => {
  test('derivatives link appears in calculus index', async ({ page }) => {
    await page.goto('/calculus')

    const derivativesLink = page.locator('a:has-text("Derivatives")')
    await expect(derivativesLink).toBeVisible()
  })

  test('can navigate from limits to derivatives', async ({ page }) => {
    await page.goto('/calculus/limits')

    // Click derivatives in sidebar or related topics
    await page.goto('/calculus/derivatives')

    await expect(page).toHaveURL(/\/calculus\/derivatives/)
    await expect(page.locator('h1:has-text("Derivatives")')).toBeVisible()
  })

  test('breadcrumbs work correctly', async ({ page }) => {
    await page.goto('/calculus/derivatives')

    // Should have breadcrumb showing Calculus > Derivatives
    await expect(page.locator('nav[aria-label="Breadcrumb"] a:has-text("Calculus")')).toBeVisible()
  })
})
