// src/pages/ProductsPage.ts
import { expect, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class ProductsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

/**
   * Navigate to /products and wait for default product listing
*/
  async visit() {
    await this.navigate('/products');
    await this.page.waitForSelector('.features_items');
  }

  /**
   * Perform a product search using the top search bar
   */
  async searchProduct(query: string): Promise<void> {
    await this.page.fill('#search_product', query);
    await this.page.click('#submit_search');

    // Wait for the page to update to "Searched Products"
    await expect(this.page.locator('h2.title.text-center')).toHaveText('Searched Products');
  }


/**
   * Get all visible product names from the product grid
   * @returns Array of product name strings (e.g., ["Blue Top", "Men Tshirt", ...])
*/
 async getSearchResults(): Promise<string[]> {
    return await this.page.locator('.single-products .productinfo p').allTextContents();
  }


    /**
   * Assert that at least one product is displayed and matches the search term (case-insensitive)
   */
  async assertSearchResultsContain(expectedText: string) {


    const results = await this.getSearchResults();

    expect(results.length).toBeGreaterThan(0);

    
    for (const productName of results) {
      expect(productName.toLowerCase()).toContain(expectedText);
    }


  }
}