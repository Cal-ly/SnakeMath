import { test, expect } from '@playwright/test'

test.describe('Correlation & Regression Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/statistics/correlation')
  })

  test.describe('Page Structure', () => {
    test('should display page title and description', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Correlation & Regression', level: 1 })).toBeVisible()
      await expect(page.getByText('Measuring relationships between variables')).toBeVisible()
    })

    test('should have all main sections', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'What is Correlation?' })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Pearson Correlation Coefficient' })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Correlation Explorer' })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Linear Regression' })).toBeVisible()
    })

    test('should display three analogy cards in introduction', async ({ page }) => {
      // Everyday, Programming, ML analogies
      await expect(page.getByText('Everyday Analogy')).toBeVisible()
      await expect(page.getByText('Programming Analogy')).toBeVisible()
      await expect(page.getByText('ML Connection')).toBeVisible()
    })

    test('should display related topics', async ({ page }) => {
      await expect(page.getByText('Statistics Overview')).toBeVisible()
      await expect(page.getByText('Hypothesis Testing')).toBeVisible()
    })
  })

  test.describe('Correlation Explorer Widget', () => {
    test('should render the correlation explorer widget', async ({ page }) => {
      const widget = page.getByTestId('correlation-explorer')
      await expect(widget).toBeVisible()
    })

    test('should display explorer tab by default', async ({ page }) => {
      const explorerTab = page.getByTestId('tab-explorer')
      await expect(explorerTab).toBeVisible()
      await expect(explorerTab).toHaveClass(/text-accent-primary/)
    })

    test('should display all tabs', async ({ page }) => {
      await expect(page.getByTestId('tab-explorer')).toBeVisible()
      await expect(page.getByTestId('tab-anscombe')).toBeVisible()
      await expect(page.getByTestId('tab-presets')).toBeVisible()
    })

    test('should render scatter plot', async ({ page }) => {
      const scatterPlot = page.getByTestId('scatter-plot')
      await expect(scatterPlot).toBeVisible()
    })

    test('should render statistics panel', async ({ page }) => {
      const statsPanel = page.getByTestId('correlation-stats')
      await expect(statsPanel).toBeVisible()
    })

    test('should have control buttons', async ({ page }) => {
      await expect(page.getByTestId('btn-generate-random')).toBeVisible()
      await expect(page.getByTestId('btn-clear')).toBeVisible()
      await expect(page.getByTestId('toggle-regression')).toBeVisible()
      await expect(page.getByTestId('toggle-residuals')).toBeVisible()
    })
  })

  test.describe('Scatter Plot Interactions', () => {
    test('should add points when clicking on canvas', async ({ page }) => {
      const scatterPlot = page.getByTestId('scatter-plot')

      // Get initial point count (should show instructions when empty)
      await expect(page.getByText('Click to add points')).toBeVisible()

      // Click to add a point
      const box = await scatterPlot.boundingBox()
      if (box) {
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
      }

      // After adding point, statistics should update
      const nStat = page.getByTestId('stat-n')
      await expect(nStat).toHaveText('1')
    })

    test('should update statistics when adding multiple points', async ({ page }) => {
      const scatterPlot = page.getByTestId('scatter-plot')
      const box = await scatterPlot.boundingBox()

      if (box) {
        // Add multiple points
        await page.mouse.click(box.x + 100, box.y + 100)
        await page.mouse.click(box.x + 200, box.y + 200)
        await page.mouse.click(box.x + 300, box.y + 300)
      }

      // Check n stat
      const nStat = page.getByTestId('stat-n')
      await expect(nStat).toHaveText('3')

      // Correlation should be calculated (not '-')
      const correlationStat = page.getByTestId('stat-correlation')
      await expect(correlationStat).not.toHaveText('-')
    })

    test('should generate random data when clicking Random Data button', async ({ page }) => {
      await page.getByTestId('btn-generate-random').click()

      // Should have generated some points
      const nStat = page.getByTestId('stat-n')
      const nValue = await nStat.textContent()
      expect(Number(nValue)).toBeGreaterThan(0)

      // Correlation should be calculated
      const correlationStat = page.getByTestId('stat-correlation')
      await expect(correlationStat).not.toHaveText('-')
    })

    test('should clear all points when clicking Clear button', async ({ page }) => {
      // First generate some data
      await page.getByTestId('btn-generate-random').click()

      // Verify points exist
      const nStat = page.getByTestId('stat-n')
      const nValue = await nStat.textContent()
      expect(Number(nValue)).toBeGreaterThan(0)

      // Clear points
      await page.getByTestId('btn-clear').click()

      // Verify cleared
      await expect(nStat).toHaveText('0')
      await expect(page.getByText('Click to add points')).toBeVisible()
    })
  })

  test.describe('Toggle Controls', () => {
    test.beforeEach(async ({ page }) => {
      // Generate data first
      await page.getByTestId('btn-generate-random').click()
    })

    test('should toggle regression line visibility', async ({ page }) => {
      const toggle = page.getByTestId('toggle-regression')

      // Initially checked
      await expect(toggle).toBeChecked()

      // Uncheck
      await toggle.uncheck()
      await expect(toggle).not.toBeChecked()

      // Re-check
      await toggle.check()
      await expect(toggle).toBeChecked()
    })

    test('should toggle residuals visibility', async ({ page }) => {
      const toggle = page.getByTestId('toggle-residuals')

      // Initially not checked
      await expect(toggle).not.toBeChecked()

      // Check to show residuals
      await toggle.check()
      await expect(toggle).toBeChecked()

      // Should show residual plot
      const residualPlot = page.getByTestId('residual-plot')
      await expect(residualPlot).toBeVisible()
    })

    test('should toggle confidence intervals', async ({ page }) => {
      const toggle = page.getByTestId('toggle-ci')

      // Check to show CIs
      await toggle.check()
      await expect(toggle).toBeChecked()

      // Should show CI stats
      await expect(page.getByTestId('stat-slope-ci')).toBeVisible()
    })
  })

  test.describe('Presets Tab', () => {
    test('should switch to presets tab', async ({ page }) => {
      await page.getByTestId('tab-presets').click()
      const presetsPanel = page.getByTestId('correlation-presets')
      await expect(presetsPanel).toBeVisible()
    })

    test('should display preset options', async ({ page }) => {
      await page.getByTestId('tab-presets').click()

      await expect(page.getByTestId('preset-strong-positive')).toBeVisible()
      await expect(page.getByTestId('preset-strong-negative')).toBeVisible()
      await expect(page.getByTestId('preset-no-correlation')).toBeVisible()
    })

    test('should load preset when clicking', async ({ page }) => {
      await page.getByTestId('tab-presets').click()
      await page.getByTestId('preset-strong-positive').click()

      // Should show visualization and lesson
      await expect(page.getByText('Lesson:')).toBeVisible()

      // Should have high correlation
      const correlationStat = page.getByTestId('stat-correlation')
      const correlationValue = await correlationStat.textContent()
      expect(Number(correlationValue)).toBeGreaterThan(0.8)
    })

    test('should load negative correlation preset', async ({ page }) => {
      await page.getByTestId('tab-presets').click()
      await page.getByTestId('preset-strong-negative').click()

      const correlationStat = page.getByTestId('stat-correlation')
      const correlationValue = await correlationStat.textContent()
      expect(Number(correlationValue)).toBeLessThan(-0.8)
    })
  })

  test.describe("Anscombe's Quartet Tab", () => {
    test('should switch to anscombe tab', async ({ page }) => {
      await page.getByTestId('tab-anscombe').click()
      const anscombePanel = page.getByTestId('anscombe-quartet')
      await expect(anscombePanel).toBeVisible()
    })

    test('should display all four Anscombe datasets', async ({ page }) => {
      await page.getByTestId('tab-anscombe').click()

      await expect(page.getByTestId('anscombe-anscombe-1')).toBeVisible()
      await expect(page.getByTestId('anscombe-anscombe-2')).toBeVisible()
      await expect(page.getByTestId('anscombe-anscombe-3')).toBeVisible()
      await expect(page.getByTestId('anscombe-anscombe-4')).toBeVisible()
    })

    test('should display warning about visualizing data', async ({ page }) => {
      await page.getByTestId('tab-anscombe').click()

      await expect(page.getByText('Why You Must Visualize Data')).toBeVisible()
      await expect(page.getByText('same mean, same variance, same correlation')).toBeVisible()
    })

    test('should load Anscombe dataset when clicking', async ({ page }) => {
      await page.getByTestId('tab-anscombe').click()
      await page.getByTestId('anscombe-anscombe-1').click()

      // Should show visualization
      const scatterPlot = page.getByTestId('scatter-plot')
      await expect(scatterPlot).toBeVisible()

      // Should have 11 points
      const nStat = page.getByTestId('stat-n')
      await expect(nStat).toHaveText('11')

      // Should have correlation close to 0.816
      const correlationStat = page.getByTestId('stat-correlation')
      const correlationValue = await correlationStat.textContent()
      expect(Number(correlationValue)).toBeCloseTo(0.816, 1)
    })
  })

  test.describe('Causation Warning', () => {
    test('should display causation warning', async ({ page }) => {
      const warning = page.getByTestId('causation-warning')
      await expect(warning).toBeVisible()
      await expect(page.getByText('Correlation ≠ Causation')).toBeVisible()
    })
  })

  test.describe('Statistics Display', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByTestId('btn-generate-random').click()
    })

    test('should display sample size (n)', async ({ page }) => {
      await expect(page.getByTestId('stat-n')).toBeVisible()
    })

    test('should display correlation (r)', async ({ page }) => {
      await expect(page.getByTestId('stat-correlation')).toBeVisible()
    })

    test('should display interpretation', async ({ page }) => {
      await expect(page.getByTestId('stat-interpretation')).toBeVisible()
    })

    test('should display R² value', async ({ page }) => {
      await expect(page.getByTestId('stat-r-squared')).toBeVisible()
    })

    test('should display regression equation', async ({ page }) => {
      await expect(page.getByTestId('stat-equation')).toBeVisible()
    })

    test('should display slope and intercept', async ({ page }) => {
      await expect(page.getByTestId('stat-slope')).toBeVisible()
      await expect(page.getByTestId('stat-intercept')).toBeVisible()
    })

    test('should display standard error', async ({ page }) => {
      await expect(page.getByTestId('stat-std-error')).toBeVisible()
    })
  })

  test.describe('URL State Sync', () => {
    test('should update URL when loading preset', async ({ page }) => {
      await page.getByTestId('tab-presets').click()
      await page.getByTestId('preset-strong-positive').click()

      // Wait for URL to update
      await page.waitForTimeout(500)

      expect(page.url()).toContain('preset=strong-positive')
    })

    test('should update URL when switching tabs', async ({ page }) => {
      await page.getByTestId('tab-anscombe').click()
      await page.waitForTimeout(500)

      expect(page.url()).toContain('tab=anscombe')
    })

    test('should restore state from URL', async ({ page }) => {
      // Navigate with preset in URL
      await page.goto('/statistics/correlation?preset=strong-negative')

      // Should have loaded the preset
      const correlationStat = page.getByTestId('stat-correlation')
      const correlationValue = await correlationStat.textContent()
      expect(Number(correlationValue)).toBeLessThan(-0.8)
    })
  })

  test.describe('Code Examples', () => {
    test('should have Python code examples', async ({ page }) => {
      // Expand the Pearson section if collapsed
      const pearsonSection = page.getByRole('heading', { name: 'Pearson Correlation Coefficient' })
      await pearsonSection.click()

      // Should have correlation code
      await expect(page.locator('text=correlation.py')).toBeVisible()
    })

    test('should have scikit-learn code examples', async ({ page }) => {
      // Expand the Multiple Regression section
      const multipleRegressionSection = page.getByRole('heading', { name: 'Multiple Regression & ML Bridge' })
      await multipleRegressionSection.click()

      await expect(page.locator('text=sklearn_regression.py')).toBeVisible()
    })
  })

  test.describe('Accessibility', () => {
    test('should have accessible form controls', async ({ page }) => {
      const toggleRegression = page.getByTestId('toggle-regression')
      await expect(toggleRegression).toHaveAttribute('type', 'checkbox')

      const toggleResiduals = page.getByTestId('toggle-residuals')
      await expect(toggleResiduals).toHaveAttribute('type', 'checkbox')
    })

    test('should have accessible buttons', async ({ page }) => {
      const randomBtn = page.getByTestId('btn-generate-random')
      await expect(randomBtn).toBeVisible()
      await expect(randomBtn).toBeEnabled()

      const clearBtn = page.getByTestId('btn-clear')
      await expect(clearBtn).toBeVisible()
      await expect(clearBtn).toBeEnabled()
    })

    test('should have proper heading hierarchy', async ({ page }) => {
      const h1 = page.getByRole('heading', { level: 1 })
      await expect(h1).toBeVisible()

      const h2s = await page.getByRole('heading', { level: 2 }).all()
      expect(h2s.length).toBeGreaterThan(0)
    })
  })
})
