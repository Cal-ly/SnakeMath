import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// Base path for the app (matches vite.config.ts base)
const BASE = '/SnakeMath'

test.describe('DistributionExplorer Widget @e2e', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/statistics/distributions`)
    await page.waitForLoadState('networkidle')
  })

  test('page loads with distribution explorer visible', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Probability Distributions')
    await expect(page.locator('[data-testid="distribution-explorer"]')).toBeVisible()
  })

  test('displays default normal distribution', async ({ page }) => {
    // Normal distribution tab should be selected by default
    await expect(page.locator('[data-testid="distribution-tab-normal"]')).toHaveAttribute(
      'aria-selected',
      'true'
    )

    // Chart should be visible
    await expect(page.locator('[data-testid="distribution-chart"]')).toBeVisible()

    // PDF curve should be rendered
    await expect(page.locator('[data-testid="pdf-curve"]')).toHaveCount(1)
  })

  test('switching distribution types works', async ({ page }) => {
    // Click on Binomial tab
    await page.locator('[data-testid="distribution-tab-binomial"]').click()
    await page.waitForTimeout(200)

    // Binomial should now be selected
    await expect(page.locator('[data-testid="distribution-tab-binomial"]')).toHaveAttribute(
      'aria-selected',
      'true'
    )

    // Should show PMF bars for discrete distribution
    await expect(page.locator('[data-testid="pmf-bar-0"]')).toBeVisible()

    // Switch to Poisson
    await page.locator('[data-testid="distribution-tab-poisson"]').click()
    await page.waitForTimeout(200)

    await expect(page.locator('[data-testid="distribution-tab-poisson"]')).toHaveAttribute(
      'aria-selected',
      'true'
    )

    // Switch to Exponential
    await page.locator('[data-testid="distribution-tab-exponential"]').click()
    await page.waitForTimeout(200)

    await expect(page.locator('[data-testid="distribution-tab-exponential"]')).toHaveAttribute(
      'aria-selected',
      'true'
    )

    // Switch to Uniform
    await page.locator('[data-testid="distribution-tab-uniform"]').click()
    await page.waitForTimeout(200)

    await expect(page.locator('[data-testid="distribution-tab-uniform"]')).toHaveAttribute(
      'aria-selected',
      'true'
    )
  })

  test('parameter controls update visualization', async ({ page }) => {
    // Get initial mu display
    const muSlider = page.locator('[data-testid="param-slider-mu"]')
    await expect(muSlider).toBeVisible()

    // Change mu value using input
    const muInput = page.locator('[data-testid="param-input-mu"]')
    await muInput.fill('2')
    await page.waitForTimeout(300) // Wait for debounce

    // Mean line should have shifted (hard to test exact position)
    await expect(page.locator('[data-testid="mean-line"]')).toHaveCount(1)
  })

  test('probability calculator computes P(X <= x)', async ({ page }) => {
    // Find probability calculator
    const probCalc = page.locator('[data-testid="probability-calculator"]')
    await expect(probCalc).toBeVisible()

    // Set value for P(X <= x)
    const bInput = page.locator('[data-testid="prob-calc-input-b"]')
    await bInput.fill('1.96')
    await page.waitForTimeout(300)

    // Check result - should be approximately 0.975 for standard normal
    const result = page.locator('[data-testid="prob-calc-result"]')
    await expect(result).toContainText(/0\.97/)
  })

  test('probability calculator switches to interval mode', async ({ page }) => {
    // Switch to interval mode
    await page.locator('[data-testid="prob-calc-mode-between"]').click()
    await page.waitForTimeout(100)

    // Both a and b inputs should be visible
    await expect(page.locator('[data-testid="prob-calc-input-a"]')).toBeVisible()
    await expect(page.locator('[data-testid="prob-calc-input-b"]')).toBeVisible()

    // Set interval [-1, 1]
    await page.locator('[data-testid="prob-calc-input-a"]').fill('-1')
    await page.locator('[data-testid="prob-calc-input-b"]').fill('1')
    await page.waitForTimeout(300)

    // Check result - should be approximately 0.683 for standard normal
    const result = page.locator('[data-testid="prob-calc-result"]')
    await expect(result).toContainText(/0\.68/)
  })

  test('sample histogram generates samples', async ({ page }) => {
    // Find sample histogram section
    const sampleSection = page.locator('[data-testid="sample-histogram"]')
    await expect(sampleSection).toBeVisible()

    // Click generate samples button
    await page.locator('[data-testid="generate-samples-btn"]').click()
    await page.waitForTimeout(300)

    // Sample count should be displayed
    await expect(page.locator('[data-testid="sample-count"]')).not.toContainText('0')

    // Histogram should have bars
    await expect(page.locator('[data-testid="sample-bar-0"]')).toBeVisible()
  })

  test('sample histogram clear button works', async ({ page }) => {
    // Generate samples first
    await page.locator('[data-testid="generate-samples-btn"]').click()
    await page.waitForTimeout(200)

    // Clear samples
    await page.locator('[data-testid="clear-samples-btn"]').click()
    await page.waitForTimeout(100)

    // Sample count should be 0
    await expect(page.locator('[data-testid="sample-count"]')).toContainText('0')
  })

  test('presets load correctly', async ({ page }) => {
    // Click IQ Scores preset
    await page.locator('[data-testid="preset-iq-scores"]').click()
    await page.waitForTimeout(300)

    // Should switch to normal distribution with μ=100, σ=15
    await expect(page.locator('[data-testid="distribution-tab-normal"]')).toHaveAttribute(
      'aria-selected',
      'true'
    )

    // Parameter inputs should show the preset values
    await expect(page.locator('[data-testid="param-input-mu"]')).toHaveValue('100')
    await expect(page.locator('[data-testid="param-input-sigma"]')).toHaveValue('15')
  })

  test('preset for binomial distribution loads', async ({ page }) => {
    // Click Coin Flips preset
    await page.locator('[data-testid="preset-coin-flips"]').click()
    await page.waitForTimeout(300)

    // Should switch to binomial distribution
    await expect(page.locator('[data-testid="distribution-tab-binomial"]')).toHaveAttribute(
      'aria-selected',
      'true'
    )

    // Should show PMF bars
    await expect(page.locator('[data-testid="pmf-bar-0"]')).toBeVisible()
  })

  test('distribution info panel shows statistics', async ({ page }) => {
    // Check that stats are displayed
    await expect(page.locator('[data-testid="stat-mean"]')).toBeVisible()
    await expect(page.locator('[data-testid="stat-variance"]')).toBeVisible()
    await expect(page.locator('[data-testid="stat-stddev"]')).toBeVisible()
  })

  test('URL state sync works', async ({ page }) => {
    // Switch to binomial
    await page.locator('[data-testid="distribution-tab-binomial"]').click()
    await page.waitForTimeout(500)

    // URL should contain distribution parameter
    await expect(page).toHaveURL(/dist=binomial/)

    // Navigate directly with URL params
    await page.goto(`${BASE}/statistics/distributions?dist=poisson&lambda=10`)
    await page.waitForLoadState('networkidle')

    // Poisson should be selected
    await expect(page.locator('[data-testid="distribution-tab-poisson"]')).toHaveAttribute(
      'aria-selected',
      'true'
    )
  })
})

test.describe('CLT Demonstration @e2e', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/statistics/distributions`)
    await page.waitForLoadState('networkidle')
  })

  test('CLT demonstration panel is visible', async ({ page }) => {
    await expect(page.locator('[data-testid="clt-demonstration"]')).toBeVisible()
  })

  test('CLT demo takes samples', async ({ page }) => {
    // Click take samples button
    await page.locator('[data-testid="clt-take-samples-btn"]').click()
    await page.waitForTimeout(300)

    // Sample count should be non-zero
    const sampleCount = page.locator('[data-testid="clt-sample-count"]')
    await expect(sampleCount).not.toContainText('0')
  })

  test('CLT demo source distribution can be changed', async ({ page }) => {
    // Change source distribution
    await page.locator('[data-testid="clt-source-select"]').selectOption('exponential')
    await page.waitForTimeout(100)

    // Take samples
    await page.locator('[data-testid="clt-take-samples-btn"]').click()
    await page.waitForTimeout(300)

    // Should have samples
    await expect(page.locator('[data-testid="clt-sample-count"]')).not.toContainText('0')
  })

  test('CLT demo sample size slider works', async ({ page }) => {
    // Change sample size
    const slider = page.locator('[data-testid="clt-sample-size-slider"]')
    await slider.fill('50')
    await page.waitForTimeout(100)

    // Take samples
    await page.locator('[data-testid="clt-take-samples-btn"]').click()
    await page.waitForTimeout(300)

    await expect(page.locator('[data-testid="clt-sample-count"]')).not.toContainText('0')
  })

  test('CLT demo reset button works', async ({ page }) => {
    // Take samples first
    await page.locator('[data-testid="clt-take-samples-btn"]').click()
    await page.waitForTimeout(200)

    // Reset
    await page.locator('[data-testid="clt-reset-btn"]').click()
    await page.waitForTimeout(100)

    // Sample count should be 0
    await expect(page.locator('[data-testid="clt-sample-count"]')).toContainText('0')
  })

  test('CLT demo auto-run works', async ({ page }) => {
    // Start auto-run
    await page.locator('[data-testid="clt-auto-run-btn"]').click()
    await page.waitForTimeout(500)

    // Should have accumulated samples
    const countText = await page.locator('[data-testid="clt-sample-count"]').textContent()
    const count = parseInt(countText || '0')
    expect(count).toBeGreaterThan(10)

    // Stop auto-run
    await page.locator('[data-testid="clt-auto-run-btn"]').click()
  })

  test('CLT histogram shows normal curve after enough samples', async ({ page }) => {
    // Take multiple batches
    for (let i = 0; i < 5; i++) {
      await page.locator('[data-testid="clt-take-samples-btn"]').click()
      await page.waitForTimeout(150)
    }

    // Normal curve should be visible
    await expect(page.locator('[data-testid="clt-normal-curve"]')).toHaveCount(1)
  })
})

test.describe('Distribution Explorer Accessibility @a11y', () => {
  test('passes accessibility audit', async ({ page }) => {
    await page.goto(`${BASE}/statistics/distributions`)
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .exclude('[role="img"]') // Exclude SVG charts from color contrast checks
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('distribution tabs are keyboard navigable', async ({ page }) => {
    await page.goto(`${BASE}/statistics/distributions`)
    await page.waitForLoadState('networkidle')

    // Focus on first tab
    await page.locator('[data-testid="distribution-tab-normal"]').focus()

    // Navigate with arrow keys
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('[data-testid="distribution-tab-binomial"]')).toBeFocused()

    // Select with Enter
    await page.keyboard.press('Enter')
    await expect(page.locator('[data-testid="distribution-tab-binomial"]')).toHaveAttribute(
      'aria-selected',
      'true'
    )
  })

  test('charts have appropriate aria labels', async ({ page }) => {
    await page.goto(`${BASE}/statistics/distributions`)
    await page.waitForLoadState('networkidle')

    // Main chart should have aria-label
    const chart = page.locator('[data-testid="distribution-chart"] svg')
    await expect(chart).toHaveAttribute('aria-label', /Probability density function/)
  })
})

test.describe('Distribution Explorer Content Page @e2e', () => {
  test('content sections render correctly', async ({ page }) => {
    await page.goto(`${BASE}/statistics/distributions`)
    await page.waitForLoadState('networkidle')

    // Main sections should be visible
    await expect(page.locator('text=What are Probability Distributions')).toBeVisible()
    await expect(page.locator('text=Discrete vs Continuous')).toBeVisible()
    await expect(page.locator('text=Central Limit Theorem')).toBeVisible()
  })

  test('collapsible sections expand and collapse', async ({ page }) => {
    await page.goto(`${BASE}/statistics/distributions`)
    await page.waitForLoadState('networkidle')

    // Find a collapsed section (binomial is collapsed by default)
    const binomialSection = page.locator('text=Binomial Distribution').first()
    await binomialSection.click()
    await page.waitForTimeout(200)

    // Content should now be visible
    await expect(page.locator('text=fixed number of independent trials')).toBeVisible()
  })

  test('code examples are present', async ({ page }) => {
    await page.goto(`${BASE}/statistics/distributions`)
    await page.waitForLoadState('networkidle')

    // Code examples should have copy buttons
    await expect(page.locator('[data-testid="code-example-statistics-distributions-normal"]')).toBeVisible()
  })

  test('related topics section exists', async ({ page }) => {
    await page.goto(`${BASE}/statistics/distributions`)
    await page.waitForLoadState('networkidle')

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(300)

    // Related topics should include descriptive statistics
    await expect(page.locator('text=Descriptive Statistics')).toBeVisible()
  })

  test('three analogies block is present', async ({ page }) => {
    await page.goto(`${BASE}/statistics/distributions`)
    await page.waitForLoadState('networkidle')

    // All three analogy types should be visible
    await expect(page.locator('text=Everyday Analogy')).toBeVisible()
    await expect(page.locator('text=Programming Analogy')).toBeVisible()
    await expect(page.locator('text=Visual Intuition')).toBeVisible()
  })

  test('common pitfalls callout is present', async ({ page }) => {
    await page.goto(`${BASE}/statistics/distributions`)
    await page.waitForLoadState('networkidle')

    // Common pitfall about discrete vs continuous
    await expect(page.locator('text=Confusing Discrete and Continuous')).toBeVisible()
  })
})

test.describe('Statistics Index Updated @e2e', () => {
  test('distributions link appears in statistics index', async ({ page }) => {
    await page.goto(`${BASE}/statistics`)
    await page.waitForLoadState('networkidle')

    // Should have link to distributions
    const distributionsLink = page.locator('a[href*="distributions"]').first()
    await expect(distributionsLink).toBeVisible()

    // Click and navigate
    await distributionsLink.click()
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveURL(/distributions/)
  })

  test('distributions removed from coming soon', async ({ page }) => {
    await page.goto(`${BASE}/statistics`)
    await page.waitForLoadState('networkidle')

    // Coming soon section should NOT contain probability distributions
    const comingSoon = page.locator('text=Coming Soon').locator('..')
    await expect(comingSoon.locator('text=Probability Distributions')).not.toBeVisible()
  })
})
