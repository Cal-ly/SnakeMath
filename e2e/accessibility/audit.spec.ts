import { test, expect } from '@playwright/test'

// Base path for the app (matches vite.config.ts base)
const BASE = '/SnakeMath'

// Placeholder for accessibility tests
// Will be expanded in 6C with @axe-core/playwright

const pagesToAudit = [
  { name: 'Home', path: `${BASE}/` },
  { name: 'Basics Index', path: `${BASE}/basics` },
  { name: 'Number Types', path: `${BASE}/basics/number-types` },
  { name: 'Algebra Index', path: `${BASE}/algebra` },
  { name: 'Summation', path: `${BASE}/algebra/summation` },
]

test.describe('Accessibility - Basic Checks', () => {
  for (const { name, path } of pagesToAudit) {
    test(`${name} page has no empty links`, async ({ page }) => {
      await page.goto(path)
      await page.waitForLoadState('networkidle')

      // Check that all links have accessible text
      const links = page.locator('a')
      const count = await links.count()

      for (let i = 0; i < count; i++) {
        const link = links.nth(i)
        const text = await link.textContent()
        const ariaLabel = await link.getAttribute('aria-label')
        const title = await link.getAttribute('title')

        // Link should have some accessible name
        const hasAccessibleName = (text && text.trim()) || ariaLabel || title
        expect(
          hasAccessibleName,
          `Link ${i} on ${name} page should have accessible text`,
        ).toBeTruthy()
      }
    })
  }
})
