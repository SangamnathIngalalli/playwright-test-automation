// src/utils/WaitUtils.ts
import { Page, Locator } from '@playwright/test';

export class WaitUtils {
  constructor(private page: Page) {}

  /**
   * Wait for an element to be visible in the DOM and viewport
   */
  async waitForElementVisible(locator: Locator, timeoutMs = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: timeoutMs });
  }

  /**
   * Wait for an element to be enabled and clickable
   */
  async waitForElementClickable(locator: Locator, timeoutMs = 10000): Promise<void> {
    await locator.waitFor({ state: 'attached', timeout: timeoutMs });

    const elementHandle = await locator.elementHandle();
    if (!elementHandle) {
      throw new Error('Element not found in DOM');
    }

    await this.page.waitForFunction(
      (el: HTMLElement | SVGElement) => !!el && el.isConnected && (el as HTMLElement).offsetParent !== null && !(el as HTMLElement).hasAttribute('disabled'),
      elementHandle,
      { timeout: timeoutMs }
    );
  }

  /**
   * Wait for specific text to appear in an element
   */
    async waitForTextToAppear(locator: Locator, expectedText: string, timeoutMs = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: timeoutMs });

    const elementHandle = await locator.elementHandle();
    if (!elementHandle) {
        throw new Error('Element not found in DOM');
    }

    await this.page.waitForFunction(
        ({ el, text }) => !!el.textContent && el.textContent.includes(text),
        { el: elementHandle, text: expectedText },
        { timeout: timeoutMs, polling: 200 }
    );
    }

  /**
   * Wait for network to be idle (no more than 0 requests for 500ms)
   */
  async waitForNetworkIdle(timeoutMs = 10000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout: timeoutMs });
  }

  /**
   * Wait for a custom condition (e.g., element count, state change)
   */
  async waitForCondition(
    condition: () => Promise<boolean>,
    timeoutMs = 10000,
    intervalMs = 200
  ): Promise<void> {
    const startTime = Date.now();
    while (Date.now() - startTime < timeoutMs) {
      if (await condition()) {
        return;
      }
      await this.page.waitForTimeout(intervalMs);
    }
    throw new Error(`waitForCondition timed out after ${timeoutMs}ms`);
  }
}
