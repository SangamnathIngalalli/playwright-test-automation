import { Page, Locator } from '@playwright/test';

// Interface to define the form data
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

  // Action method to fill the form and submit
  async fillAccountForm(data: AccountInfo) {
    // Title
    if (data.title === 'Mr') await this.titleMr.check();
    if (data.title === 'Mrs') await this.titleMrs.check();

    // Account info
    await this.passwordInput.fill(data.password);
    await this.daySelect.selectOption(data.days);
    await this.monthSelect.selectOption(data.months);
    await this.yearSelect.selectOption(data.years);

    // Optional checkboxes
    if (data.newsletter) await this.newsletterCheckbox.check();
    if (data.optin) await this.optinCheckbox.check();

    // Personal info
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    if (data.company) await this.companyInput.fill(data.company);

    // Address info
    await this.address1Input.fill(data.address1);
    if (data.address2) await this.address2Input.fill(data.address2);
    await this.countrySelect.selectOption(data.country);
    await this.stateInput.fill(data.state);
    await this.cityInput.fill(data.city);
    await this.zipcodeInput.fill(data.zipcode);
    await this.mobileInput.fill(data.mobileNumber);

    // Submit
    await this.createAccountButton.click();
  }
}
