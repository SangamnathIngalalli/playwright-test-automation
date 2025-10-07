# Task 6: Create Your First Page Object

## Goal
Implement the **Page Object Model (POM)** for a real page in your application.

---

## Actions
- Choose a page from your application (e.g., Login page).
- Create a `LoginPage` class extending `BasePage`.
- Define all locators as **private properties**.
- Create methods for page actions: `enterUsername`, `enterPassword`, `clickLogin`.
- Create a method to verify the page loaded.
- Use **descriptive method names** representing user actions.
- Add **TypeScript interfaces** for method parameters.

---
## Deliverables
- ✅ First page object created.
- ✅ Locators separated from test logic.
- ✅ Clean, readable methods.

---
---


##  Test Structure & Shared State


### 1) `test.describe` block

We wrap multiple related tests inside a single `test.describe` block because:

- We want to **maintain a single browser session** across all tests.
- Without this, Playwright would execute each test independently:
  - Opening a new browser page for every test
  - Losing session state between tests (like being logged in)
- Using `test.describe` allows **grouping related tests together** and reusing setup/teardown logic.

---

### 2) `beforeAll` instead of `beforeEach`

We use `beforeAll` to open the page **once** instead of reopening for each test:

- **Shared browser session**: `page`, `loginPage`, `accountPage`, and `testEmail` are declared in the outer scope and reused.
- **No repeated navigation**: `page.goto()` is not needed inside every test. The current page after signup is directly used.
- **State preservation**: The signup session carries over into subsequent tests, like filling account information.
- **Performance**: Reduces test execution time by avoiding repeated setup/teardown.

---

## Best Practices

### ✅ Use Locator Objects
```typescript
private readonly nameInput: Locator;
private readonly signupEmailInput: Locator;
```


### Benefits

- Type safety
- IDE auto-complete
- Lazy evaluation
- Better performance
- No repeated `page.locator()` calls

---

### ❌ Avoid String Selectors
```typescript
private readonly nameInput: string = 'input[name="Name"]';
await this.page.locator(this.nameInput).fill('test');
```
---
---




## Implementation Example

### Account Info Page (Page Object)
```typescript
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

    // Initialize locators
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

  // Fill and submit the account form
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
### Login Page (Page Object)

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/Base.Page';

export interface LoginCredentials { email: string; password: string; }
export interface SignupCredentials { name: string; email: string; }

export class LoginPage extends BasePage {
  private readonly signupForm: Locator;
  private readonly nameInput: Locator;
  private readonly signupEmailInput: Locator;
  private readonly signupButton: Locator;

  private readonly loginForm: Locator;
  private readonly loginEmailInput: Locator;
  private readonly loginPasswordInput: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);

    this.signupForm = page.locator('form').filter({ hasText: 'Signup' });
    this.nameInput = this.signupForm.getByPlaceholder(/name/i);
    this.signupEmailInput = this.signupForm.getByPlaceholder(/email/i);
    this.signupButton = this.signupForm.getByRole('button', { name: /signup/i });

    this.loginForm = page.locator('form').filter({ hasText: 'Login' });
    this.loginEmailInput = this.loginForm.getByPlaceholder(/email/i);
    this.loginPasswordInput = this.loginForm.getByPlaceholder(/password/i);
    this.loginButton = this.loginForm.getByRole('button', { name: /login/i });
  }

  async open(): Promise<void> { await this.page.goto('/login'); }

  async signup(credentials: SignupCredentials): Promise<void> {
    await this.nameInput.fill(credentials.name);
    await this.signupEmailInput.fill(credentials.email);
    await this.signupButton.click();
  }

  async login(credentials: LoginCredentials): Promise<void> {
    await this.loginEmailInput.fill(credentials.email);
    await this.loginPasswordInput.fill(credentials.password);
    await this.loginButton.click();
  }
}


```
### signUp.spec.ts tests

```typescript
// tests/login.test.ts
import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '@pages/login.page';
import { AccountInfo, AccountInfoPage } from '@pages/accountInfo.page';

test.describe('Login and Signup Tests', () => {
  let page: Page;
  let loginPage: LoginPage;
  let accountPage: AccountInfoPage;
  let testEmail: string;

  // ───────────────────────────────
  // Shared setup: open browser once
  // ───────────────────────────────
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    accountPage = new AccountInfoPage(page);

    await loginPage.open();

    // Generate a unique email for this test run
    testEmail = `testuser${Date.now()}@example.com`;
  });

  test.afterAll(async () => {
    await page.close();
  });

  // ───────────────────────────────
  // Signup Tests
  // ───────────────────────────────
  test.describe('Signup functionality', () => {

    test('should display signup form elements', async () => {
      // ✅ Verify title
      await expect(page).toHaveTitle(/Automation Exercise - Signup \/ Login/i);

      // ✅ Verify signup form
      const signupForm = page.locator('form').filter({ hasText: 'Signup' });
      await expect(signupForm).toBeVisible();

      // ✅ Verify individual fields
      await expect(page.getByRole('textbox', { name: /name/i })).toBeVisible();
      await expect(signupForm.getByPlaceholder(/email/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /signup/i })).toBeVisible();
    });

    test('should perform successful signup', async () => {
      // ✅ Perform signup
      await loginPage.signup({
        name: 'Sangam',
        email: testEmail,
      });

      // ✅ Wait for account info page
      await page.waitForURL(/signup/i, { timeout: 15000 });
      await expect(page).toHaveURL(/signup/i);
    });

    test('should fill account information and create account', async () => {
      const accountData: AccountInfo = {
        title: 'Mr',
        password: 'Test@1234',
        days: '10',
        months: '5',
        years: '1990',
        newsletter: true,
        optin: false,
        firstName: 'Sangam',
        lastName: 'Kumar',
        company: 'MyCompany',
        address1: '123 Main St',
        country: 'India',
        state: 'Delhi',
        city: 'New Delhi',
        zipcode: '110001',
        mobileNumber: '9876543210'
      };

      await accountPage.fillAccountForm(accountData);

      // ✅ Wait for account created page
      await page.waitForURL('https://automationexercise.com/account_created', { timeout: 15000 });
      await expect(page).toHaveURL('https://automationexercise.com/account_created');

      // ✅ Verify "Account Created!" message
      const successMessage = page.locator('h2[data-qa="account-created"]');
      await expect(successMessage).toHaveText('Account Created!');

      // ✅ Optional: click Continue to go to homepage
      const continueBtn = page.locator('a[data-qa="continue-button"]');
      await continueBtn.click();
      await page.waitForURL('https://automationexercise.com/'); // verify homepage

    });
  });
});

```
