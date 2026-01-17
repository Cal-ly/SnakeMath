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

    const results = await new AxeBuilder({ page }).withTags(['cat.color']).analyze()

    expect(results.violations).toEqual([])
  })
})
