import { test, expect } from '@playwright/test'

// Base path for the app (matches vite.config.ts base)
const BASE = '/SnakeMath'

test.describe('Site Navigation', () => {
  test('homepage loads and has correct title', async ({ page }) => {
    await page.goto(`${BASE}/`)
    await expect(page).toHaveTitle(/SnakeMath/)
  })

  test('can navigate to Basics section', async ({ page }) => {
    await page.goto(`${BASE}/`)
    await page.click('text=Foundations')
    await expect(page).toHaveURL(/\/basics$/)
  })

  test('can navigate to Algebra section', async ({ page }) => {
    await page.goto(`${BASE}/`)
    await page.click('text=Algebra')
    await expect(page).toHaveURL(/\/algebra$/)
  })

  test('breadcrumbs show correct path', async ({ page }) => {
    await page.goto(`${BASE}/basics/number-types`)
    const breadcrumbs = page.locator('nav[aria-label="Breadcrumb"]')
    await expect(breadcrumbs).toContainText('Home')
    await expect(breadcrumbs).toContainText('Foundations')
    await expect(breadcrumbs).toContainText('Number Types')
  })

  test('mobile menu opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto(`${BASE}/`)

    // Menu should be hidden initially
    const menu = page.locator('[data-testid="mobile-menu"]')
    await expect(menu).not.toBeVisible()

    // Open menu
    await page.click('[data-testid="mobile-menu-button"]')
    await expect(menu).toBeVisible()

    // Close menu
    await page.click('[data-testid="mobile-menu-close"]')
    await expect(menu).not.toBeVisible()
  })

  test('mobile menu navigates to pages', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto(`${BASE}/`)

    // Open menu
    await page.click('[data-testid="mobile-menu-button"]')

    // Click on Number Types
    await page.click('[data-testid="mobile-menu"] a:has-text("Number Types")')

    // Should navigate and close menu
    await expect(page).toHaveURL(/number-types/)
    await expect(page.locator('[data-testid="mobile-menu"]')).not.toBeVisible()
  })
})
