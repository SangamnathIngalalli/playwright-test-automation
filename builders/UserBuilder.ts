// src/builders/UserBuilder.ts
import { AccountInfoData } from '../models/AccountInfoData';

export class UserBuilder {
  private user: AccountInfoData;

  constructor() {
    // Set intelligent defaults
    this.user = {
      title: 'Mr',
      password: 'Test@1234',
      days: '1',
      months: '1',
      years: '1990',
      newsletter: false,
      optin: false,
      firstName: 'John',
      lastName: 'Doe',
      company: 'Automation Inc',
      address1: '123 Test Street',
      country: 'India', // Only accepted value on site
      state: 'Test State',
      city: 'Test City',
      zipcode: '100001',
      mobileNumber: '9876543210',
    };
  }

  withTitle(title: string): this {
    this.user.title = title;
    return this;
  }

  withPassword(password: string): this {
    this.user.password = password;
    return this;
  }

  withDob(days: string, months: string, years: string): this {
    this.user.days = days;
    this.user.months = months;
    this.user.years = years;
    return this;
  }

  withNewsletter(newsletter: boolean): this {
    this.user.newsletter = newsletter;
    return this;
  }

  withOptIn(optin: boolean): this {
    this.user.optin = optin;
    return this;
  }

  withName(firstName: string, lastName: string): this {
    this.user.firstName = firstName;
    this.user.lastName = lastName;
    return this;
  }

  withAddress(address: string, city: string, state: string, zipcode: string): this {
    this.user.address1 = address;
    this.user.city = city;
    this.user.state = state;
    this.user.zipcode = zipcode;
    return this;
  }

  withMobile(mobileNumber: string): this {
    this.user.mobileNumber = mobileNumber;
    return this;
  }

  build(): AccountInfoData {
    return { ...this.user };
  }
}