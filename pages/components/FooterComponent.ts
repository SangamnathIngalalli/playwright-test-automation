// src/components/FooterComponent.ts
import { Page } from '@playwright/test';

export class FooterComponent {
  constructor(private page: Page) {}

  async subscribeWithEmail(email: string) {
    await this.page.fill('#susbscribe_email', email);
    await this.page.click('#subscribe');
  }

  async isSuccessMessageVisible(): Promise<boolean> {
    return await this.page.isVisible('#success-subscribe .alert-success');
  }

  async getCopyrightText(): Promise<string> {
  const text = await this.page.textContent('.footer-bottom p');
  return text ?? ''; // returns empty string if null  
  }
}