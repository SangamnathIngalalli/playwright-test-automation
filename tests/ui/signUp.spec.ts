import { BasePage } from '@pages/Base.Page';
import {test,expect} from '@playwright/test';


test.describe('SignUp tests',()=>{


    test('should navigate to login page and verify elements', async ({page}) =>{


        const basePage =  new BasePage(page);
            
        await basePage.navigate('/login');
        
        const titlePage = await basePage.getTitle();
        console.log('Page title:', titlePage);
        await expect(page).toHaveTitle(/login/i);


        await page.getByRole('textbox', { name: 'Name' }).click();
        await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address').click();
        await page.getByRole('button', { name: 'Signup' }).click();

        await expect(page).toHaveURL(/.*login/i);


     });
});
