import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  expect: {
    toHaveScreenshot: {
      threshold: 0.1,
      maxDiffPixelRatio: 0.1,
    },
  },
  snapshotDir: './e2e/__screenshots__',
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'visual-desktop',
      testMatch: /visual\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'visual-mobile',
      testMatch: /visual\/.*\.spec\.ts/,
      use: {
        ...devices['iPhone 12'],
        viewport: { width: 375, height: 667 },
      },
    },
  ],
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4173/SnakeMath/',
    reuseExistingServer: !process.env.CI,
  },
})
