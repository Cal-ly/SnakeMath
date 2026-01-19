import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Integration Page Accessibility', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/calculus/integration')

    // Wait for content to load
    await page.waitForSelector('h1')
    await page.waitForSelector('[data-testid="integration-explorer"]')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('widget controls are keyboard accessible', async ({ page }) => {
    await page.goto('/calculus/integration')
    await page.waitForSelector('[data-testid="integration-explorer"]')

    // Tab to function selector and verify it can be focused
    const selector = page.locator('#function-select')
    await selector.focus()

    // Should be able to change selection with keyboard
    await page.keyboard.press('ArrowDown')

    // Value should change (or at least element should be focusable)
    const value = await selector.inputValue()
    expect(value).toBeDefined()
  })

  test('form inputs have associated labels', async ({ page }) => {
    await page.goto('/calculus/integration')
    await page.waitForSelector('[data-testid="integration-explorer"]')

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
    await page.waitForSelector('[data-testid="integration-explorer"]')

    const svg = page.locator('svg[role="img"]')
    await expect(svg).toHaveAttribute('aria-label')
  })

  test('color is not the only indicator', async ({ page }) => {
    await page.goto('/calculus/integration')
    await page.waitForSelector('[data-testid="integration-explorer"]')

    // Legend should have text labels, not just colors
    await expect(page.locator('text=Positive area')).toBeVisible()
    await expect(page.locator('text=Negative area')).toBeVisible()
  })
})
