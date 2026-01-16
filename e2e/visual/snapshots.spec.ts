import { test, expect } from '@playwright/test'

/**
 * Visual regression tests for all pages.
 * Uses Playwright's screenshot comparison to detect visual changes.
 *
 * To update baselines: npx playwright test --update-snapshots --project=visual-desktop
 * To run visual tests: npm run test:visual
 */

// Base path for the app (matches vite.config.ts base)
const BASE = '/SnakeMath'

// Helper to wait for page to fully render (KaTeX, Shiki, etc.)
async function waitForPageReady(page: import('@playwright/test').Page) {
  await page.waitForLoadState('networkidle')
  // Wait for lazy-loaded content (KaTeX formulas, syntax highlighting)
  await page.waitForTimeout(500)
  // Disable animations for consistent screenshots
  await page.emulateMedia({ reducedMotion: 'reduce' })
}

test.describe('Visual Regression - Pages @visual', () => {
  test('home page', async ({ page }) => {
    await page.goto(`${BASE}/`)
    await waitForPageReady(page)
    await expect(page).toHaveScreenshot('home.png', { fullPage: true })
  })

  test('basics index', async ({ page }) => {
    await page.goto(`${BASE}/basics`)
    await waitForPageReady(page)
    await expect(page).toHaveScreenshot('basics-index.png', { fullPage: true })
  })

  test('foundations', async ({ page }) => {
    await page.goto(`${BASE}/basics/foundations`)
    await waitForPageReady(page)
    await expect(page).toHaveScreenshot('foundations.png', { fullPage: true })
  })

  test('math symbols', async ({ page }) => {
    await page.goto(`${BASE}/basics/symbols`)
    await waitForPageReady(page)
    await expect(page).toHaveScreenshot('symbols.png', { fullPage: true })
  })

  test('number types', async ({ page }) => {
    await page.goto(`${BASE}/basics/number-types`)
    await waitForPageReady(page)
    await expect(page).toHaveScreenshot('number-types.png', { fullPage: true })
  })

  test('functions', async ({ page }) => {
    await page.goto(`${BASE}/basics/functions`)
    await waitForPageReady(page)
    await expect(page).toHaveScreenshot('functions.png', { fullPage: true })
  })

  test('variables', async ({ page }) => {
    await page.goto(`${BASE}/basics/variables`)
    await waitForPageReady(page)
    await expect(page).toHaveScreenshot('variables.png', { fullPage: true })
  })

  test('order of operations', async ({ page }) => {
    await page.goto(`${BASE}/basics/order-of-operations`)
    await waitForPageReady(page)
    await expect(page).toHaveScreenshot('order-of-operations.png', {
      fullPage: true,
    })
  })

  test('algebra index', async ({ page }) => {
    await page.goto(`${BASE}/algebra`)
    await waitForPageReady(page)
    await expect(page).toHaveScreenshot('algebra-index.png', { fullPage: true })
  })

  test('summation', async ({ page }) => {
    await page.goto(`${BASE}/algebra/summation`)
    await waitForPageReady(page)
    await expect(page).toHaveScreenshot('summation.png', { fullPage: true })
  })

  test('quadratics', async ({ page }) => {
    await page.goto(`${BASE}/algebra/quadratics`)
    await waitForPageReady(page)
    await expect(page).toHaveScreenshot('quadratics.png', { fullPage: true })
  })
})

test.describe('Visual Regression - Widget States @visual', () => {
  test.describe('NumberTypeExplorer', () => {
    test('default state', async ({ page }) => {
      await page.goto(`${BASE}/basics/number-types`)
      await waitForPageReady(page)
      const widget = page.locator('[data-testid="number-type-explorer"]')
      await expect(widget).toHaveScreenshot('number-explorer-default.png')
    })

    test('with integer input (42)', async ({ page }) => {
      await page.goto(`${BASE}/basics/number-types`)
      await waitForPageReady(page)
      await page.locator('[data-testid="number-input"]').fill('42')
      await waitForPageReady(page)
      const widget = page.locator('[data-testid="number-type-explorer"]')
      await expect(widget).toHaveScreenshot('number-explorer-integer.png')
    })

    test('with decimal input (3.14)', async ({ page }) => {
      await page.goto(`${BASE}/basics/number-types`)
      await waitForPageReady(page)
      await page.locator('[data-testid="number-input"]').fill('3.14')
      await waitForPageReady(page)
      const widget = page.locator('[data-testid="number-type-explorer"]')
      await expect(widget).toHaveScreenshot('number-explorer-decimal.png')
    })

    test('with complex input (2+3i)', async ({ page }) => {
      await page.goto(`${BASE}/basics/number-types`)
      await waitForPageReady(page)
      await page.locator('[data-testid="number-input"]').fill('2+3i')
      await waitForPageReady(page)
      const widget = page.locator('[data-testid="number-type-explorer"]')
      await expect(widget).toHaveScreenshot('number-explorer-complex.png')
    })
  })

  test.describe('SummationExplorer', () => {
    test('default preset', async ({ page }) => {
      await page.goto(`${BASE}/algebra/summation`)
      await waitForPageReady(page)
      const widget = page.locator('[data-testid="summation-explorer"]')
      await expect(widget).toHaveScreenshot('summation-default.png')
    })

    test('squares preset', async ({ page }) => {
      await page.goto(`${BASE}/algebra/summation`)
      await waitForPageReady(page)
      await page.locator('[data-testid="preset-selector"]').selectOption('squares')
      await waitForPageReady(page)
      const widget = page.locator('[data-testid="summation-explorer"]')
      await expect(widget).toHaveScreenshot('summation-squares.png')
    })

    test('custom bounds (1 to 20)', async ({ page }) => {
      await page.goto(`${BASE}/algebra/summation`)
      await waitForPageReady(page)
      await page.locator('[data-testid="bounds-end"]').fill('20')
      await waitForPageReady(page)
      const widget = page.locator('[data-testid="summation-explorer"]')
      await expect(widget).toHaveScreenshot('summation-custom-bounds.png')
    })
  })

  test.describe('QuadraticExplorer', () => {
    test('default preset', async ({ page }) => {
      await page.goto(`${BASE}/algebra/quadratics`)
      await waitForPageReady(page)
      const widget = page.locator('[data-testid="quadratic-explorer"]')
      await expect(widget).toHaveScreenshot('quadratic-default.png')
    })

    test('projectile preset', async ({ page }) => {
      await page.goto(`${BASE}/algebra/quadratics`)
      await waitForPageReady(page)
      await page.locator('[data-testid="preset-selector"]').selectOption('projectile')
      await waitForPageReady(page)
      const widget = page.locator('[data-testid="quadratic-explorer"]')
      await expect(widget).toHaveScreenshot('quadratic-projectile.png')
    })

    test('complex roots (a=1, b=0, c=1)', async ({ page }) => {
      await page.goto(`${BASE}/algebra/quadratics`)
      await waitForPageReady(page)
      // Adjust sliders for x² + 1 (no real roots)
      await page.locator('[data-testid="coefficient-b-slider"]').fill('0')
      await page.locator('[data-testid="coefficient-c-slider"]').fill('1')
      await waitForPageReady(page)
      const widget = page.locator('[data-testid="quadratic-explorer"]')
      await expect(widget).toHaveScreenshot('quadratic-complex-roots.png')
    })
  })
})
