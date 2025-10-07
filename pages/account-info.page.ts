// pages/account-info.page.ts
import { BasePage } from '@pages/base.page';
import { Page, expect } from '@playwright/test';

export interface AccountInfo {
  title: string;
  password: string;
  days: string;
  months: string;
  years: string;
  newsletter: boolean;
  optin: boolean;
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
}

export class AccountInfoPage extends BasePage {
  // Example locators
  private titleRadio = (title: string) => this.page.locator(`input[name="title"][value="${title}"]`);
  private passwordInput = this.page.locator('#password');
  private daysSelect = this.page.locator('#days');
  private monthsSelect = this.page.locator('#months');
  private yearsSelect = this.page.locator('#years');
  private newsletterCheckbox = this.page.locator('#newsletter');
  private optinCheckbox = this.page.locator('#optin');
  private firstNameInput = this.page.locator('#first_name');
  private lastNameInput = this.page.locator('#last_name');
  private companyInput = this.page.locator('#company');
  private addressInput = this.page.locator('#address1');
  private countrySelect = this.page.locator('#country');
  private stateInput = this.page.locator('#state');
  private cityInput = this.page.locator('#city');
  private zipcodeInput = this.page.locator('#zipcode');
  private mobileInput = this.page.locator('#mobile_number');
  private createAccountButton = this.page.locator('button[data-qa="create-account"]');
  private accountCreatedHeader = this.page.locator('h2[data-qa="account-created"]');
  private continueButton = this.page.locator('a[data-qa="continue-button"]');

  async fillAccountForm(data: AccountInfo) {
    await this.titleRadio(data.title).check();
    await this.passwordInput.fill(data.password);
    await this.daysSelect.selectOption(data.days);
    await this.monthsSelect.selectOption(data.months);
    await this.yearsSelect.selectOption(data.years);
    if (data.newsletter) await this.newsletterCheckbox.check();
    if (!data.optin) await this.optinCheckbox.uncheck();
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.companyInput.fill(data.company);
    await this.addressInput.fill(data.address1);
    await this.countrySelect.selectOption({ label: data.country });
    await this.stateInput.fill(data.state);
    await this.cityInput.fill(data.city);
    await this.zipcodeInput.fill(data.zipcode);
    await this.mobileInput.fill(data.mobileNumber);
    await this.createAccountButton.click();
  }

  async assertAccountCreated() {
    await expect(this.accountCreatedHeader).toHaveText('Account Created!');
    await this.waitForURL('https://automationexercise.com/account_created');
  }

  async continueToHome() {
    await this.continueButton.click();
    await this.waitForURL('https://automationexercise.com/');
  }
}
