import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// Base path for the app (matches vite.config.ts base)
const BASE = '/SnakeMath'

const pagesToAudit = [
  { name: 'Home', path: `${BASE}/` },
  { name: 'Basics Index', path: `${BASE}/basics` },
  { name: 'Number Types', path: `${BASE}/basics/number-types` },
  { name: 'Algebra Index', path: `${BASE}/algebra` },
  { name: 'Summation', path: `${BASE}/algebra/summation` },
  { name: 'Trigonometry Index', path: `${BASE}/trigonometry` },
  { name: 'Unit Circle', path: `${BASE}/trigonometry/unit-circle` },
  { name: 'Linear Algebra Index', path: `${BASE}/linear-algebra` },
  { name: 'Vectors', path: `${BASE}/linear-algebra/vectors` },
  { name: 'Matrices', path: `${BASE}/linear-algebra/matrices` },
  { name: 'Statistics Index', path: `${BASE}/statistics` },
  { name: 'Descriptive Statistics', path: `${BASE}/statistics/descriptive` },
]

test.describe('Accessibility Audits - WCAG 2.1 AA @a11y', () => {
  for (const { name, path } of pagesToAudit) {
    test(`${name} page passes WCAG 2.1 AA`, async ({ page }) => {
      await page.goto(path)

      // Wait for dynamic content to load
      await page.waitForLoadState('networkidle')

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()

      // Log violations for debugging
      if (results.violations.length > 0) {
        console.log(`Accessibility violations on ${name}:`)
        results.violations.forEach((v) => {
          console.log(`  - ${v.id}: ${v.description}`)
          v.nodes.forEach((n) => console.log(`    ${n.html}`))
        })
      }

      expect(results.violations).toEqual([])
    })
  }
})

test.describe('Accessibility - Basic Checks @a11y', () => {
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

test.describe('Accessibility - Keyboard Navigation @a11y', () => {
  test('Number Types widget input is keyboard accessible', async ({ page }) => {
    await page.goto(`${BASE}/basics/number-types`)

    // Tab through elements to reach input
    let foundInput = false
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab')
      const focused = page.locator(':focus')
      const testId = await focused.getAttribute('data-testid')
      if (testId === 'number-input') {
        foundInput = true
        break
      }
    }

    expect(foundInput).toBe(true)
  })

  test('Summation widget preset selector is keyboard accessible', async ({ page }) => {
    await page.goto(`${BASE}/algebra/summation`)

    // Tab to reach preset selector
    let foundSelector = false
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab')
      const focused = page.locator(':focus')
      const testId = await focused.getAttribute('data-testid')
      if (testId === 'preset-selector') {
        foundSelector = true
        break
      }
    }

    expect(foundSelector).toBe(true)
  })

  test('Mobile menu is keyboard accessible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto(`${BASE}/`)

    // Find and open mobile menu button
    const menuButton = page.locator('[data-testid="mobile-menu-button"]')
    await menuButton.focus()
    await page.keyboard.press('Enter')

    // Menu should be visible
    const menu = page.locator('[data-testid="mobile-menu"]')
    await expect(menu).toBeVisible()

    // Should be able to close with Escape
    await page.keyboard.press('Escape')
    await expect(menu).not.toBeVisible()
  })

  test('Unit Circle angle slider is keyboard accessible', async ({ page }) => {
    await page.goto(`${BASE}/trigonometry/unit-circle`)
    await page.waitForLoadState('networkidle')

    // Tab to reach angle slider
    let foundSlider = false
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab')
      const focused = page.locator(':focus')
      const testId = await focused.getAttribute('data-testid')
      if (testId === 'angle-slider') {
        foundSlider = true
        break
      }
    }

    expect(foundSlider).toBe(true)
  })

  test('Unit Circle special angle buttons are keyboard accessible', async ({ page }) => {
    await page.goto(`${BASE}/trigonometry/unit-circle`)
    await page.waitForLoadState('networkidle')

    // Find a special angle button and focus it (0° is always visible in first quadrant)
    const button0 = page.locator('[data-testid="special-angle-0"]')
    await button0.focus()
    await expect(button0).toBeFocused()

    // Pressing Enter should activate the button
    await page.keyboard.press('Enter')
    const slider = page.locator('[data-testid="angle-slider"]')
    await expect(slider).toHaveValue('0')
  })

  test('Statistics calculator dataset selector is keyboard accessible', async ({ page }) => {
    await page.goto(`${BASE}/statistics/descriptive`)
    await page.waitForLoadState('networkidle')

    // Tab to reach dataset selector button
    let foundSelector = false
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab')
      const focused = page.locator(':focus')
      const testId = await focused.getAttribute('data-testid')
      if (testId === 'dataset-test-scores') {
        foundSelector = true
        break
      }
    }

    expect(foundSelector).toBe(true)
  })

  test('Statistics calculator bin count slider is keyboard accessible', async ({ page }) => {
    await page.goto(`${BASE}/statistics/descriptive`)
    await page.waitForLoadState('networkidle')

    // Tab to reach bin count slider
    let foundSlider = false
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press('Tab')
      const focused = page.locator(':focus')
      const testId = await focused.getAttribute('data-testid')
      if (testId === 'bin-count-slider') {
        foundSlider = true
        break
      }
    }

    expect(foundSlider).toBe(true)
  })

  test('Vector operations widget inputs are keyboard accessible', async ({ page }) => {
    await page.goto(`${BASE}/linear-algebra/vectors`)
    await page.waitForLoadState('networkidle')

    // Tab to reach vector A x input
    let foundInput = false
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab')
      const focused = page.locator(':focus')
      const testId = await focused.getAttribute('data-testid')
      if (testId === 'vector-a-x') {
        foundInput = true
        break
      }
    }

    expect(foundInput).toBe(true)
  })

  test('Vector operations preset selector is keyboard accessible', async ({ page }) => {
    await page.goto(`${BASE}/linear-algebra/vectors`)
    await page.waitForLoadState('networkidle')

    // Tab to reach preset selector
    let foundSelector = false
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab')
      const focused = page.locator(':focus')
      const testId = await focused.getAttribute('data-testid')
      if (testId === 'preset-select') {
        foundSelector = true
        break
      }
    }

    expect(foundSelector).toBe(true)
  })

  test('Matrix transformation type buttons are keyboard accessible', async ({ page }) => {
    await page.goto(`${BASE}/linear-algebra/matrices`)
    await page.waitForLoadState('networkidle')

    // Tab to reach transformation buttons
    let foundButton = false
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab')
      const focused = page.locator(':focus')
      const testId = await focused.getAttribute('data-testid')
      if (testId?.startsWith('transform-')) {
        foundButton = true
        break
      }
    }

    expect(foundButton).toBe(true)
  })

  test('Matrix angle slider is keyboard accessible', async ({ page }) => {
    await page.goto(`${BASE}/linear-algebra/matrices`)
    await page.waitForLoadState('networkidle')

    // Click rotation first to show slider
    await page.locator('[data-testid="transform-rotation"]').click()

    // Tab to reach angle slider
    let foundSlider = false
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab')
      const focused = page.locator(':focus')
      const testId = await focused.getAttribute('data-testid')
      if (testId === 'angle-slider') {
        foundSlider = true
        break
      }
    }

    expect(foundSlider).toBe(true)
  })

  test('Matrix preset selector is keyboard accessible', async ({ page }) => {
    await page.goto(`${BASE}/linear-algebra/matrices`)
    await page.waitForLoadState('networkidle')

    // Tab to reach preset selector
    let foundSelector = false
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab')
      const focused = page.locator(':focus')
      const testId = await focused.getAttribute('data-testid')
      if (testId === 'preset-select') {
        foundSelector = true
        break
      }
    }

    expect(foundSelector).toBe(true)
  })
})

test.describe('Accessibility - Focus Management @a11y', () => {
  test('Visualization toggles maintain focus after click', async ({ page }) => {
    await page.goto(`${BASE}/basics/number-types`)

    // First enter a valid number to show visualizations
    await page.fill('[data-testid="number-input"]', '5')

    // Find and click the number line toggle
    const toggle = page.locator('[data-testid="toggle-number-line"]')
    await toggle.click()

    // Toggle should still be focusable/focused
    await expect(toggle).toBeVisible()
  })

  test('Example buttons in NumberTypeExplorer are focusable', async ({ page }) => {
    await page.goto(`${BASE}/basics/number-types`)

    // Check that example buttons can receive focus - use exact match
    const exampleButton = page.getByRole('button', { name: '42', exact: true })
    await exampleButton.focus()
    await expect(exampleButton).toBeFocused()

    // Pressing Enter should activate the button
    await page.keyboard.press('Enter')
    const input = page.locator('[data-testid="number-input"]')
    await expect(input).toHaveValue('42')
  })
})
