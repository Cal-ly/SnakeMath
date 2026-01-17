import { test, expect } from '@playwright/test'

// Base path for the app (matches vite.config.ts base)
const BASE = '/SnakeMath'

test.describe('MatrixTransformations Widget @e2e', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/linear-algebra/matrices`)
    await page.waitForLoadState('networkidle')
  })

  test('page loads successfully', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Matrices')
  })

  test('widget is visible', async ({ page }) => {
    const widget = page.locator('[data-testid="matrix-transformations"]')
    await expect(widget).toBeVisible()
  })

  test('transformation canvas is visible', async ({ page }) => {
    const canvas = page.locator('[data-testid="transformation-canvas"]')
    await expect(canvas).toBeVisible()
  })

  test('can select rotation transformation', async ({ page }) => {
    await page.locator('[data-testid="transform-rotation"]').click()

    // Angle slider should appear
    const angleSlider = page.locator('[data-testid="angle-slider"]')
    await expect(angleSlider).toBeVisible()
  })

  test('rotation angle slider updates matrix', async ({ page }) => {
    await page.locator('[data-testid="transform-rotation"]').click()

    // Get initial matrix display
    const matrixDisplay = page.locator('[data-testid="matrix-display"]')

    // Change angle to 90 degrees
    const angleSlider = page.locator('[data-testid="angle-slider"]')
    await angleSlider.fill('90')

    // Matrix should show 90° rotation values (0, -1, 1, 0)
    await expect(matrixDisplay).toContainText('0')
    await expect(matrixDisplay).toContainText('-1')
    await expect(matrixDisplay).toContainText('1')
  })

  test('can select scale transformation', async ({ page }) => {
    await page.locator('[data-testid="transform-scale"]').click()

    // Scale sliders should appear
    await expect(page.locator('[data-testid="scale-x-slider"]')).toBeVisible()
    await expect(page.locator('[data-testid="scale-y-slider"]')).toBeVisible()
  })

  test('uniform scale shows single slider', async ({ page }) => {
    await page.locator('[data-testid="transform-uniformScale"]').click()

    // Only X slider should be visible (controls both)
    await expect(page.locator('[data-testid="scale-x-slider"]')).toBeVisible()
    await expect(page.locator('[data-testid="scale-y-slider"]')).not.toBeVisible()
  })

  test('can select shear transformation', async ({ page }) => {
    await page.locator('[data-testid="transform-shearX"]').click()

    // Shear slider should appear
    await expect(page.locator('[data-testid="shear-slider"]')).toBeVisible()
  })

  test('identity shows no parameter controls', async ({ page }) => {
    await page.locator('[data-testid="transform-identity"]').click()

    // No sliders should be visible
    await expect(page.locator('[data-testid="angle-slider"]')).not.toBeVisible()
    await expect(page.locator('[data-testid="scale-x-slider"]')).not.toBeVisible()
    await expect(page.locator('[data-testid="shear-slider"]')).not.toBeVisible()
  })

  test('reflection shows negative determinant badge', async ({ page }) => {
    await page.locator('[data-testid="transform-reflectX"]').click()

    // Should show orientation reversing badge
    const badge = page.locator('[data-testid="badge-orientation-reversing"]')
    await expect(badge).toBeVisible()
  })

  test('preset selector loads preset', async ({ page }) => {
    const presetSelect = page.locator('[data-testid="preset-select"]')
    await presetSelect.selectOption('rotate-90')

    // Should switch to rotation with 90° angle
    await expect(page.locator('[data-testid="transform-rotation"]')).toHaveAttribute(
      'aria-pressed',
      'true'
    )
  })

  test('custom matrix input works', async ({ page }) => {
    // Click edit button
    await page.locator('[data-testid="edit-matrix-btn"]').click()

    // Fill in custom values
    await page.locator('[data-testid="matrix-a-input"]').fill('0')
    await page.locator('[data-testid="matrix-b-input"]').fill('1')
    await page.locator('[data-testid="matrix-c-input"]').fill('-1')
    await page.locator('[data-testid="matrix-d-input"]').fill('0')

    // Apply
    await page.locator('[data-testid="apply-matrix-btn"]').click()

    // Should be back to display mode
    const matrixDisplay = page.locator('[data-testid="matrix-display"]')
    await expect(matrixDisplay).toBeVisible()
  })

  test('cancel custom matrix edit', async ({ page }) => {
    await page.locator('[data-testid="edit-matrix-btn"]').click()
    await page.locator('[data-testid="cancel-matrix-btn"]').click()

    // Should be back to display mode
    await expect(page.locator('[data-testid="matrix-a-input"]')).not.toBeVisible()
  })

  test('all transformation type buttons are visible', async ({ page }) => {
    const types = [
      'identity',
      'rotation',
      'scale',
      'uniformScale',
      'shearX',
      'shearY',
      'reflectX',
      'reflectY',
    ]
    for (const type of types) {
      await expect(page.locator(`[data-testid="transform-${type}"]`)).toBeVisible()
    }
  })

  test('rotation preserves area (determinant = 1)', async ({ page }) => {
    await page.locator('[data-testid="transform-rotation"]').click()

    // Area preserving badge should be visible
    const badge = page.locator('[data-testid="badge-area-preserving"]')
    await expect(badge).toBeVisible()
  })

  test('rotation shows orthogonal badge', async ({ page }) => {
    await page.locator('[data-testid="transform-rotation"]').click()

    // Orthogonal badge should be visible
    const badge = page.locator('[data-testid="badge-orthogonal"]')
    await expect(badge).toBeVisible()
  })
})

test.describe('Matrix Transformations URL Sync @e2e', () => {
  test('rotation angle persists in URL', async ({ page }) => {
    await page.goto(`${BASE}/linear-algebra/matrices`)
    await page.waitForLoadState('networkidle')

    // Select rotation and set angle
    await page.locator('[data-testid="transform-rotation"]').click()
    await page.locator('[data-testid="angle-slider"]').fill('60')

    // Wait for URL update (debounced)
    await page.waitForTimeout(400)

    // Check URL contains angle
    expect(page.url()).toContain('type=rotation')
    expect(page.url()).toContain('angle=60')
  })

  test('loads state from URL', async ({ page }) => {
    // Navigate directly with query params
    await page.goto(`${BASE}/linear-algebra/matrices?type=rotation&angle=45`)
    await page.waitForLoadState('networkidle')

    // Rotation should be selected
    await expect(page.locator('[data-testid="transform-rotation"]')).toHaveAttribute(
      'aria-pressed',
      'true'
    )

    // Angle slider should show 45
    const angleSlider = page.locator('[data-testid="angle-slider"]')
    await expect(angleSlider).toHaveValue('45')
  })

  test('scale values persist in URL', async ({ page }) => {
    await page.goto(`${BASE}/linear-algebra/matrices`)
    await page.waitForLoadState('networkidle')

    // Select scale and adjust to a non-default value (default is 2)
    await page.locator('[data-testid="transform-scale"]').click()
    await page.locator('[data-testid="scale-x-slider"]').fill('1.5')

    // Wait for URL update (debounced)
    await page.waitForTimeout(400)

    // Check URL contains scale type and sx parameter (composable uses sx, not scaleX)
    expect(page.url()).toContain('type=scale')
    expect(page.url()).toContain('sx=1.5')
  })
})

test.describe('Linear Algebra Navigation @e2e', () => {
  test('linear algebra index page shows matrices link', async ({ page }) => {
    await page.goto(`${BASE}/linear-algebra`)
    await page.waitForLoadState('networkidle')

    // Should have link to matrices
    const matricesLink = page.locator('a[href*="/linear-algebra/matrices"]')
    await expect(matricesLink).toBeVisible()
  })

  test('can navigate from index to matrices page', async ({ page }) => {
    await page.goto(`${BASE}/linear-algebra`)
    await page.waitForLoadState('networkidle')

    // Click the matrices link
    await page.click('a[href*="/linear-algebra/matrices"]')

    // Should be on matrices page
    await expect(page.locator('h1')).toContainText('Matrices')
  })

  test('matrices page has collapsible sections', async ({ page }) => {
    await page.goto(`${BASE}/linear-algebra/matrices`)
    await page.waitForLoadState('networkidle')

    // Check that main sections exist
    await expect(page.locator('#introduction')).toBeVisible()
    await expect(page.locator('#explorer')).toBeVisible()
  })

  test('breadcrumbs show correct path', async ({ page }) => {
    await page.goto(`${BASE}/linear-algebra/matrices`)
    await page.waitForLoadState('networkidle')

    // Should have breadcrumb navigation
    const breadcrumbs = page.locator('[aria-label="Breadcrumb"]')
    await expect(breadcrumbs).toBeVisible()
    await expect(breadcrumbs).toContainText('Linear Algebra')
    await expect(breadcrumbs).toContainText('Matrices')
  })
})
