// src/utils/SmartLocator.ts
import { Page, Locator } from '@playwright/test';

export class SmartLocator {
  static async find(page: Page, primary: string, fallbacks: string[]): Promise<Locator> {
    // Try primary locator first
    if (await page.locator(primary).isVisible({ timeout: 1000 })) {
      return page.locator(primary);
    }

    // Try fallbacks
    for (const fallback of fallbacks) {
      try {
        const locator = page.locator(fallback);
        await locator.waitFor({ state: 'visible', timeout: 1000 });
        console.warn(`[Self-Healing] Used fallback locator: ${fallback} (primary failed: ${primary})`);
        return locator;
      } catch {
        // Continue to next fallback
      }
    }

    throw new Error(`All locators failed: ${[primary, ...fallbacks].join(', ')}`);
  }
}