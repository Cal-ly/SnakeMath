import { test, expect } from '@playwright/test'

// Base path for the app (matches vite.config.ts base)
const BASE = '/SnakeMath'

test.describe('StatisticsCalculator Widget @e2e', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/statistics/descriptive`)
    await page.waitForLoadState('networkidle')
  })

  test('page loads with statistics calculator visible', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Descriptive Statistics')
    await expect(page.locator('[data-testid="statistics-calculator"]')).toBeVisible()
  })

  test('displays default dataset (test-scores)', async ({ page }) => {
    // Test-scores has 15 values
    await expect(page.locator('[data-testid="stat-count"]')).toContainText('15')
    await expect(page.locator('[data-testid="stat-mean"]')).toBeVisible()
  })

  test('switching dataset updates statistics', async ({ page }) => {
    // Switch to salaries dataset
    await page.locator('[data-testid="dataset-salaries"]').click()
    await page.waitForTimeout(200)

    // Salaries dataset has 12 values
    await expect(page.locator('[data-testid="stat-count"]')).toContainText('12')

    // Salaries dataset has outlier at 120
    await expect(page.locator('[data-testid="outliers-list"]')).toContainText('120')
  })

  test('custom data input works', async ({ page }) => {
    // Switch to custom mode
    await page.locator('[data-testid="dataset-custom"]').click()
    await page.waitForTimeout(100)

    // Enter custom data
    await page.locator('[data-testid="custom-data-input"]').fill('1, 2, 3, 4, 5')
    await page.locator('[data-testid="custom-data-apply"]').click()
    await page.waitForTimeout(200)

    // Check statistics
    await expect(page.locator('[data-testid="stat-mean"]')).toContainText('3')
    await expect(page.locator('[data-testid="stat-median"]')).toContainText('3')
    await expect(page.locator('[data-testid="stat-count"]')).toContainText('5')
  })

  test('invalid custom data shows error', async ({ page }) => {
    // Switch to custom mode
    await page.locator('[data-testid="dataset-custom"]').click()
    await page.waitForTimeout(100)

    // Enter invalid data
    await page.locator('[data-testid="custom-data-input"]').fill('abc, def')
    await page.locator('[data-testid="custom-data-apply"]').click()
    await page.waitForTimeout(100)

    // Should show validation error
    await expect(page.locator('[data-testid="data-validation-message"]')).toBeVisible()
  })

  test('bin count slider updates histogram', async ({ page }) => {
    const slider = page.locator('[data-testid="bin-count-slider"]')

    // Change bin count
    await slider.fill('5')
    await page.waitForTimeout(100)

    // Verify bin count display updated
    await expect(page.locator('[data-testid="bin-count-value"]')).toContainText('5')
  })

  test('box plot shows outliers for salary data', async ({ page }) => {
    // Switch to salaries dataset
    await page.locator('[data-testid="dataset-salaries"]').click()
    await page.waitForTimeout(200)

    // Check outliers panel shows 120 as an outlier
    await expect(page.locator('[data-testid="outliers-list"]')).toContainText('120')
    // There are 2 outliers (75 and 120) based on IQR calculation
    await expect(page.locator('[data-testid="outliers-count"]')).toContainText('2')
  })

  test('symmetric dataset shows symmetric skewness', async ({ page }) => {
    // Switch to symmetric dataset
    await page.locator('[data-testid="dataset-symmetric"]').click()
    await page.waitForTimeout(200)

    // Should show symmetric interpretation
    await expect(page.locator('[data-testid="skewness-interpretation"]')).toContainText('Symmetric')
  })

  test('URL state sync works', async ({ page }) => {
    // Switch to heights dataset
    await page.locator('[data-testid="dataset-heights"]').click()
    await page.waitForTimeout(500)

    // URL should contain dataset parameter
    await expect(page).toHaveURL(/dataset=heights/)

    // Navigate directly with URL param
    await page.goto(`${BASE}/statistics/descriptive?dataset=salaries`)
    await page.waitForLoadState('networkidle')

    // Salaries dataset has 12 values
    await expect(page.locator('[data-testid="stat-count"]')).toContainText('12')
  })

  test('quartiles display correctly', async ({ page }) => {
    await expect(page.locator('[data-testid="stat-q1"]')).toBeVisible()
    await expect(page.locator('[data-testid="stat-q2"]')).toBeVisible()
    await expect(page.locator('[data-testid="stat-q3"]')).toBeVisible()
    await expect(page.locator('[data-testid="stat-iqr"]')).toBeVisible()
  })

  test('histogram chart renders', async ({ page }) => {
    await expect(page.locator('[data-testid="histogram-chart"]')).toBeVisible()
    // Check that at least one bar is rendered
    await expect(page.locator('[data-testid="histogram-bar-0"]')).toBeVisible()
  })

  test('box plot chart renders', async ({ page }) => {
    await expect(page.locator('[data-testid="boxplot-chart"]')).toBeVisible()
    await expect(page.locator('[data-testid="boxplot-box"]')).toBeVisible()
    // SVG line elements may report as hidden, check that the element exists
    await expect(page.locator('[data-testid="boxplot-median"]')).toHaveCount(1)
  })

  test('all preset buttons are visible', async ({ page }) => {
    await expect(page.locator('[data-testid="dataset-test-scores"]')).toBeVisible()
    await expect(page.locator('[data-testid="dataset-heights"]')).toBeVisible()
    await expect(page.locator('[data-testid="dataset-salaries"]')).toBeVisible()
    await expect(page.locator('[data-testid="dataset-reaction-times"]')).toBeVisible()
    await expect(page.locator('[data-testid="dataset-symmetric"]')).toBeVisible()
    await expect(page.locator('[data-testid="dataset-custom"]')).toBeVisible()
  })

  test('spread statistics display correctly', async ({ page }) => {
    await expect(page.locator('[data-testid="stat-variance"]')).toBeVisible()
    await expect(page.locator('[data-testid="stat-stddev"]')).toBeVisible()
    await expect(page.locator('[data-testid="stat-range"]')).toBeVisible()
  })
})

test.describe('Statistics Index Page @e2e', () => {
  test('index page loads and links to descriptive stats', async ({ page }) => {
    await page.goto(`${BASE}/statistics`)
    await page.waitForLoadState('networkidle')

    await expect(page.locator('h1')).toContainText('Statistics')

    // Click on descriptive statistics link
    const descriptiveLink = page.locator('a[href*="descriptive"]').first()
    await descriptiveLink.click()
    await page.waitForLoadState('networkidle')

    // Should now be on descriptive stats page
    await expect(page).toHaveURL(/descriptive/)
  })

  test('index page shows all topic sections', async ({ page }) => {
    await page.goto(`${BASE}/statistics`)
    await page.waitForLoadState('networkidle')

    // Check for key sections
    await expect(page.locator('text=Statistics for Programmers')).toBeVisible()
    await expect(page.locator('text=Three Pillars')).toBeVisible()
    await expect(page.locator('text=Coming Soon')).toBeVisible()
  })
})
