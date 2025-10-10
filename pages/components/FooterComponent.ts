// src/components/FooterComponent.ts
import { Page } from '@playwright/test';
import { SmartLocator } from '@utils/SmartLocator';

export class FooterComponent {
  constructor(private page: Page) {}

  async subscribeWithEmail(email: string) {
   const emailInput = await SmartLocator.find(
      this.page,
      '#susbscribe_email', // Primary (current)
      ['#subscribe_email', 'input[placeholder*="email" i]', 'form input[type="email"]'] // Fallbacks
    );

    await emailInput.fill(email);
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