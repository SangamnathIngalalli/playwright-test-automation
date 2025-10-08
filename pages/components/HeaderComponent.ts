// src/components/HeaderComponent.ts
import { Page, expect } from '@playwright/test';

export class HeaderComponent {
  constructor(private page: Page) {}

  // Navigation Links
  async goToHome() {
    await this.page.click('a[href="/"]');
  }

  async goToProducts() {
    await this.page.click('a[href="/products"]');
  }

    async goToProductsInNewTab() {
      const isMac = process.platform === 'darwin';
      await this.page.click('a[href="/products"]', { modifiers: [isMac ? 'Meta' : 'Control'] });
  }


  async goToCart() {
    await this.page.click('a[href="/view_cart"]');
  }

  async goToTestCases() {
    await this.page.click('a[href="/test_cases"]');
  }

  async goToApiTesting() {
    await this.page.click('a[href="/api_list"]');
  }

  async goToContactUs() {
    await this.page.click('a[href="/contact_us"]');
  }

  async logout() {
    await this.page.click('a[href="/logout"]');
  }

  async deleteAccount() {
    await this.page.click('a[href="/delete_account"]');
  }

  // User Info
  async getLoggedInUsername(): Promise<string> {
    const text = await this.page.textContent('.shop-menu .nav > li:last-child');
    // Extract "sam" from "Logged in as <b>sam</b>"
    const match = text?.match(/Logged in as\s*<b>(.*?)<\/b>/i);
    return match ? match[1] : '';
  }

  // Assertions
  async expectUsernameToBe(expected: string) {
    await expect(this.page.locator('.shop-menu .nav')).toContainText(`Logged in as ${expected}`);
  }
}