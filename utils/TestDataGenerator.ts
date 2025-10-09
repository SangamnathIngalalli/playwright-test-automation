// src/utils/TestDataGenerator.ts
import { faker } from '@faker-js/faker';
import { AccountInfoData } from '../models/AccountInfoData';

export class TestDataGenerator {
  /**
   * Generate a random valid email
   */
  static generateEmail(): string {
    return faker.internet.email().toLowerCase();
  }

  /**
   * Generate random user account data compatible with AutomationExercise.com
   */
  static generateUser(): AccountInfoData {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    return {
      title: faker.helpers.arrayElement(['Mr', 'Mrs', 'Ms']),
      password: faker.internet.password({ length: 10, prefix: 'Test@' }),
      days: String(faker.number.int({ min: 1, max: 28 })),
      months: String(faker.number.int({ min: 1, max: 12 })),
      years: String(faker.number.int({ min: 1950, max: 2005 })),
      newsletter: faker.datatype.boolean(),
      optin: faker.datatype.boolean(),
      firstName,
      lastName,
      company: faker.company.name(),
      address1: faker.location.streetAddress(),
      country: 'India', // Site only accepts India in dropdown
      state: faker.location.state(),
      city: faker.location.city(),
      zipcode: faker.location.zipCode('#####'),
      mobileNumber: faker.phone.number('9#########'), // 10-digit Indian mobile
    };
  }

  /**
   * Generate random product search term (from known product names)
   */
  static generateProductSearchTerm(): string {
    const products = [
      'Men Tshirt',
      'Blue Top',
      'Dress',
      'Jeans',
      'Saree',
      'Tops',
      'Winter Top',
      'Summer White Top'
    ];
    return faker.helpers.arrayElement(products);
  }
}