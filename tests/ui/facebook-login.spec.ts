import { test, expect } from '@playwright/test';

test.describe('Facebook Login Tests', () => {
  test('should login to Facebook', async ({ page }) => {
    await page.goto('https://www.facebook.com/');
    
  });
});