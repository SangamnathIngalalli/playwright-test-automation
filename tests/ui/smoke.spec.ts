// tests/smoke.spec.ts
import { test, expect } from '@fixtures/pageFixtures';
import { AccountInfo } from '@pages/account-info.page';



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


    test.only('should fill account information and create account', async  ({ loginPage, accountInfoPage }) =>{

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
}); 