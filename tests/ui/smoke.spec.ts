// tests/smoke.spec.ts
import { test, expect } from '@fixtures/pageFixtures';
import { AccountInfo } from '@pages/account-info.page';
import { HomePage } from '@pages/HomePage';
import { ProductsPage } from '@pages/ProductsPage';



  // ───────────────────────────────
  // Signup Tests
  // ───────────────────────────────
  test.describe('Signup functionality', () => {

    test('should display signup form elements', async ({loginPage}) => {

        await loginPage.open();                   // Navigate to login page
        await loginPage.assertOnLoginPage();      // Check page title
        await loginPage.assertSignupFormVisible(); // Check all signup form elements
    });

    test('should perform successful signup',async ({loginPage})=>{

      await loginPage.open();   // Make sure you are on the login page

       const testEmail = `testuser${Date.now()}@example.com`;

      await loginPage.signup({
        name: 'Sangam',
        email: testEmail,
      });


      await loginPage.waitForURL(/signup/i, { timeout: 15000 });

      await loginPage.expectURL(/signup/i, { timeout: 15000 });

    });


    test('should fill account information and create account', async  ({ loginPage, accountInfoPage }) =>{

      // Step 1: Start from login page and sign up
      await loginPage.open();

      const testEmail = `testuser${Date.now()}@example.com`;


      await loginPage.signup({
        name: 'Sangam',
        email: testEmail,
      });

      // Step 2: Fill account details
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

      await accountInfoPage.fillAccountForm(accountData);

      // Step 3: Verify account creation
      await accountInfoPage.assertAccountCreated();

      // Step 4: Continue to home
      await accountInfoPage.continueToHome();
 
    });

    test.only('should open Products in new tab, search for "Men Tshirt", and verify result', async ({ page, context }) => {
          // Step 1: Open home page
          const homePage = new HomePage(page);
          await homePage.visit();

          // Step 2: Open Products page in a NEW TAB
          // We'll simulate Ctrl+Click (or Cmd+Click on Mac) to open in new tab
          const [newPage] = await Promise.all([
            context.waitForEvent('page'),
          homePage.header.goToProductsInNewTab()
          ]);

          // Optional: Wait for new tab to load
          await newPage.waitForLoadState('networkidle');

          // Step 3: Use ProductsPage on the new tab
          const productsPage = new ProductsPage(newPage);
          await productsPage.searchProduct('Men Tshirt');

          // Step 4: Verify search result
          await productsPage.assertSearchResultsContain('Men Tshirt');

          // Step 5: Close the new tab
          await newPage.close();

          // Optional: Verify original tab is still active
          await expect(page).toHaveURL('/');
      });
}); 