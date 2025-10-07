// src/fixtures/pageFixtures.ts
import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/login.page';
import { ProductsPage } from '../pages/ProductsPage';
import { AccountInfoPage } from '../pages/account-info.page';

// Extend the base test with custom page fixtures
export const test = base.extend<{
  homePage: HomePage;
  loginPage: LoginPage;
  productsPage: ProductsPage;
  accountInfoPage: AccountInfoPage;
}>({
  // Fixture: homePage
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
    // Optional teardown (e.g., clear localStorage)
  },

  // Fixture: loginPage
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  // Fixture: productsPage
  productsPage: async ({ page }, use) => {
    const productsPage = new ProductsPage(page);
    await use(productsPage);
  },

  // Fixture: accountInfoPage
  accountInfoPage: async ({ page }, use) => {
    const accountInfoPage = new AccountInfoPage(page);
    await use(accountInfoPage);
  },
});

// Re-export expect for consistency
export { expect } from '@playwright/test'; 