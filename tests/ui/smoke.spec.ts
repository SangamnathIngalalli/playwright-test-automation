// tests/smoke.spec.ts
import { test, expect } from '@fixtures/pageFixtures';
import { AccountInfo, AccountInfoPage } from '@pages/account-info.page';
import { HomePage } from '@pages/HomePage';
import { ProductsPage } from '@pages/ProductsPage';
import { testLoader } from '../../data/testDataLoader';
import { TestDataGenerator } from '../../utils/TestDataGenerator';
import { UserBuilder } from '../../builders/UserBuilder';





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
       const user = TestDataGenerator.generateUser();
       const email = TestDataGenerator.generateEmail();


      await loginPage.signup({name: user.firstName, email});


      await loginPage.waitForURL(/signup/i, { timeout: 15000 });

      await loginPage.expectURL(/signup/i, { timeout: 15000 });

    });


    test('should fill account information and create account', async  ({ loginPage, accountInfoPage }) =>{

      // Step 1: Start from login page and sign up
      await loginPage.open();

       const testEmail = `testuser${Date.now()}@example.com`;
       const user = TestDataGenerator.generateUser();
       const email = TestDataGenerator.generateEmail();


      await loginPage.signup({name: user.firstName, email});

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

      // Fill account form with the 'validUser' data
      await accountInfoPage.fillAccountForm(testLoader.getUser('validUser'));

      // Step 3: Verify account creation
      await accountInfoPage.assertAccountCreated();

      // Step 4: Continue to home
      await accountInfoPage.continueToHome();
 
    });

    test('should open Products in new tab, search for "Men Tshirt", and verify result', async ({ page, context }) => {
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


    test.only('should create account using UserBuilder', async ({ loginPage , accountInfoPage}) => {

           await loginPage.open();
            const userName = TestDataGenerator.generateUser();
            const email = TestDataGenerator.generateEmail();

                   await loginPage.signup({name: userName.firstName, email});


               const user = new UserBuilder()
    .withName('Sangam', 'Kumar')
    .withPassword('SecurePass!2024')
    .withDob('10', '5', '1990')
    .withNewsletter(true)
    .withAddress('123 Main St', 'New Delhi', 'Delhi', '110001')
    .withMobile('9876543210')
    .build();

          // Fill account form with the 'validUser' data
      await accountInfoPage.fillAccountForm(user);

        // Step 3: Verify account creation
      await accountInfoPage.assertAccountCreated();

      // Step 4: Continue to home
      await accountInfoPage.continueToHome();

    });
}); 