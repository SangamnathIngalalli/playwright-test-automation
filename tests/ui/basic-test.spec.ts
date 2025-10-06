import { test, expect } from '@playwright/test';

test.describe('Facebook Navigation Tests', () => {
  test('should navigate to Facebook successfully', async ({ page }) => {
    // Navigate to Facebook
    await page.goto('https://www.facebook.com/');
    
    // Verify we are on the correct page
    await expect(page).toHaveURL(/.*facebook\.com\/$/);
    
    // Verify page title contains expected text
    await expect(page).toHaveTitle(/.*Facebook.*/);
    
    // Verify main login elements are present
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#pass')).toBeVisible();
    await expect(page.locator('[data-testid="royal-login-button"]')).toBeVisible();
  });
});