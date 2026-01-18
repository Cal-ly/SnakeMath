import { test, expect } from '@playwright/test'

/**
 * E2E tests for the VectorOperations3D widget
 *
 * Tests cover:
 * - Widget rendering
 * - Operation selection
 * - Vector input interaction
 * - Preset loading
 * - Cross product and right-hand rule demo
 * - Result display
 * - URL state synchronization
 * - Responsive design
 */

test.describe('VectorOperations3D Widget', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/linear-algebra/vectors-3d')
    // Wait for widget to be fully loaded
    await page.waitForSelector('[data-testid="vector-operations-3d"]')
  })

  // ==========================================================================
  // Basic Rendering Tests
  // ==========================================================================

  test.describe('Basic Rendering', () => {
    test('renders the widget container', async ({ page }) => {
      const widget = page.locator('[data-testid="vector-operations-3d"]')
      await expect(widget).toBeVisible()
    })

    test('renders operation selector with all operations', async ({ page }) => {
      const operationButtons = page.locator('[data-testid="operation-3d-selector"] button[role="radio"]')
      await expect(operationButtons).toHaveCount(8) // 8 operations
    })

    test('renders the 3D canvas SVG', async ({ page }) => {
      const canvas = page.locator('[data-testid="isometric-canvas-3d"] svg')
      await expect(canvas).toBeVisible()
    })

    test('renders vector A input controls', async ({ page }) => {
      const vectorAInputs = page.locator('input[data-testid^="vector-a-"]')
      await expect(vectorAInputs).toHaveCount(3) // x, y, z
    })

    test('renders vector B input controls', async ({ page }) => {
      const vectorBInputs = page.locator('input[data-testid^="vector-b-"]')
      await expect(vectorBInputs).toHaveCount(3) // x, y, z
    })

    test('renders result display section', async ({ page }) => {
      const resultDisplay = page.locator('[data-testid="result-3d-display"]')
      await expect(resultDisplay).toBeVisible()
    })
  })

  // ==========================================================================
  // Operation Selection Tests
  // ==========================================================================

  test.describe('Operation Selection', () => {
    test('selects cross product operation by default', async ({ page }) => {
      // Widget defaults to cross product
      const crossBtn = page.locator('button:has-text("Cross Product")')
      await expect(crossBtn).toHaveAttribute('aria-checked', 'true')
    })

    test('can select add operation', async ({ page }) => {
      await page.click('button:has-text("Add")')

      const addBtn = page.locator('button:has-text("Add")')
      await expect(addBtn).toHaveAttribute('aria-checked', 'true')

      // Cross product should be deselected
      const crossBtn = page.locator('button:has-text("Cross Product")')
      await expect(crossBtn).toHaveAttribute('aria-checked', 'false')
    })

    test('can select dot product operation', async ({ page }) => {
      await page.click('button:has-text("Dot Product")')

      const dotBtn = page.locator('button:has-text("Dot Product")')
      await expect(dotBtn).toHaveAttribute('aria-checked', 'true')
    })

    test('can select magnitude operation', async ({ page }) => {
      await page.click('button:has-text("Magnitude")')

      const magBtn = page.locator('button:has-text("Magnitude")')
      await expect(magBtn).toHaveAttribute('aria-checked', 'true')
    })

    test('can select normalize operation', async ({ page }) => {
      await page.click('button:has-text("Normalize")')

      const normBtn = page.locator('button:has-text("Normalize")')
      await expect(normBtn).toHaveAttribute('aria-checked', 'true')
    })
  })

  // ==========================================================================
  // Vector Input Tests
  // ==========================================================================

  test.describe('Vector Input Interaction', () => {
    test('can change vector A x component', async ({ page }) => {
      const inputX = page.locator('input[data-testid="vector-a-x"]')
      await inputX.fill('5')

      await expect(inputX).toHaveValue('5')
    })

    test('can change vector A y component', async ({ page }) => {
      const inputY = page.locator('input[data-testid="vector-a-y"]')
      await inputY.fill('3')

      await expect(inputY).toHaveValue('3')
    })

    test('can change vector A z component', async ({ page }) => {
      const inputZ = page.locator('input[data-testid="vector-a-z"]')
      await inputZ.fill('2')

      await expect(inputZ).toHaveValue('2')
    })

    test('can change vector B components', async ({ page }) => {
      const inputX = page.locator('input[data-testid="vector-b-x"]')
      const inputY = page.locator('input[data-testid="vector-b-y"]')
      const inputZ = page.locator('input[data-testid="vector-b-z"]')

      await inputX.fill('1')
      await inputY.fill('2')
      await inputZ.fill('3')

      await expect(inputX).toHaveValue('1')
      await expect(inputY).toHaveValue('2')
      await expect(inputZ).toHaveValue('3')
    })

    test('scalar multiplier appears for scalar operation', async ({ page }) => {
      await page.click('button:has-text("Scalar")')

      const scalarInput = page.locator('input[data-testid="scalar-multiplier"]')
      await expect(scalarInput).toBeVisible()
    })
  })

  // ==========================================================================
  // Preset Tests
  // ==========================================================================

  test.describe('Preset Loading', () => {
    test('shows preset selector', async ({ page }) => {
      const presetSelect = page.locator('[data-testid="preset-3d-select"]')
      await expect(presetSelect).toBeVisible()
    })

    test('can load standard basis preset', async ({ page }) => {
      const presetSelect = page.locator('[data-testid="preset-3d-select"]')
      await presetSelect.selectOption('standard-basis')

      // Verify vectors changed (standard basis: i and j)
      const inputAx = page.locator('input[data-testid="vector-a-x"]')
      const inputAy = page.locator('input[data-testid="vector-a-y"]')
      const inputAz = page.locator('input[data-testid="vector-a-z"]')

      await expect(inputAx).toHaveValue('1')
      await expect(inputAy).toHaveValue('0')
      await expect(inputAz).toHaveValue('0')
    })

    test('can load cross product demo preset', async ({ page }) => {
      const presetSelect = page.locator('[data-testid="preset-3d-select"]')
      await presetSelect.selectOption('cross-demo')

      // Should also switch to cross product operation
      const crossBtn = page.locator('button:has-text("Cross Product")')
      await expect(crossBtn).toHaveAttribute('aria-checked', 'true')
    })

    test('preset dropdown resets after selection', async ({ page }) => {
      const presetSelect = page.locator('[data-testid="preset-3d-select"]')
      await presetSelect.selectOption('standard-basis')

      // Dropdown should reset to placeholder
      await expect(presetSelect).toHaveValue('')
    })
  })

  // ==========================================================================
  // Cross Product & Right-Hand Rule Tests
  // ==========================================================================

  test.describe('Cross Product Features', () => {
    // Cross product is default, no beforeEach needed

    test('shows right-hand rule demo for cross product', async ({ page }) => {
      const rightHandDemo = page.locator('[data-testid="right-hand-rule-demo"]')
      await expect(rightHandDemo).toBeVisible()
    })

    test('result shows perpendicular vector', async ({ page }) => {
      // Set up vectors for known cross product
      await page.locator('[data-testid="vector-a-x"]').fill('1')
      await page.locator('[data-testid="vector-a-y"]').fill('0')
      await page.locator('[data-testid="vector-a-z"]').fill('0')

      await page.locator('[data-testid="vector-b-x"]').fill('0')
      await page.locator('[data-testid="vector-b-y"]').fill('1')
      await page.locator('[data-testid="vector-b-z"]').fill('0')

      // i × j = k, so result should be (0, 0, 1)
      const resultDisplay = page.locator('[data-testid="result-3d-display"]')
      await expect(resultDisplay).toContainText('0')
      await expect(resultDisplay).toContainText('1')
    })
  })

  // ==========================================================================
  // Result Display Tests
  // ==========================================================================

  test.describe('Result Display', () => {
    test('shows vector result for cross product operation', async ({ page }) => {
      // Cross product is default, just check result displays
      const resultDisplay = page.locator('[data-testid="result-3d-display"]')
      await expect(resultDisplay).toBeVisible()

      // Should show result vector notation
      await expect(resultDisplay.locator('.katex')).toBeVisible()
    })

    test('shows scalar result for dot product', async ({ page }) => {
      await page.click('button:has-text("Dot Product")')

      const resultDisplay = page.locator('[data-testid="result-3d-display"]')
      await expect(resultDisplay).toBeVisible()

      // Should show scalar value
      await expect(resultDisplay.locator('.katex')).toBeVisible()
    })

    test('shows magnitude for magnitude operation', async ({ page }) => {
      await page.click('button:has-text("Magnitude")')

      const resultDisplay = page.locator('[data-testid="result-3d-display"]')
      await expect(resultDisplay).toBeVisible()
    })

    test('shows angle in degrees for angle operation', async ({ page }) => {
      await page.click('button:has-text("Angle")')

      const resultDisplay = page.locator('[data-testid="result-3d-display"]')
      await expect(resultDisplay).toContainText('°')
    })
  })

  // ==========================================================================
  // URL State Tests
  // ==========================================================================

  test.describe('URL State Synchronization', () => {
    test('operation selection updates URL', async ({ page }) => {
      await page.click('button:has-text("Cross Product")')
      await page.waitForTimeout(400) // Wait for debounce

      expect(page.url()).toContain('op=cross')
    })

    test('vector values update URL', async ({ page }) => {
      await page.locator('input[data-testid="vector-a-x"]').fill('5')
      await page.waitForTimeout(400)

      expect(page.url()).toContain('ax=5')
    })

    test('URL parameters restore state', async ({ page }) => {
      // Navigate with query params
      await page.goto('/linear-algebra/vectors-3d?op=dot&ax=2&ay=3&az=4')

      // Wait for widget to load
      await page.waitForSelector('[data-testid="vector-operations-3d"]')

      // Verify dot product is selected
      const dotBtn = page.locator('button:has-text("Dot Product")')
      await expect(dotBtn).toHaveAttribute('aria-checked', 'true')

      // Verify vector A values
      await expect(page.locator('input[data-testid="vector-a-x"]')).toHaveValue('2')
      await expect(page.locator('input[data-testid="vector-a-y"]')).toHaveValue('3')
      await expect(page.locator('input[data-testid="vector-a-z"]')).toHaveValue('4')
    })
  })

  // ==========================================================================
  // Canvas Interaction Tests
  // ==========================================================================

  test.describe('Canvas Visualization', () => {
    test('shows axis labels', async ({ page }) => {
      const canvas = page.locator('[data-testid="isometric-canvas-3d"]')
      await expect(canvas.locator('text:has-text("X")')).toBeVisible()
      await expect(canvas.locator('text:has-text("Y")')).toBeVisible()
      await expect(canvas.locator('text:has-text("Z")')).toBeVisible()
    })

    test('shows vector A arrow', async ({ page }) => {
      const vectorA = page.locator('[data-testid="vector-a-3d"]')
      await expect(vectorA).toBeVisible()
    })

    test('shows vector B arrow when relevant', async ({ page }) => {
      // For cross product (default), both vectors should be visible
      const vectorB = page.locator('[data-testid="vector-b-3d"]')
      await expect(vectorB).toBeVisible()
    })

    test('hides vector B for single-vector operations', async ({ page }) => {
      await page.click('button:has-text("Magnitude")')

      // Vector B should not be visible for magnitude
      const vectorB = page.locator('[data-testid="vector-b-3d"]')
      await expect(vectorB).not.toBeVisible()
    })
  })

  // ==========================================================================
  // Responsive Design Tests
  // ==========================================================================

  test.describe('Responsive Design', () => {
    test('renders correctly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      const widget = page.locator('[data-testid="vector-operations-3d"]')
      await expect(widget).toBeVisible()

      // Canvas should still be visible
      const canvas = page.locator('[data-testid="isometric-canvas-3d"] svg')
      await expect(canvas).toBeVisible()
    })

    test('renders correctly on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })

      const widget = page.locator('[data-testid="vector-operations-3d"]')
      await expect(widget).toBeVisible()
    })
  })
})

// ==========================================================================
// Vectors 3D Page Content Tests
// ==========================================================================

test.describe('Vectors 3D Page', () => {
  test.describe('Page Content', () => {
    test('renders page title', async ({ page }) => {
      await page.goto('/linear-algebra/vectors-3d')
      await expect(page.locator('h1:has-text("Vectors in 3D")')).toBeVisible()
    })

    test('renders content sections', async ({ page }) => {
      await page.goto('/linear-algebra/vectors-3d')

      await expect(page.locator('text=Cross Product')).toBeVisible()
      await expect(page.locator('text=Interactive Explorer')).toBeVisible()
    })

    test('math blocks render with KaTeX', async ({ page }) => {
      await page.goto('/linear-algebra/vectors-3d')

      const katexElements = page.locator('.katex')
      const count = await katexElements.count()
      expect(count).toBeGreaterThan(0)
    })

    test('code examples render', async ({ page }) => {
      await page.goto('/linear-algebra/vectors-3d')

      // Expand a code section if collapsed
      const codeSection = page.locator('text=In Python')
      if (await codeSection.isVisible()) {
        await codeSection.click()
      }

      // Look for Python code
      await expect(page.locator('code:has-text("np.cross")')).toBeVisible()
    })

    test('related topics section exists', async ({ page }) => {
      await page.goto('/linear-algebra/vectors-3d')

      await expect(page.locator('text=Related Topics')).toBeVisible()
    })
  })
})
