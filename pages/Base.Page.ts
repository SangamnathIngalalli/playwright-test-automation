// pages/base.page.ts
import { Page, Locator, Response } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   * @param url - The URL to navigate to
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get the current page title
   * @returns Promise<string> - The page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Wait for an element to be visible
   * @param selector - The element selector
   * @param timeout - Optional timeout in milliseconds (default: 10000)
   */
  async waitForElement(selector: string, timeout: number = 10000): Promise<Locator> {
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'visible', timeout });
    return locator;
  }

  /**
   * Take a screenshot of the current page
   * @param path - Optional path to save screenshot (default: auto-generated)
   */
  async takeScreenshot(path?: string): Promise<Buffer | null> {
    const screenshotPath = path || `screenshot-${Date.now()}.png`;
    return await this.page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    });
  }

  /**
   * Generic click action on an element
   * @param selector - The element selector to click
   */
  async click(selector: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.click();
  }

  /**
   * Generic type/fill action on an input element
   * @param selector - The input element selector
   * @param text - The text to fill
   */
  async fill(selector: string, text: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.fill(text);
  }

  /**
   * Wait for page to load completely
   * @param state - Optional load state (default: 'networkidle')
   */
  async waitForLoadState(state: 'load' | 'domcontentloaded' | 'networkidle' | 'commit' = 'networkidle'): Promise<void> {
    await this.page.waitForLoadState(state);
  }

  /**
   * Get text content of an element
   * @param selector - The element selector
   * @returns Promise<string> - The text content
   */
  async getText(selector: string): Promise<string> {
    const element = await this.waitForElement(selector);
    return await element.textContent() || '';
  }

  /**
   * Check if element is visible
   * @param selector - The element selector
   * @returns Promise<boolean> - True if element is visible
   */
  async isElementVisible(selector: string): Promise<boolean> {
    const element = this.page.locator(selector);
    return await element.isVisible();
  }

  /**
   * Get page URL
   * @returns Promise<string> - Current page URL
   */
  async getCurrentURL(): Promise<string> {
    return this.page.url();
  }

  /**
   * Wait for element to be hidden
   * @param selector - The element selector
   * @param timeout - Optional timeout in milliseconds (default: 10000)
   */
  async waitForElementHidden(selector: string, timeout: number = 10000): Promise<void> {
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Generic press key action
   * @param selector - The element selector
   * @param key - The key to press
   */
  async pressKey(selector: string, key: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.press(key);
  }

  /**
   * Scroll to element
   * @param selector - The element selector to scroll to
   */
  async scrollToElement(selector: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.scrollIntoViewIfNeeded();
  }

  /**
   * Wait for network idle state
   * @param timeout - Optional timeout in milliseconds (default: 30000)
   */
  async waitForNetworkIdle(timeout: number = 30000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Get attribute value of an element
   * @param selector - The element selector
   * @param attribute - The attribute name
   * @returns Promise<string> - The attribute value
   */
  async getAttribute(selector: string, attribute: string): Promise<string> {
    const element = await this.waitForElement(selector);
    return await element.getAttribute(attribute) || '';
  }

  /**
   * Check if element is enabled
   * @param selector - The element selector
   * @returns Promise<boolean> - True if element is enabled
   */
  async isElementEnabled(selector: string): Promise<boolean> {
    const element = await this.waitForElement(selector);
    return await element.isEnabled();
  }

  /**
   * Get all text contents from multiple elements
   * @param selector - The element selector
   * @returns Promise<string[]> - Array of text contents
   */
  async getAllTextContents(selector: string): Promise<string[]> {
    const elements = this.page.locator(selector);
    return await elements.allTextContents();
  }
}