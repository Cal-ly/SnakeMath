import { test, expect } from '@playwright/test'

/**
 * E2E tests for the MatrixTransformations3D widget
 *
 * Tests cover:
 * - Widget rendering
 * - Transformation type selection
 * - Angle/scale parameter controls
 * - Preset loading
 * - Matrix display
 * - Transform analysis info
 * - Unit cube visualization
 * - URL state synchronization
 * - Responsive design
 */

test.describe('MatrixTransformations3D Widget', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/linear-algebra/matrices-3d')
    // Wait for widget to be fully loaded
    await page.waitForSelector('[data-testid="matrix-transformations-3d"]')
  })

  // ==========================================================================
  // Basic Rendering Tests
  // ==========================================================================

  test.describe('Basic Rendering', () => {
    test('renders the widget container', async ({ page }) => {
      const widget = page.locator('[data-testid="matrix-transformations-3d"]')
      await expect(widget).toBeVisible()
    })

    test('renders transformation type selector with all types', async ({ page }) => {
      const typeButtons = page.locator('[data-testid^="transform-3d-"]')
      await expect(typeButtons).toHaveCount(6) // identity, rotationX, rotationY, rotationZ, combined, scale
    })

    test('renders the 3D unit cube canvas', async ({ page }) => {
      const canvas = page.locator('[data-testid="unit-cube-canvas-3d"] svg')
      await expect(canvas).toBeVisible()
    })

    test('renders matrix display', async ({ page }) => {
      const matrixDisplay = page.locator('[data-testid="matrix-3d-display"]')
      await expect(matrixDisplay).toBeVisible()
    })

    test('renders parameter controls section', async ({ page }) => {
      const controls = page.locator('text=Parameters')
      await expect(controls).toBeVisible()
    })

    test('renders analysis section', async ({ page }) => {
      const analysis = page.locator('text=Analysis')
      await expect(analysis).toBeVisible()
    })
  })

  // ==========================================================================
  // Transformation Type Selection Tests
  // ==========================================================================

  test.describe('Transformation Type Selection', () => {
    test('selects identity by default', async ({ page }) => {
      const identityBtn = page.locator('[data-testid="transform-3d-identity"]')
      await expect(identityBtn).toHaveClass(/bg-primary/)
    })

    test('can select rotation X', async ({ page }) => {
      await page.click('[data-testid="transform-3d-rotationX"]')

      const rxBtn = page.locator('[data-testid="transform-3d-rotationX"]')
      await expect(rxBtn).toHaveClass(/bg-primary/)

      // Identity should be deselected
      const identityBtn = page.locator('[data-testid="transform-3d-identity"]')
      await expect(identityBtn).not.toHaveClass(/bg-primary/)
    })

    test('can select rotation Y', async ({ page }) => {
      await page.click('[data-testid="transform-3d-rotationY"]')

      const ryBtn = page.locator('[data-testid="transform-3d-rotationY"]')
      await expect(ryBtn).toHaveClass(/bg-primary/)
    })

    test('can select rotation Z', async ({ page }) => {
      await page.click('[data-testid="transform-3d-rotationZ"]')

      const rzBtn = page.locator('[data-testid="transform-3d-rotationZ"]')
      await expect(rzBtn).toHaveClass(/bg-primary/)
    })

    test('can select combined rotation', async ({ page }) => {
      await page.click('[data-testid="transform-3d-combined"]')

      const combinedBtn = page.locator('[data-testid="transform-3d-combined"]')
      await expect(combinedBtn).toHaveClass(/bg-primary/)
    })

    test('can select scale transformation', async ({ page }) => {
      await page.click('[data-testid="transform-3d-scale"]')

      const scaleBtn = page.locator('[data-testid="transform-3d-scale"]')
      await expect(scaleBtn).toHaveClass(/bg-primary/)
    })
  })

  // ==========================================================================
  // Parameter Controls Tests
  // ==========================================================================

  test.describe('Parameter Controls', () => {
    test('shows angle X slider for rotation X', async ({ page }) => {
      await page.click('[data-testid="transform-3d-rotationX"]')

      const angleXSlider = page.locator('input[data-testid="angle-x-slider"]')
      await expect(angleXSlider).toBeVisible()
    })

    test('shows angle Y slider for rotation Y', async ({ page }) => {
      await page.click('[data-testid="transform-3d-rotationY"]')

      const angleYSlider = page.locator('input[data-testid="angle-y-slider"]')
      await expect(angleYSlider).toBeVisible()
    })

    test('shows angle Z slider for rotation Z', async ({ page }) => {
      await page.click('[data-testid="transform-3d-rotationZ"]')

      const angleZSlider = page.locator('input[data-testid="angle-z-slider"]')
      await expect(angleZSlider).toBeVisible()
    })

    test('shows all three angle sliders for combined rotation', async ({ page }) => {
      await page.click('[data-testid="transform-3d-combined"]')

      await expect(page.locator('input[data-testid="angle-x-slider"]')).toBeVisible()
      await expect(page.locator('input[data-testid="angle-y-slider"]')).toBeVisible()
      await expect(page.locator('input[data-testid="angle-z-slider"]')).toBeVisible()
    })

    test('shows scale slider for scale transformation', async ({ page }) => {
      await page.click('[data-testid="transform-3d-scale"]')

      const scaleSlider = page.locator('input[data-testid="scale-slider"]')
      await expect(scaleSlider).toBeVisible()
    })

    test('angle slider updates matrix display', async ({ page }) => {
      await page.click('[data-testid="transform-3d-rotationX"]')

      const angleXSlider = page.locator('input[data-testid="angle-x-slider"]')
      await angleXSlider.fill('45')

      // Matrix should show rotation values (not identity)
      const matrixDisplay = page.locator('[data-testid="matrix-3d-display"]')
      // cos(45°) ≈ 0.707
      await expect(matrixDisplay).toContainText('0.707')
    })

    test('shows no controls for identity transformation', async ({ page }) => {
      // Identity is default
      const angleSliders = page.locator('input[type="range"]')

      // Should have no sliders or minimal UI
      const count = await angleSliders.count()
      expect(count).toBe(0)
    })
  })

  // ==========================================================================
  // Preset Tests
  // ==========================================================================

  test.describe('Preset Loading', () => {
    test('shows preset selector', async ({ page }) => {
      const presetSelect = page.locator('[data-testid="preset-3d-transform-select"]')
      await expect(presetSelect).toBeVisible()
    })

    test('can load 90° rotation X preset', async ({ page }) => {
      const presetSelect = page.locator('[data-testid="preset-3d-transform-select"]')
      await presetSelect.selectOption('rotate-x-90')

      // Should switch to rotation X
      const rxBtn = page.locator('[data-testid="transform-3d-rotationX"]')
      await expect(rxBtn).toHaveClass(/bg-primary/)

      // Angle should be 90
      const angleXSlider = page.locator('input[data-testid="angle-x-slider"]')
      await expect(angleXSlider).toHaveValue('90')
    })

    test('can load 180° rotation Y preset', async ({ page }) => {
      const presetSelect = page.locator('[data-testid="preset-3d-transform-select"]')
      await presetSelect.selectOption('rotate-y-180')

      const ryBtn = page.locator('[data-testid="transform-3d-rotationY"]')
      await expect(ryBtn).toHaveClass(/bg-primary/)
    })

    test('preset dropdown resets after selection', async ({ page }) => {
      const presetSelect = page.locator('[data-testid="preset-3d-transform-select"]')
      await presetSelect.selectOption('rotate-x-90')

      await expect(presetSelect).toHaveValue('')
    })
  })

  // ==========================================================================
  // Matrix Display Tests
  // ==========================================================================

  test.describe('Matrix Display', () => {
    test('shows 3x3 matrix grid', async ({ page }) => {
      const matrixDisplay = page.locator('[data-testid="matrix-3d-display"]')
      await expect(matrixDisplay).toBeVisible()

      // Should render with KaTeX
      await expect(matrixDisplay.locator('.katex')).toBeVisible()
    })

    test('identity matrix shows correct values', async ({ page }) => {
      const matrixDisplay = page.locator('[data-testid="matrix-3d-display"]')

      // Identity matrix has 1s on diagonal
      const content = await matrixDisplay.textContent()
      expect(content).toContain('1')
      expect(content).toContain('0')
    })

    test('matrix updates when transformation changes', async ({ page }) => {
      // Get initial matrix content
      const matrixDisplay = page.locator('[data-testid="matrix-3d-display"]')
      const initialContent = await matrixDisplay.textContent()

      // Change to rotation
      await page.click('[data-testid="transform-3d-rotationZ"]')
      const angleZSlider = page.locator('input[data-testid="angle-z-slider"]')
      await angleZSlider.fill('45')

      // Matrix should change
      const newContent = await matrixDisplay.textContent()
      expect(newContent).not.toBe(initialContent)
    })
  })

  // ==========================================================================
  // Transform Analysis Tests
  // ==========================================================================

  test.describe('Transform Analysis', () => {
    test('shows determinant value', async ({ page }) => {
      await expect(page.locator('text=Determinant')).toBeVisible()
    })

    test('identity has determinant 1', async ({ page }) => {
      // Check for determinant = 1 indicator
      await expect(page.locator('text=det = 1')).toBeVisible()
    })

    test('shows orthogonal status for rotation', async ({ page }) => {
      await page.click('[data-testid="transform-3d-rotationX"]')

      await expect(page.locator('text=Orthogonal')).toBeVisible()
    })

    test('shows rotation status', async ({ page }) => {
      await page.click('[data-testid="transform-3d-rotationX"]')

      await expect(page.locator('text=Rotation')).toBeVisible()
    })

    test('shows orientation preservation', async ({ page }) => {
      await expect(page.locator('text=Preserves Orientation')).toBeVisible()
    })

    test('scale transformation changes determinant', async ({ page }) => {
      await page.click('[data-testid="transform-3d-scale"]')
      const scaleSlider = page.locator('input[data-testid="scale-slider"]')
      await scaleSlider.fill('2')

      // Determinant should be 8 (2³) for uniform 3D scale
      await expect(page.locator('text=det = 8')).toBeVisible()
    })
  })

  // ==========================================================================
  // Unit Cube Canvas Tests
  // ==========================================================================

  test.describe('Unit Cube Canvas', () => {
    test('shows original cube outline', async ({ page }) => {
      const canvas = page.locator('[data-testid="unit-cube-canvas-3d"]')
      // Original cube is shown as dashed lines
      await expect(canvas.locator('path[stroke-dasharray]')).toBeVisible()
    })

    test('shows transformed cube', async ({ page }) => {
      const canvas = page.locator('[data-testid="unit-cube-canvas-3d"]')
      // Transformed cube is solid
      await expect(canvas.locator('path:not([stroke-dasharray])')).toBeVisible()
    })

    test('shows basis vectors', async ({ page }) => {
      const canvas = page.locator('[data-testid="unit-cube-canvas-3d"]')

      // Should show X, Y, Z colored vectors
      const redLine = canvas.locator('[stroke="#ef4444"], [stroke="rgb(239, 68, 68)"]')
      const greenLine = canvas.locator('[stroke="#22c55e"], [stroke="rgb(34, 197, 94)"]')
      const blueLine = canvas.locator('[stroke="#3b82f6"], [stroke="rgb(59, 130, 246)"]')

      // At least some colored elements should be visible
      const hasColors = (await redLine.count()) > 0 ||
                       (await greenLine.count()) > 0 ||
                       (await blueLine.count()) > 0

      expect(hasColors).toBe(true)
    })

    test('cube transforms when rotation changes', async ({ page }) => {
      await page.click('[data-testid="transform-3d-rotationX"]')

      // Get initial cube path
      const canvas = page.locator('[data-testid="unit-cube-canvas-3d"]')
      const transformedPath = canvas.locator('path:not([stroke-dasharray])').first()
      const initialD = await transformedPath.getAttribute('d')

      // Change angle
      const angleXSlider = page.locator('input[data-testid="angle-x-slider"]')
      await angleXSlider.fill('90')

      // Path should change
      const newD = await transformedPath.getAttribute('d')
      expect(newD).not.toBe(initialD)
    })
  })

  // ==========================================================================
  // URL State Tests
  // ==========================================================================

  test.describe('URL State Synchronization', () => {
    test('transformation type updates URL', async ({ page }) => {
      await page.click('[data-testid="transform-3d-rotationX"]')
      await page.waitForTimeout(400) // Wait for debounce

      expect(page.url()).toContain('type=rotationX')
    })

    test('angle updates URL', async ({ page }) => {
      await page.click('[data-testid="transform-3d-rotationZ"]')
      const angleZSlider = page.locator('input[data-testid="angle-z-slider"]')
      await angleZSlider.fill('45')
      await page.waitForTimeout(400)

      expect(page.url()).toContain('az=45')
    })

    test('URL parameters restore state', async ({ page }) => {
      // Navigate with query params
      await page.goto('/linear-algebra/matrices-3d?type=rotationY&ay=90')

      // Wait for widget to load
      await page.waitForSelector('[data-testid="matrix-transformations-3d"]')

      // Verify rotation Y is selected
      const ryBtn = page.locator('[data-testid="transform-3d-rotationY"]')
      await expect(ryBtn).toHaveClass(/bg-primary/)

      // Verify angle is 90
      const angleYSlider = page.locator('input[data-testid="angle-y-slider"]')
      await expect(angleYSlider).toHaveValue('90')
    })

    test('scale updates URL', async ({ page }) => {
      await page.click('[data-testid="transform-3d-scale"]')
      const scaleSlider = page.locator('input[data-testid="scale-slider"]')
      await scaleSlider.fill('1.5')
      await page.waitForTimeout(400)

      expect(page.url()).toContain('scale=1.5')
    })
  })

  // ==========================================================================
  // Responsive Design Tests
  // ==========================================================================

  test.describe('Responsive Design', () => {
    test('renders correctly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      const widget = page.locator('[data-testid="matrix-transformations-3d"]')
      await expect(widget).toBeVisible()

      // Canvas should still be visible
      const canvas = page.locator('[data-testid="unit-cube-canvas-3d"] svg')
      await expect(canvas).toBeVisible()
    })

    test('renders correctly on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })

      const widget = page.locator('[data-testid="matrix-transformations-3d"]')
      await expect(widget).toBeVisible()
    })

    test('controls stack vertically on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      // Grid should switch to single column
      const grid = page.locator('.grid.lg\\:grid-cols-2')
      await expect(grid).toBeVisible()
    })
  })
})

// ==========================================================================
// Matrices 3D Page Content Tests
// ==========================================================================

test.describe('Matrices 3D Page', () => {
  test.describe('Page Content', () => {
    test('renders page title', async ({ page }) => {
      await page.goto('/linear-algebra/matrices-3d')
      await expect(page.locator('h1:has-text("Matrices in 3D")')).toBeVisible()
    })

    test('renders content sections', async ({ page }) => {
      await page.goto('/linear-algebra/matrices-3d')

      await expect(page.locator('text=Rotation Matrices')).toBeVisible()
      await expect(page.locator('text=Interactive Explorer')).toBeVisible()
    })

    test('math blocks render with KaTeX', async ({ page }) => {
      await page.goto('/linear-algebra/matrices-3d')

      const katexElements = page.locator('.katex')
      const count = await katexElements.count()
      expect(count).toBeGreaterThan(0)
    })

    test('code examples are present', async ({ page }) => {
      await page.goto('/linear-algebra/matrices-3d')

      // Look for code or code section
      const codeBlocks = page.locator('pre code')
      const count = await codeBlocks.count()
      expect(count).toBeGreaterThan(0)
    })

    test('related topics section exists', async ({ page }) => {
      await page.goto('/linear-algebra/matrices-3d')

      await expect(page.locator('text=Related Topics')).toBeVisible()
    })

    test('Euler angles section exists', async ({ page }) => {
      await page.goto('/linear-algebra/matrices-3d')

      await expect(page.locator('text=Euler Angles')).toBeVisible()
    })
  })
})

// ==========================================================================
// Linear Algebra Navigation Tests
// ==========================================================================

test.describe('Linear Algebra Navigation', () => {
  test('3D vectors link works from index', async ({ page }) => {
    await page.goto('/linear-algebra')
    await page.click('a:has-text("Vectors in 3D")')
    await expect(page).toHaveURL(/\/linear-algebra\/vectors-3d/)
  })

  test('3D matrices link works from index', async ({ page }) => {
    await page.goto('/linear-algebra')
    await page.click('a:has-text("Matrices in 3D")')
    await expect(page).toHaveURL(/\/linear-algebra\/matrices-3d/)
  })

  test('navigation shows 3D topics', async ({ page }) => {
    await page.goto('/linear-algebra')

    await expect(page.locator('text=Vectors in 3D')).toBeVisible()
    await expect(page.locator('text=Matrices in 3D')).toBeVisible()
  })
})
