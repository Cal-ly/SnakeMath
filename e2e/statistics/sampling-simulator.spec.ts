import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Sampling Simulator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/statistics/sampling')
    // Wait for widget to load
    await page.waitForSelector('[data-testid="sampling-simulator"]')
  })

  test.describe('Page Content', () => {
    test('displays page title and introduction', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Sampling & Estimation' })).toBeVisible()
      await expect(page.getByText('Sampling', { exact: false })).toBeVisible()
    })

    test('has three-analogy block with correct styling', async ({ page }) => {
      // Check for all three analogy types
      await expect(page.getByText('Everyday Analogy')).toBeVisible()
      await expect(page.getByText('Programming Analogy')).toBeVisible()
      await expect(page.getByText('Visual Intuition')).toBeVisible()

      // Check content is present
      await expect(page.getByText(/tasting soup/)).toBeVisible()
      await expect(page.getByText(/profiling/)).toBeVisible()
    })

    test('has common pitfall callout', async ({ page }) => {
      await expect(page.getByText('Common Pitfall')).toBeVisible()
      await expect(page.getByText(/Bigger Isn't Always Better/)).toBeVisible()
    })

    test('has related topics section', async ({ page }) => {
      await expect(page.getByText('Related Topics', { exact: true })).toBeVisible()
      await expect(page.getByRole('link', { name: /Statistics Overview/ })).toBeVisible()
      await expect(page.getByRole('link', { name: /Probability Distributions/ })).toBeVisible()
    })
  })

  test.describe('Sampling Widget Interactions', () => {
    test('population grid renders with items', async ({ page }) => {
      const grid = page.locator('[data-testid="population-grid"]')
      await expect(grid).toBeVisible()

      // Should show population size
      await expect(page.getByText(/N =/)).toBeVisible()
    })

    test('sampling method selector works', async ({ page }) => {
      const selector = page.locator('[data-testid="sampling-method-selector"]')
      await expect(selector).toBeVisible()

      // Default should be simple random
      const simpleBtn = page.locator('[data-testid="method-simple"]')
      await expect(simpleBtn).toHaveAttribute('aria-checked', 'true')

      // Click stratified
      await page.locator('[data-testid="method-stratified"]').click()
      await expect(page.locator('[data-testid="method-stratified"]')).toHaveAttribute(
        'aria-checked',
        'true'
      )

      // Click systematic
      await page.locator('[data-testid="method-systematic"]').click()
      await expect(page.locator('[data-testid="method-systematic"]')).toHaveAttribute(
        'aria-checked',
        'true'
      )

      // Click cluster
      await page.locator('[data-testid="method-cluster"]').click()
      await expect(page.locator('[data-testid="method-cluster"]')).toHaveAttribute(
        'aria-checked',
        'true'
      )
    })

    test('take sample button works', async ({ page }) => {
      // Initially no sample
      await expect(page.getByText('Click "Take Sample" to begin')).toBeVisible()

      // Click take sample
      await page.locator('[data-testid="take-sample-btn"]').click()

      // Should now show sample results
      await expect(page.locator('[data-testid="sample-n"]')).toBeVisible()
      await expect(page.locator('[data-testid="sample-mean"]')).toBeVisible()
    })

    test('sample size slider updates value', async ({ page }) => {
      const slider = page.locator('[data-testid="sample-size-slider"]')
      const input = page.locator('[data-testid="sample-size-input"]')

      // Change slider value
      await slider.fill('50')

      // Input should update
      await expect(input).toHaveValue('50')
    })

    test('take multiple samples builds distribution', async ({ page }) => {
      const distribution = page.locator('[data-testid="sampling-distribution"]')
      await expect(distribution).toBeVisible()

      // Take 10 samples
      await page.locator('[data-testid="take-10-btn"]').click()

      // Wait for histogram bars to appear
      await expect(page.locator('[data-testid="histogram-bars"]')).toBeVisible()

      // Should show sample count
      await expect(page.getByText(/10 samples/)).toBeVisible()
    })

    test('reset button clears samples', async ({ page }) => {
      // Take some samples first
      await page.locator('[data-testid="take-10-btn"]').click()
      await expect(page.getByText(/10 samples/)).toBeVisible()

      // Click reset
      await page.locator('[data-testid="reset-btn"]').click()

      // Should show empty state again
      await expect(page.getByText('Click "Take Sample" to begin')).toBeVisible()
    })

    test('presets load correctly', async ({ page }) => {
      const presets = page.locator('[data-testid="sampling-presets"]')
      await expect(presets).toBeVisible()

      // Click user survey preset
      await page.locator('[data-testid="preset-user-survey"]').click()

      // Population should regenerate (check for grid)
      await expect(page.locator('[data-testid="population-grid"]')).toBeVisible()
    })
  })

  test.describe('Confidence Interval Demo', () => {
    test('CI simulation runs and shows coverage', async ({ page }) => {
      const ciDemo = page.locator('[data-testid="ci-demo"]')
      await expect(ciDemo).toBeVisible()

      // Run 10 CIs
      await page.locator('[data-testid="run-10-ci"]').click()

      // Should show CI bars
      await expect(page.locator('[data-testid="ci-bar"]').first()).toBeVisible()

      // Should show coverage statistics
      await expect(page.locator('[data-testid="actual-coverage"]')).toBeVisible()
    })

    test('CI demo reset works', async ({ page }) => {
      // Run some CIs
      await page.locator('[data-testid="run-10-ci"]').click()
      await expect(page.locator('[data-testid="ci-bar"]').first()).toBeVisible()

      // Reset
      await page.locator('[data-testid="reset-ci"]').click()

      // Should show empty state
      await expect(page.getByText(/Click "\+10 CIs" to start/)).toBeVisible()
    })

    test('shows true mean line', async ({ page }) => {
      await page.locator('[data-testid="run-10-ci"]').click()
      await expect(page.locator('[data-testid="true-mean-line"]')).toHaveCount(1)
    })
  })

  test.describe('Bootstrap Panel', () => {
    test('bootstrap requires sample first', async ({ page }) => {
      const bootstrap = page.locator('[data-testid="bootstrap-panel"]')
      await expect(bootstrap).toBeVisible()

      // Should show message to take sample first
      await expect(page.getByText(/Take a sample first/)).toBeVisible()
    })

    test('bootstrap runs after sample taken', async ({ page }) => {
      // Take a sample first
      await page.locator('[data-testid="take-sample-btn"]').click()
      await expect(page.locator('[data-testid="sample-mean"]')).toBeVisible()

      // Run bootstrap
      await page.locator('[data-testid="run-bootstrap-btn"]').click()

      // Should show results
      await expect(page.locator('[data-testid="bootstrap-original"]')).toBeVisible()
      await expect(page.locator('[data-testid="bootstrap-se"]')).toBeVisible()
      await expect(page.locator('[data-testid="bootstrap-ci-lower"]')).toBeVisible()
      await expect(page.locator('[data-testid="bootstrap-ci-upper"]')).toBeVisible()
    })
  })

  test.describe('Sample Size Calculator', () => {
    test('calculator shows results for mean estimation', async ({ page }) => {
      const calculator = page.locator('[data-testid="sample-size-calculator"]')
      await expect(calculator).toBeVisible()

      // Default tab should be "Estimating Mean"
      await expect(page.getByText('Estimating Mean', { exact: true })).toBeVisible()

      // Should show calculated sample size
      await expect(page.locator('[data-testid="sample-size-mean-result"]')).toBeVisible()
    })

    test('calculator switches between mean and proportion tabs', async ({ page }) => {
      // Click proportion tab
      await page.getByText('Estimating Proportion', { exact: true }).click()

      // Should show proportion inputs
      await expect(page.locator('[data-testid="proportion-input"]')).toBeVisible()

      // Should show proportion result
      await expect(page.locator('[data-testid="sample-size-prop-result"]')).toBeVisible()
    })
  })

  test.describe('Accessibility', () => {
    test('passes axe accessibility audit', async ({ page }) => {
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .exclude('[data-testid="population-grid"]') // Exclude grid visualization
        .analyze()

      expect(results.violations).toEqual([])
    })

    test('sampling method selector has proper ARIA', async ({ page }) => {
      const selector = page.locator('[data-testid="sampling-method-selector"]')
      await expect(selector.getByRole('radiogroup')).toBeVisible()

      // Each method button should be a radio
      const methods = ['simple', 'stratified', 'systematic', 'cluster']
      for (const method of methods) {
        const btn = page.locator(`[data-testid="method-${method}"]`)
        await expect(btn).toHaveAttribute('role', 'radio')
      }
    })

    test('population grid has descriptive aria-label', async ({ page }) => {
      const grid = page.locator('[data-testid="population-grid"]').locator('[role="img"]')
      const label = await grid.getAttribute('aria-label')
      expect(label).toContain('Population grid')
    })

    test('buttons are keyboard accessible', async ({ page }) => {
      // Tab to take sample button and press Enter
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')

      // Focus should be on some button (preset or method)
      const focused = page.locator(':focus')
      const tagName = await focused.evaluate((el) => el.tagName.toLowerCase())
      expect(['button', 'a', 'input']).toContain(tagName)
    })
  })

  test.describe('URL State Sync', () => {
    test('URL updates when sampling method changes', async ({ page }) => {
      // Click stratified method
      await page.locator('[data-testid="method-stratified"]').click()

      // Wait for URL to update
      await page.waitForTimeout(400) // Debounce is 300ms

      // URL should contain method param
      const url = page.url()
      expect(url).toContain('method=stratified')
    })

    test('URL updates when sample size changes', async ({ page }) => {
      // Change sample size
      await page.locator('[data-testid="sample-size-slider"]').fill('75')

      // Wait for URL to update
      await page.waitForTimeout(400)

      // URL should contain n param
      const url = page.url()
      expect(url).toContain('n=75')
    })

    test('loads state from URL parameters', async ({ page }) => {
      // Navigate with URL params
      await page.goto('/statistics/sampling?method=systematic&n=45')

      // Wait for widget
      await page.waitForSelector('[data-testid="sampling-simulator"]')

      // Check method is selected
      await expect(page.locator('[data-testid="method-systematic"]')).toHaveAttribute(
        'aria-checked',
        'true'
      )

      // Check sample size
      await expect(page.locator('[data-testid="sample-size-input"]')).toHaveValue('45')
    })
  })

  test.describe('Mobile Responsiveness', () => {
    test('works on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      // Widget should still be visible
      await expect(page.locator('[data-testid="sampling-simulator"]')).toBeVisible()

      // Buttons should be clickable
      await page.locator('[data-testid="take-sample-btn"]').click()
      await expect(page.locator('[data-testid="sample-mean"]')).toBeVisible()
    })

    test('method buttons stack on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      const selector = page.locator('[data-testid="sampling-method-selector"]')
      await expect(selector).toBeVisible()

      // All method buttons should still be visible
      await expect(page.locator('[data-testid="method-simple"]')).toBeVisible()
      await expect(page.locator('[data-testid="method-stratified"]')).toBeVisible()
      await expect(page.locator('[data-testid="method-systematic"]')).toBeVisible()
      await expect(page.locator('[data-testid="method-cluster"]')).toBeVisible()
    })
  })
})
