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

  // Additional tests will be added after data-testid attributes are in place
})
