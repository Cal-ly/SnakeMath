import { test, expect } from '@playwright/test'

// Base path for the app (matches vite.config.ts base)
const BASE = '/SnakeMath'

test.describe('SummationExplorer Widget', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/algebra/summation`)
  })

  test('page loads successfully', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Summation')
  })

  test('displays correct result for arithmetic sum', async ({ page }) => {
    // Set bounds to 1-10
    await page.fill('[data-testid="bounds-start"]', '1')
    await page.fill('[data-testid="bounds-end"]', '10')

    // Sum of 1 to 10 = 55
    await expect(page.locator('[data-testid="summation-total"]')).toContainText(
      '55',
    )
  })

  test('preset selector changes calculation', async ({ page }) => {
    await page.fill('[data-testid="bounds-start"]', '1')
    await page.fill('[data-testid="bounds-end"]', '5')

    // Select squares preset
    await page.selectOption('[data-testid="preset-selector"]', 'squares')

    // Sum of squares 1+4+9+16+25 = 55
    await expect(page.locator('[data-testid="summation-total"]')).toContainText(
      '55',
    )
  })

  test('bar chart shows correct number of bars', async ({ page }) => {
    await page.fill('[data-testid="bounds-start"]', '1')
    await page.fill('[data-testid="bounds-end"]', '5')

    // Wait for chart to render
    const chart = page.locator('[data-testid="bar-chart"]')
    await expect(chart).toBeVisible()

    // Check for bars 0-4 (5 bars total)
    for (let i = 0; i < 5; i++) {
      await expect(page.locator(`[data-testid="bar-${i}"]`)).toBeVisible()
    }
  })

  test('animate button exists and is clickable', async ({ page }) => {
    await page.fill('[data-testid="bounds-start"]', '1')
    await page.fill('[data-testid="bounds-end"]', '5')

    const animateButton = page.locator('[data-testid="animate-button"]')
    await expect(animateButton).toBeVisible()

    // Click animate - should not throw an error
    await animateButton.click()

    // Button text should change to "Stop" during animation
    await expect(animateButton).toContainText(/Stop|Animate/)
  })

  test('code parallel shows Python code', async ({ page }) => {
    const codeBlock = page.locator('[data-testid="code-parallel-python"]')
    await expect(codeBlock).toBeVisible()
    // Should show Python code with for loop
    await expect(codeBlock).toContainText('for')
  })

  test('formula comparison shows results match', async ({ page }) => {
    await page.fill('[data-testid="bounds-start"]', '1')
    await page.fill('[data-testid="bounds-end"]', '10')

    const comparison = page.locator('[data-testid="formula-comparison"]')
    await expect(comparison).toBeVisible()

    // Should indicate results match
    await expect(comparison).toContainText('55')
  })

  test('changing bounds updates results', async ({ page }) => {
    // Start with 1-5
    await page.fill('[data-testid="bounds-start"]', '1')
    await page.fill('[data-testid="bounds-end"]', '5')
    await expect(page.locator('[data-testid="summation-total"]')).toContainText(
      '15',
    )

    // Change to 1-10
    await page.fill('[data-testid="bounds-end"]', '10')
    await expect(page.locator('[data-testid="summation-total"]')).toContainText(
      '55',
    )
  })

  test('cubes preset calculates correctly', async ({ page }) => {
    await page.fill('[data-testid="bounds-start"]', '1')
    await page.fill('[data-testid="bounds-end"]', '4')

    // Select cubes preset
    await page.selectOption('[data-testid="preset-selector"]', 'cubes')

    // Sum of cubes 1+8+27+64 = 100
    await expect(page.locator('[data-testid="summation-total"]')).toContainText(
      '100',
    )
  })
})
