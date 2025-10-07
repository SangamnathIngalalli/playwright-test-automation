// pages/login.page.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/Base.Page';

// Define interfaces
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
}

export class LoginPage extends BasePage {
  // ─────────── Signup Locators ───────────
  private readonly signupForm: Locator;
  private readonly nameInput: Locator;
  private readonly signupEmailInput: Locator;
  private readonly signupButton: Locator;

  // ─────────── Login Locators ───────────
  private readonly loginForm: Locator;
  private readonly loginEmailInput: Locator;
  private readonly loginPasswordInput: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);

    // Signup form elements
    this.signupForm = page.locator('form').filter({ hasText: 'Signup' });
    this.nameInput = this.signupForm.getByPlaceholder(/name/i);
    this.signupEmailInput = this.signupForm.getByPlaceholder(/email/i);
    this.signupButton = this.signupForm.getByRole('button', { name: /signup/i });

    // Login form elements
    this.loginForm = page.locator('form').filter({ hasText: 'Login' });
    this.loginEmailInput = this.loginForm.getByPlaceholder(/email/i);
    this.loginPasswordInput = this.loginForm.getByPlaceholder(/password/i);
    this.loginButton = this.loginForm.getByRole('button', { name: /login/i });
  }

  // ─────────── Actions ───────────
  async open(): Promise<void> {
    await this.page.goto('https://automationexercise.com/login');
  }

  async signup(credentials: SignupCredentials): Promise<void> {
    await this.nameInput.fill(credentials.name);
    await this.signupEmailInput.fill(credentials.email);
    await this.signupButton.click();
  }

  async login(credentials: LoginCredentials): Promise<void> {
    await this.loginEmailInput.fill(credentials.email);
    await this.loginPasswordInput.fill(credentials.password);
    await this.loginButton.click();
  }
}
