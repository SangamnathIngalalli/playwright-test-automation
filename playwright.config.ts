// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // ─── Test Directory ───────────────────────────────────
  testDir: './tests',
  
  // ─── Global Timeouts ──────────────────────────────────
  timeout: 30 * 1000,           // Test timeout: 30s
  expect: {
    timeout: 10 * 1000          // Expect assertion timeout: 10s
  },

  // ─── Retry Flaky Tests ────────────────────────────────
  retries: 1,

  // ─── Parallel Workers ─────────────────────────────────
  workers: 4, // Run 4 tests in parallel

  // ─── Reporter ─────────────────────────────────────────
    reporter: [
      ['html', { outputFolder: 'playwright-report', open: 'never' }], //  test-results
      ['list'] // Also show in console
    ],
    outputDir: 'test-results', // Screenshots, videos, traces


  // ─── Base URL ─────────────────────────────────────────
  use: {
    baseURL: 'https://automationexercise.com', // ✅ Set base URL
    trace: 'on-first-retry',                   // Enable trace for debugging
    screenshot: 'only-on-failure',             // ✅ Screenshot on failure
    video: 'retain-on-failure',                // ✅ Video on failure
    actionTimeout: 15 * 1000,                 // ✅ Move Action timeout (click, fill, etc.): 15s

  },

  // ─── Projects (Browsers) ──────────────────────────────
  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'WebKit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // ─── Output Folders ───────────────────────────────────
  outputDir: 'test-results/', // Screenshots, videos, traces go here
});