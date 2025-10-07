# Task 7: Create Page Component Pattern

> Goal: Build reusable UI components (header, footer, navigation)

---

## Actions

1. Identify common components across pages (header, sidebar, modal)  
2. Create component classes in `src/pages/components` folder  
3. Create `HeaderComponent` class with header-specific actions  
4. Create methods for common header actions  
5. Compose components into page objects  
6. Update page objects to use components  

---

## Deliverables

✅ Reusable component classes  
✅ DRY principle applied  
✅ Components used in multiple pages  

---

## Code Implementation

#### AccountInfoPage.ts
```ts
import { Page, Locator } from '@playwright/test';

export interface AccountInfo {
  title: 'Mr' | 'Mrs';
  password: string;
  days: string;
  months: string;
  years: string;
  newsletter?: boolean;
  optin?: boolean;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
}

export class AccountInfoPage {
  private page: Page;
  // Locators
  private titleMr: Locator;
  private titleMrs: Locator;
  private passwordInput: Locator;
  private daySelect: Locator;
  private monthSelect: Locator;
  private yearSelect: Locator;
  private newsletterCheckbox: Locator;
  private optinCheckbox: Locator;
  private firstNameInput: Locator;
  private lastNameInput: Locator;
  private companyInput: Locator;
  private address1Input: Locator;
  private address2Input: Locator;
  private countrySelect: Locator;
  private stateInput: Locator;
  private cityInput: Locator;
  private zipcodeInput: Locator;
  private mobileInput: Locator;
  private createAccountButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.titleMr = page.locator('#id_gender1');
    this.titleMrs = page.locator('#id_gender2');
    this.passwordInput = page.locator('#password');
    this.daySelect = page.locator('#days');
    this.monthSelect = page.locator('#months');
    this.yearSelect = page.locator('#years');
    this.newsletterCheckbox = page.locator('#newsletter');
    this.optinCheckbox = page.locator('#optin');
    this.firstNameInput = page.locator('#first_name');
    this.lastNameInput = page.locator('#last_name');
    this.companyInput = page.locator('#company');
    this.address1Input = page.locator('#address1');
    this.address2Input = page.locator('#address2');
    this.countrySelect = page.locator('#country');
    this.stateInput = page.locator('#state');
    this.cityInput = page.locator('#city');
    this.zipcodeInput = page.locator('#zipcode');
    this.mobileInput = page.locator('#mobile_number');
    this.createAccountButton = page.locator('button[data-qa="create-account"]');
  }

  async fillAccountForm(data: AccountInfo) {
    if (data.title === 'Mr') await this.titleMr.check();
    if (data.title === 'Mrs') await this.titleMrs.check();

    await this.passwordInput.fill(data.password);
    await this.daySelect.selectOption(data.days);
    await this.monthSelect.selectOption(data.months);
    await this.yearSelect.selectOption(data.years);

    if (data.newsletter) await this.newsletterCheckbox.check();
    if (data.optin) await this.optinCheckbox.check();

    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    if (data.company) await this.companyInput.fill(data.company);

    await this.address1Input.fill(data.address1);
    if (data.address2) await this.address2Input.fill(data.address2);
    await this.countrySelect.selectOption(data.country);
    await this.stateInput.fill(data.state);
    await this.cityInput.fill(data.city);
    await this.zipcodeInput.fill(data.zipcode);
    await this.mobileInput.fill(data.mobileNumber);

    await this.createAccountButton.click();
  }
}
```
#### Base Page with Components
```ts
// pages/base.page.ts
import { Page } from '@playwright/test';
import { HeaderComponent } from './components/HeaderComponent';
import { FooterComponent } from './components/FooterComponent';

export class BasePage {
  readonly header: HeaderComponent;
  readonly footer: FooterComponent;

  constructor(protected page: Page) {
    this.header = new HeaderComponent(page);
    this.footer = new FooterComponent(page);
  }
}

```

#### Header Component

```ts
import { Page, expect } from '@playwright/test';

export class HeaderComponent {
  constructor(private page: Page) {}

  async goToHome() { await this.page.click('a[href="/"]'); }
  async goToProducts() { await this.page.click('a[href="/products"]'); }
  async goToCart() { await this.page.click('a[href="/view_cart"]'); }
  async goToTestCases() { await this.page.click('a[href="/test_cases"]'); }
  async goToApiTesting() { await this.page.click('a[href="/api_list"]'); }
  async goToContactUs() { await this.page.click('a[href="/contact_us"]'); }
  async logout() { await this.page.click('a[href="/logout"]'); }
  async deleteAccount() { await this.page.click('a[href="/delete_account"]'); }

  async getLoggedInUsername(): Promise<string> {
    const text = await this.page.textContent('.shop-menu .nav > li:last-child');
    const match = text?.match(/Logged in as\s*<b>(.*?)<\/b>/i);
    return match ? match[1] : '';
  }

  async expectUsernameToBe(expected: string) {
    await expect(this.page.locator('.shop-menu .nav')).toContainText(`Logged in as ${expected}`);
  }
}

```

#### Footer Component


```ts
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
    return text ?? '';
  }
}

```

---

## Common Issues & Fixes

### Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| HomePage not constructable | Used variable name `homePage` instead of class `HomePage` | `homePage = new HomePage(page)` |
| Cannot find module `'@pages/HomePage'` | Path alias incorrect | Update `tsconfig.json` paths or use relative imports |
| Default vs named import mismatch | Exported as `export class HomePage` but imported as default | `import { HomePage } from '@pages/HomePage'` |
| Case sensitivity errors | File name & import casing mismatch | Fix import to match file exactly |
| HeaderComponent errors | File not found / not exported | Ensure correct path & `export class HeaderComponent` |
| tsconfig include too broad/wrong | Pages folder not included | `"include": ["tests/**/*.ts", "pages/**/*.ts"]` |
| Runtime module resolution | Node/Playwright cannot resolve `@pages/*` | Use relative imports or `tsconfig-paths/register` |


