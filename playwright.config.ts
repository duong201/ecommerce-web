import { defineConfig, devices } from '@playwright/test'

/**
 * Visual + contrast run. Everything it needs lives in `visual/`:
 * `yarn visual:build` produces an offline-data build, `serve.mjs` hosts it with
 * the SPA fallback the router needs, and the specs walk it.
 */

const PORT = Number(process.env.VISUAL_PORT ?? 4321)

export const BASE_URL = `http://127.0.0.1:${PORT}`

export default defineConfig({
  testDir: './visual',
  outputDir: './visual/out/test-results',

  globalSetup: './visual/global-setup.ts',
  globalTeardown: './visual/report.ts',

  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: 0,
  timeout: 120_000,
  expect: { timeout: 15_000 },

  reporter: [['list'], ['html', { outputFolder: 'visual/out/playwright-report', open: 'never' }]],

  use: {
    ...devices['Desktop Chrome'],
    baseURL: BASE_URL,
    // The shop prices and dates in Vietnamese; a UTC box would render a
    // different delivery day than the one a shopper here sees.
    locale: 'vi-VN',
    timezoneId: 'Asia/Ho_Chi_Minh',
    // 1 keeps the full-page PNGs reviewable; raise to 2 for retina crops.
    deviceScaleFactor: 1,
    screenshot: 'off',
    video: 'off',
    trace: 'retain-on-failure',
  },

  webServer: {
    command: 'node visual/serve.mjs',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
