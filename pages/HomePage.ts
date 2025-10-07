// src/pages/HomePage.ts
import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from './components/HeaderComponent'; 

export class HomePage extends BasePage {
  readonly header: HeaderComponent;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page); // initialize header component
  }

  /**
   * Navigate to homepage
   */
  async visit() {
    await this.navigate('/');
    await this.page.waitForSelector('#slider-carousel'); // wait for main slider
  }

  /**
   * Verify homepage loaded by checking key element
   */
  async verifyHomePageLoaded() {
    await this.page
      .locator('h2.title.text-center', { hasText: 'Features Items' })
      .waitFor({ state: 'visible' });
  }

  /**
   * Navigate to a specific path
   * @param path relative URL
   */
  async goto(path: string) {
    await this.navigate(path);
  }
}
