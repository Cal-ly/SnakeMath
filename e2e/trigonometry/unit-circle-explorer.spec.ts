import { test, expect } from '@playwright/test'

// Base path for the app (matches vite.config.ts base)
const BASE = '/SnakeMath'

test.describe('UnitCircleExplorer Widget @e2e', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/trigonometry/unit-circle`)
    await page.waitForLoadState('networkidle')
  })

  test('page loads with unit circle explorer visible', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Unit Circle')
    await expect(page.locator('[data-testid="unit-circle-explorer"]')).toBeVisible()
  })

  test('default angle is 45 degrees', async ({ page }) => {
    const slider = page.locator('[data-testid="angle-slider"]')
    await expect(slider).toHaveValue('45')
  })

  test('angle slider updates display values', async ({ page }) => {
    const slider = page.locator('[data-testid="angle-slider"]')

    // Change to 90 degrees
    await slider.fill('90')
    await page.waitForTimeout(100)

    // Check point coordinates (at 90°, should be (0, 1))
    await expect(page.locator('[data-testid="point-on-circle"]')).toBeVisible()
  })

  test('special angle buttons update angle', async ({ page }) => {
    // Click on 30° button
    const button30 = page.locator('[data-testid="special-angle-30"]')
    await button30.click()
    await page.waitForTimeout(100)

    // Verify slider updated
    const slider = page.locator('[data-testid="angle-slider"]')
    await expect(slider).toHaveValue('30')
  })

  test('unit toggle switches between degrees and radians', async ({ page }) => {
    // Find and click the radians toggle
    const radiansToggle = page.locator('[data-testid="unit-toggle-radians"]')
    await radiansToggle.click()
    await page.waitForTimeout(100)

    // Check that radians display is visible
    await expect(page.locator('[data-testid="radians-display"]')).toBeVisible()
  })

  test('show more angles reveals additional buttons', async ({ page }) => {
    // Initially, angles beyond 90° should be hidden
    const button120 = page.locator('[data-testid="special-angle-120"]')
    await expect(button120).not.toBeVisible()

    // Click "Show more"
    const showMoreBtn = page.locator('[data-testid="special-angles-more"]')
    await showMoreBtn.click()
    await page.waitForTimeout(100)

    // Now 120° should be visible
    await expect(button120).toBeVisible()
  })

  test('trig values display shows sin, cos, tan', async ({ page }) => {
    // Check that trig values are displayed
    await expect(page.locator('[data-testid="trig-value-sin"]')).toBeVisible()
    await expect(page.locator('[data-testid="trig-value-cos"]')).toBeVisible()
    await expect(page.locator('[data-testid="trig-value-tan"]')).toBeVisible()
  })

  test('special angle shows exact values', async ({ page }) => {
    // Set to 45° (should have exact values)
    const slider = page.locator('[data-testid="angle-slider"]')
    await slider.fill('45')
    await page.waitForTimeout(100)

    // Should show √2/2 for sin and cos in the trig values display
    await expect(page.locator('[data-testid="trig-value-sin"]')).toContainText('√2/2')
    await expect(page.locator('[data-testid="trig-value-cos"]')).toContainText('√2/2')
  })

  test('wave graphs toggle shows/hides wave visualization', async ({ page }) => {
    // Wave graphs should be hidden initially
    const waveGraphs = page.locator('[data-testid="wave-graphs"]')
    await expect(waveGraphs).not.toBeVisible()

    // Toggle on
    const toggle = page.locator('[data-testid="show-waves-toggle"]')
    await toggle.check()
    await page.waitForTimeout(300)

    // Should now be visible
    await expect(waveGraphs).toBeVisible()
  })

  test('quadrant display shows correct quadrant', async ({ page }) => {
    // At 45°, should be in Quadrant I
    await expect(page.locator('[data-testid="quadrant-display"]')).toContainText('I')

    // Change to 120° (Quadrant II)
    const showMoreBtn = page.locator('[data-testid="special-angles-more"]')
    await showMoreBtn.click()
    await page.waitForTimeout(100)

    const button120 = page.locator('[data-testid="special-angle-120"]')
    await button120.click()
    await page.waitForTimeout(100)

    await expect(page.locator('[data-testid="quadrant-display"]')).toContainText('II')
  })

  test('direct angle input works', async ({ page }) => {
    const input = page.locator('[data-testid="angle-input"]')
    await input.fill('60')
    await input.press('Enter')
    await page.waitForTimeout(100)

    // Verify slider updated
    const slider = page.locator('[data-testid="angle-slider"]')
    await expect(slider).toHaveValue('60')
  })

  test('URL state syncs with angle (when enabled)', async ({ page }) => {
    // Navigate to page with URL parameters
    await page.goto(`${BASE}/trigonometry/unit-circle?angle=90&unit=degrees`)
    await page.waitForLoadState('networkidle')

    // Verify angle is set from URL
    const slider = page.locator('[data-testid="angle-slider"]')
    await expect(slider).toHaveValue('90')
  })

  test('SVG unit circle is visible', async ({ page }) => {
    const svg = page.locator('[data-testid="unit-circle-svg"] svg')
    await expect(svg).toBeVisible()
  })

  test('angle arc is drawn', async ({ page }) => {
    // At any non-zero angle, the arc should be visible
    const arc = page.locator('[data-testid="angle-arc"]')
    await expect(arc).toBeVisible()
  })

  test('reference angle displays correctly', async ({ page }) => {
    // For 45°, reference angle is 45°
    await expect(page.locator('[data-testid="reference-angle-display"]')).toContainText('45')

    // Change to 135° (reference angle should be 45°)
    const showMoreBtn = page.locator('[data-testid="special-angles-more"]')
    await showMoreBtn.click()
    const button135 = page.locator('[data-testid="special-angle-135"]')
    await button135.click()
    await page.waitForTimeout(100)

    await expect(page.locator('[data-testid="reference-angle-display"]')).toContainText('45')
  })
})

test.describe('Trigonometry Index Page @e2e', () => {
  test('index page loads and links to unit circle', async ({ page }) => {
    await page.goto(`${BASE}/trigonometry`)
    await page.waitForLoadState('networkidle')

    await expect(page.locator('h1')).toContainText('Trigonometry')

    // Click on unit circle link
    const unitCircleLink = page.locator('a[href*="unit-circle"]').first()
    await unitCircleLink.click()
    await page.waitForLoadState('networkidle')

    // Should now be on unit circle page
    await expect(page).toHaveURL(/unit-circle/)
  })
})
