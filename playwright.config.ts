// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

// ─── Detect CI environment ─────────────────────────────
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  
  // ─── Global Timeouts ──────────────────────────────────
  timeout: 30 * 1000,           // Test timeout: 30s
  expect: { timeout: 10 * 1000 }, // Expect assertion timeout: 10s

  // ─── Retry Flaky Tests ────────────────────────────────
  retries: isCI ? 2 : 1,        // Retry failed tests: 2 in CI, 1 locally

  // ─── Parallel Workers ─────────────────────────────────
  workers: 4, // Run 4 tests in parallel

  // ─── Reporter ─────────────────────────────────────────
  reporter: [
    ['html', { outputFolder: 'reports/html-report', open: 'never' }], // <- completely separate folder
    ['list']
  ],

  // ─── Output Folders ───────────────────────────────────
  outputDir: 'test-results/', // Screenshots, videos, traces go here

  // ─── Use options ──────────────────────────────────────
  use: {
    actionTimeout: 15 * 1000,       // ✅ Correctly inside 'use'
    baseURL: 'https://automationexercise.com',
    trace: 'on-first-retry',        // Capture trace only on retry
    screenshot: 'only-on-failure',  // Screenshot on failure
    video: 'retain-on-failure',     // Video on failure
  },

  // ─── Projects (Browsers) ──────────────────────────────
  projects: [
    { name: 'Chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'Firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'WebKit', use: { ...devices['Desktop Safari'] } },
  ],
});
