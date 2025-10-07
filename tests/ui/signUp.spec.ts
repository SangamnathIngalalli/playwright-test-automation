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
