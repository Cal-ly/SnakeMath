import { test, expect } from '@playwright/test'

// Base path for the app (matches vite.config.ts base)
const BASE = '/SnakeMath'

test.describe('NumberTypeExplorer Widget', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/basics/number-types`)
  })

  test('page loads successfully', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Number Types')
  })

  test('classifies natural numbers correctly', async ({ page }) => {
    await page.fill('[data-testid="number-input"]', '42')

    // Check set membership indicators
    await expect(page.locator('[data-testid="set-ℕ"]')).toHaveAttribute(
      'data-member',
      'true',
    )
    await expect(page.locator('[data-testid="set-ℤ"]')).toHaveAttribute(
      'data-member',
      'true',
    )
    await expect(page.locator('[data-testid="set-ℚ"]')).toHaveAttribute(
      'data-member',
      'true',
    )
    await expect(page.locator('[data-testid="set-ℝ"]')).toHaveAttribute(
      'data-member',
      'true',
    )
    await expect(page.locator('[data-testid="set-ℂ"]')).toHaveAttribute(
      'data-member',
      'true',
    )
  })

  test('classifies negative integers correctly', async ({ page }) => {
    await page.fill('[data-testid="number-input"]', '-5')

    await expect(page.locator('[data-testid="set-ℕ"]')).toHaveAttribute(
      'data-member',
      'false',
    )
    await expect(page.locator('[data-testid="set-ℤ"]')).toHaveAttribute(
      'data-member',
      'true',
    )
    await expect(page.locator('[data-testid="set-ℚ"]')).toHaveAttribute(
      'data-member',
      'true',
    )
    await expect(page.locator('[data-testid="set-ℝ"]')).toHaveAttribute(
      'data-member',
      'true',
    )
  })

  test('classifies complex numbers correctly', async ({ page }) => {
    await page.fill('[data-testid="number-input"]', '3+4i')

    await expect(page.locator('[data-testid="set-ℕ"]')).toHaveAttribute(
      'data-member',
      'false',
    )
    await expect(page.locator('[data-testid="set-ℤ"]')).toHaveAttribute(
      'data-member',
      'false',
    )
    await expect(page.locator('[data-testid="set-ℚ"]')).toHaveAttribute(
      'data-member',
      'false',
    )
    await expect(page.locator('[data-testid="set-ℝ"]')).toHaveAttribute(
      'data-member',
      'false',
    )
    await expect(page.locator('[data-testid="set-ℂ"]')).toHaveAttribute(
      'data-member',
      'true',
    )
  })

  test('classifies decimals correctly', async ({ page }) => {
    await page.fill('[data-testid="number-input"]', '3.14')

    await expect(page.locator('[data-testid="set-ℕ"]')).toHaveAttribute(
      'data-member',
      'false',
    )
    await expect(page.locator('[data-testid="set-ℤ"]')).toHaveAttribute(
      'data-member',
      'false',
    )
    // Decimals are still rational as we treat them as fractions
    await expect(page.locator('[data-testid="set-ℚ"]')).toHaveAttribute(
      'data-member',
      'true',
    )
    await expect(page.locator('[data-testid="set-ℝ"]')).toHaveAttribute(
      'data-member',
      'true',
    )
  })

  test('visualization toggles work', async ({ page }) => {
    // First enter a valid number to show visualizations
    await page.fill('[data-testid="number-input"]', '5')

    // Toggles should be visible
    const numberLineToggle = page.locator('[data-testid="toggle-number-line"]')
    const vennToggle = page.locator('[data-testid="toggle-venn-diagram"]')

    await expect(numberLineToggle).toBeVisible()
    await expect(vennToggle).toBeVisible()

    // Number line should be visible by default
    const numberLine = page.locator('[data-testid="number-line"]')
    await expect(numberLine).toBeVisible()

    // Toggle off
    await numberLineToggle.click()
    await expect(numberLine).not.toBeVisible()

    // Toggle on
    await numberLineToggle.click()
    await expect(numberLine).toBeVisible()
  })

  test('venn diagram toggle works', async ({ page }) => {
    await page.fill('[data-testid="number-input"]', '5')

    const vennToggle = page.locator('[data-testid="toggle-venn-diagram"]')
    const vennDiagram = page.locator('[data-testid="venn-diagram"]')

    await expect(vennDiagram).toBeVisible()

    await vennToggle.click()
    await expect(vennDiagram).not.toBeVisible()

    await vennToggle.click()
    await expect(vennDiagram).toBeVisible()
  })

  test('example buttons update input', async ({ page }) => {
    // Click a quick example button
    await page.click('button:has-text("3.14159")')

    // Input should have the example value
    const input = page.locator('[data-testid="number-input"]')
    await expect(input).toHaveValue('3.14159')
  })
})
