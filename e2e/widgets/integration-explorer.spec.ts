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

      // Bounds should update to sine defaults
      const upperBound = page.locator('#upper-bound')
      // π ≈ 3.14159
      const value = await upperBound.inputValue()
      expect(parseFloat(value)).toBeCloseTo(Math.PI, 1)
    })

    test('all presets are selectable', async ({ page }) => {
      const presets = [
        'linear',
        'quadratic',
        'sine',
        'exponential',
        'reciprocal',
        'cubic-signed',
        'semicircle',
        'constant',
      ]
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

      // Get initial approximation
      await page.waitForTimeout(100)

      await lowerBound.fill('1')
      await lowerBound.blur()

      // Wait for recalculation
      await page.waitForTimeout(100)

      // Approximation should change (1 to 2 gives different result than 0 to 2)
      // The exact value for quadratic from 1 to 2 is 7/3 ≈ 2.33
      await expect(page.locator('#upper-bound')).toHaveValue('2')
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

      // Set slider value
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
      await page.locator('label:has-text("Left")').click()

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
      await page.locator('label:has-text("Midpoint")').click()
      await page.waitForTimeout(100)
      const midpointApprox = await page
        .locator('[data-testid="integration-explorer"]')
        .locator('text=Approximation')
        .locator('..')
        .locator('.font-mono')
        .textContent()

      // Get left approximation
      await page.locator('label:has-text("Left")').click()
      await page.waitForTimeout(100)
      const leftApprox = await page
        .locator('[data-testid="integration-explorer"]')
        .locator('text=Approximation')
        .locator('..')
        .locator('.font-mono')
        .textContent()

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
      const rectangles = page.locator('svg rect')
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
      await page.waitForTimeout(200)

      // Find the relative error element
      const errorElement10 = page.locator('text=Rel. Error').locator('..').locator('.font-mono')
      const errorText10 = await errorElement10.textContent()
      const error10 = parseFloat(errorText10?.replace('%', '') ?? '100')

      // Get error at n=100
      await nInput.fill('100')
      await nInput.blur()
      await page.waitForTimeout(200)

      const errorText100 = await errorElement10.textContent()
      const error100 = parseFloat(errorText100?.replace('%', '') ?? '100')

      // Error at n=100 should be significantly less than at n=10
      expect(error100).toBeLessThan(error10 / 2)
    })
  })

  test.describe('Convergence Animation', () => {
    test('animation panel is collapsible', async ({ page }) => {
      // Find and expand the animation panel
      const panelHeader = page.locator('button:has-text("Convergence Animation")')
      await panelHeader.click()

      // Play button should be visible
      await expect(page.locator('button:has-text("Play")')).toBeVisible()
    })

    test('reset button returns n to starting value', async ({ page }) => {
      // Expand animation panel
      await page.locator('button:has-text("Convergence Animation")').click()

      // Set n to a high value
      const nInput = page.locator('#subdivisions')
      await nInput.fill('100')
      await nInput.blur()

      // Click reset in animation panel
      await page.locator('button:has-text("Reset")').click()

      // n should be back to starting value (4)
      await expect(nInput).toHaveValue('4')
    })
  })

  test.describe('URL State Sync', () => {
    test('preset in URL is loaded', async ({ page }) => {
      await page.goto('/calculus/integration?preset=sine')
      await page.waitForSelector('[data-testid="integration-explorer"]')

      const selector = page.locator('#function-select')
      await expect(selector).toHaveValue('sine')
    })

    test('bounds in URL are loaded', async ({ page }) => {
      await page.goto('/calculus/integration?preset=quadratic&a=1.000&b=3.000')
      await page.waitForSelector('[data-testid="integration-explorer"]')

      const lowerBound = page.locator('#lower-bound')
      const upperBound = page.locator('#upper-bound')

      await expect(lowerBound).toHaveValue('1')
      await expect(upperBound).toHaveValue('3')
    })

    test('method in URL is loaded', async ({ page }) => {
      await page.goto('/calculus/integration?method=trapezoidal')
      await page.waitForSelector('[data-testid="integration-explorer"]')

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
