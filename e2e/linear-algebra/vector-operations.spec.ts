import { test, expect } from '@playwright/test'

// Base path for the app (matches vite.config.ts base)
const BASE = '/SnakeMath'

test.describe('VectorOperations Widget @e2e', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/linear-algebra/vectors`)
  })

  test('page loads successfully', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Vectors')
  })

  test('vector operations widget is visible', async ({ page }) => {
    const widget = page.locator('[data-testid="vector-operations"]')
    await expect(widget).toBeVisible()
  })

  test('vector A input accepts values', async ({ page }) => {
    const inputX = page.locator('[data-testid="vector-a-x"]')
    const inputY = page.locator('[data-testid="vector-a-y"]')

    await expect(inputX).toBeVisible()
    await expect(inputY).toBeVisible()

    // Clear and fill with new values
    await inputX.fill('4')
    await inputY.fill('3')

    // Verify values are set
    await expect(inputX).toHaveValue('4')
    await expect(inputY).toHaveValue('3')
  })

  test('vector B input accepts values', async ({ page }) => {
    const inputX = page.locator('[data-testid="vector-b-x"]')
    const inputY = page.locator('[data-testid="vector-b-y"]')

    await expect(inputX).toBeVisible()
    await expect(inputY).toBeVisible()

    await inputX.fill('2')
    await inputY.fill('5')

    await expect(inputX).toHaveValue('2')
    await expect(inputY).toHaveValue('5')
  })

  test('add operation shows correct result', async ({ page }) => {
    // Set vector A to (3, 2)
    await page.locator('[data-testid="vector-a-x"]').fill('3')
    await page.locator('[data-testid="vector-a-y"]').fill('2')

    // Set vector B to (1, 4)
    await page.locator('[data-testid="vector-b-x"]').fill('1')
    await page.locator('[data-testid="vector-b-y"]').fill('4')

    // Click add operation
    await page.locator('[data-testid="op-add"]').click()

    // Result should be (4, 6)
    const result = page.locator('[data-testid="result-value"]')
    await expect(result).toContainText('4')
    await expect(result).toContainText('6')
  })

  test('dot product operation shows correct result', async ({ page }) => {
    // Set vector A to (3, 2)
    await page.locator('[data-testid="vector-a-x"]').fill('3')
    await page.locator('[data-testid="vector-a-y"]').fill('2')

    // Set vector B to (1, 4)
    await page.locator('[data-testid="vector-b-x"]').fill('1')
    await page.locator('[data-testid="vector-b-y"]').fill('4')

    // Click dot product operation
    await page.locator('[data-testid="op-dot"]').click()

    // Result should be 3*1 + 2*4 = 11
    const result = page.locator('[data-testid="result-value"]')
    await expect(result).toContainText('11')
  })

  test('perpendicular preset shows zero dot product', async ({ page }) => {
    // Select perpendicular preset
    await page.locator('[data-testid="preset-select"]').selectOption('perpendicular')

    // Click dot product operation
    await page.locator('[data-testid="op-dot"]').click()

    // Perpendicular vectors have dot product = 0
    const result = page.locator('[data-testid="result-value"]')
    await expect(result).toContainText('0')

    // Should show perpendicular badge
    const badge = page.locator('[data-testid="perpendicular-badge"]')
    await expect(badge).toBeVisible()
  })

  test('parallel preset shows parallel badge', async ({ page }) => {
    // Select parallel preset
    await page.locator('[data-testid="preset-select"]').selectOption('parallel')

    // Should show parallel badge
    const badge = page.locator('[data-testid="parallel-badge"]')
    await expect(badge).toBeVisible()
  })

  test('swap vectors button works', async ({ page }) => {
    // Set initial vectors
    await page.locator('[data-testid="vector-a-x"]').fill('5')
    await page.locator('[data-testid="vector-a-y"]').fill('1')
    await page.locator('[data-testid="vector-b-x"]').fill('2')
    await page.locator('[data-testid="vector-b-y"]').fill('3')

    // Click swap button
    await page.locator('[data-testid="swap-vectors-btn"]').click()

    // Verify vectors are swapped
    await expect(page.locator('[data-testid="vector-a-x"]')).toHaveValue('2')
    await expect(page.locator('[data-testid="vector-a-y"]')).toHaveValue('3')
    await expect(page.locator('[data-testid="vector-b-x"]')).toHaveValue('5')
    await expect(page.locator('[data-testid="vector-b-y"]')).toHaveValue('1')
  })

  test('magnitude operation works', async ({ page }) => {
    // Set vector A to (3, 4) - classic 3-4-5 triangle
    await page.locator('[data-testid="vector-a-x"]').fill('3')
    await page.locator('[data-testid="vector-a-y"]').fill('4')

    // Click magnitude operation
    await page.locator('[data-testid="op-magnitude"]').click()

    // Result should be 5
    const result = page.locator('[data-testid="result-value"]')
    await expect(result).toContainText('5')
  })

  test('scalar multiplication shows input when selected', async ({ page }) => {
    // Click scalar operation
    await page.locator('[data-testid="op-scalar"]').click()

    // Scalar input should be visible
    const scalarInput = page.locator('[data-testid="scalar-input"]')
    await expect(scalarInput).toBeVisible()
  })

  test('angle operation shows degrees', async ({ page }) => {
    // Set vectors at 90 degrees: (1, 0) and (0, 1)
    await page.locator('[data-testid="preset-select"]').selectOption('unit-vectors')

    // Click angle operation
    await page.locator('[data-testid="op-angle"]').click()

    // Result should show 90 degrees
    const result = page.locator('[data-testid="result-value"]')
    await expect(result).toContainText('90')
    await expect(result).toContainText('°')
  })

  test('canvas displays vectors', async ({ page }) => {
    // Check that vector elements are rendered
    const vectorA = page.locator('[data-testid="vector-a"]')
    const vectorB = page.locator('[data-testid="vector-b"]')

    await expect(vectorA).toBeVisible()
    await expect(vectorB).toBeVisible()
  })
})

test.describe('Linear Algebra Navigation @e2e', () => {
  test('linear algebra index page loads', async ({ page }) => {
    await page.goto(`${BASE}/linear-algebra`)
    await expect(page.locator('h1')).toContainText('Linear Algebra')
  })

  test('can navigate from index to vectors page', async ({ page }) => {
    await page.goto(`${BASE}/linear-algebra`)

    // Click the vectors link
    await page.click('a[href*="/linear-algebra/vectors"]')

    // Should be on vectors page
    await expect(page.locator('h1')).toContainText('Vectors')
  })

  test('vectors page has collapsible sections', async ({ page }) => {
    await page.goto(`${BASE}/linear-algebra/vectors`)

    // Check that main sections exist
    await expect(page.locator('#introduction')).toBeVisible()
    await expect(page.locator('#explorer')).toBeVisible()
  })
})
