# Task 5 – Playwright Base Framework and  playwright.config.ts

**Goal:** Build reusable base class for all page objects and `playwright.config.ts`

## Actions
- Create `BasePage` class in `src/pages` folder  
- Accept `page` object in constructor  
- Create common methods: `navigate`, `getTitle`, `waitForElement`  
- Create method to take screenshot  
- Create method for generic click action  
- Create method for generic type/fill action  
- Add TypeScript types for all methods  
- Create `playwright.config.ts` and config `baseURL`, and use install Chrome  

## Deliverables
- ✅ BasePage class created  
- ✅ Reusable methods available  
- ✅ All pages can extend this class


---

## 1. BasePage – `src/pages/base.page.ts`

```ts
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


```

## 2. playwright.config.ts – `src/pages/playwright.config.ts`

```ts
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

```



## 3. BasePage – `tests\ui\signUp.spec.ts`

```ts
import { BasePage } from '@pages/Base.Page';
import {test,expect} from '@playwright/test';


test.describe('SignUp tests',()=>{


    test('should navigate to login page and verify elements', async ({page}) =>{


        const basePage =  new BasePage(page);
            
        await basePage.navigate('/login');
        
        const titlePage = await basePage.getTitle();
        console.log('Page title:', titlePage);
        await expect(page).toHaveTitle(/login/i);


        await page.getByRole('textbox', { name: 'Name' }).click();
        await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address').click();
        await page.getByRole('button', { name: 'Signup' }).click();

        await expect(page).toHaveURL(/.*login/i);


     });
});

```

## To run

```bash
npx playwright test tests/ui/signUp.spec.ts

```

