import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    // Base URL will be applied to all page.goto() calls
    baseURL: 'https://automationexercise.com/',
    headless: false, // Show browser for development
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    {
      name: 'chromium',
      use: { channel: 'chrome' }, // Use installed Chrome
    },
  ],
});