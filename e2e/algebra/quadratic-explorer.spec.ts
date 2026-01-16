import { test, expect } from '@playwright/test'

test.describe('QuadraticExplorer Widget', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/algebra/quadratics')
    await page.waitForLoadState('networkidle')
  })

  test('default state shows standard parabola', async ({ page }) => {
    await expect(page.locator('[data-testid="equation-standard"]')).toContainText('y = x²')
    await expect(page.locator('[data-testid="vertex-display"]')).toContainText('(0, 0)')
  })

  test('preset selector loads correct coefficients', async ({ page }) => {
    await page.locator('[data-testid="preset-selector"]').selectOption('projectile')

    // Wait for update
    await page.waitForTimeout(300)

    // Verify equation updated (projectile has a=-4.9, b=20, c=1.5)
    await expect(page.locator('[data-testid="equation-standard"]')).toContainText('-4.9x²')
    await expect(page.locator('[data-testid="equation-standard"]')).toContainText('+ 20x')
    await expect(page.locator('[data-testid="equation-standard"]')).toContainText('+ 1.5')
  })

  test('adjusting coefficient a changes equation', async ({ page }) => {
    const slider = page.locator('[data-testid="coefficient-a-slider"]')

    // Change a to 2
    await slider.fill('2')
    await page.waitForTimeout(100)

    await expect(page.locator('[data-testid="equation-standard"]')).toContainText('2x²')
  })

  test('discriminant correctly identifies root types', async ({ page }) => {
    // Default (standard) has two real roots at x=0 (one repeated)
    await expect(page.locator('[data-testid="discriminant-value"]')).toContainText('Δ = 0')

    // Load inverted preset (a=-1, b=0, c=4 → roots at ±2)
    await page.locator('[data-testid="preset-selector"]').selectOption('inverted')
    await page.waitForTimeout(300)

    await expect(page.locator('[data-testid="discriminant-value"]')).toContainText('Δ = 16')
  })

  test('complex roots show message with link', async ({ page }) => {
    // Set coefficients for x² + 1 (no real roots)
    await page.locator('[data-testid="coefficient-a-slider"]').fill('1')
    await page.locator('[data-testid="coefficient-b-slider"]').fill('0')
    await page.locator('[data-testid="coefficient-c-slider"]').fill('1')

    await page.waitForTimeout(300)

    await expect(page.locator('[data-testid="roots-display"]')).toContainText('No real roots')
    await expect(page.locator('[data-testid="roots-display"] a')).toHaveAttribute(
      'href',
      '/basics/number-types'
    )
  })

  test('real-world preset shows explanation', async ({ page }) => {
    await page.locator('[data-testid="preset-selector"]').selectOption('projectile')
    await page.waitForTimeout(300)

    // Projectile preset should show its explanation
    await expect(page.locator('[data-testid="quadratic-explorer"]')).toContainText(
      'ball thrown upward'
    )
  })

  test('vertex form displays correctly', async ({ page }) => {
    // Load shifted preset (vertex at (2, -1))
    await page.locator('[data-testid="preset-selector"]').selectOption('shifted')
    await page.waitForTimeout(300)

    await expect(page.locator('[data-testid="equation-vertex"]')).toContainText('(x - 2)²')
    await expect(page.locator('[data-testid="equation-vertex"]')).toContainText('- 1')
  })

  test('factored form shows for real roots', async ({ page }) => {
    // Load shifted preset which has real roots
    await page.locator('[data-testid="preset-selector"]').selectOption('shifted')
    await page.waitForTimeout(300)

    // Should show factored form
    await expect(page.locator('[data-testid="equation-factored"]')).not.toContainText(
      'Not available'
    )
  })

  test('factored form not available for complex roots', async ({ page }) => {
    // Set coefficients for x² + 1 (complex roots)
    await page.locator('[data-testid="coefficient-c-slider"]').fill('1')
    await page.locator('[data-testid="coefficient-b-slider"]').fill('0')

    await page.waitForTimeout(300)

    await expect(page.locator('[data-testid="equation-factored"]')).toContainText('Not available')
  })

  test('URL state syncs with coefficients', async ({ page }) => {
    // Navigate with URL parameters
    await page.goto('/algebra/quadratics?a=2&b=-4&c=1')
    await page.waitForLoadState('networkidle')

    // Verify sliders reflect URL values
    const aSlider = page.locator('[data-testid="coefficient-a-slider"]')
    await expect(aSlider).toHaveValue('2')

    // Verify equation matches
    await expect(page.locator('[data-testid="equation-standard"]')).toContainText('2x²')
  })

  test('graph is visible', async ({ page }) => {
    const graph = page.locator('[data-testid="quadratic-graph"]')
    await expect(graph).toBeVisible()

    // Check that SVG coordinate system exists
    await expect(graph.locator('svg')).toBeVisible()
  })

  test('all presets are selectable', async ({ page }) => {
    const presets = [
      'standard',
      'wide',
      'narrow',
      'shifted',
      'inverted',
      'projectile',
      'profit',
      'reflector',
    ]

    for (const preset of presets) {
      await page.locator('[data-testid="preset-selector"]').selectOption(preset)
      await page.waitForTimeout(200)
      await expect(page.locator('[data-testid="quadratic-explorer"]')).toBeVisible()
    }
  })
})
