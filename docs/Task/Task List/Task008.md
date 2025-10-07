## Task 10: Understand and Create Playwright Fixtures  
**Day 7-8 – 5 hours**

### Goal  
- Learn built-in fixtures and their purposes  
- Build custom fixtures that inject page objects for cleaner, reusable test setup  

### Actions  
1. **Learn Built-in Fixtures**  
   - Read official Playwright docs on fixtures  
   - Experiment with `page`, `context`, `request` and their scopes (`test`, `worker`)  
   - Trace fixture lifecycle (setup → test → teardown)  

2. **Create Custom Page Fixtures**  
   - Add `src/fixtures/index.ts` (or `fixtures.ts`)  
   - Extend `test` from `@playwright/test`  
   - Define fixtures that return `LoginPage`, `AccountInfoPage`, etc.  
   - Use the extended `test` in spec files; verify initialization & teardown  

3. **Practice & Document**  
   - Write tests that combine built-in + custom fixtures  
   - Record when to use built-in vs custom fixtures  
   - Ensure zero raw `page` usage in tests—only injected page objects  

### Deliverables  
✅ Solid grasp of fixture concept & lifecycle  
✅ Custom page fixtures working in real tests  
✅ Tests read like user intent, no boiler-plate setup  

---
##  pageFixtures.ts – Why It’s Useful
🧩 **What It Does**  
- Extends Playwright’s base `test` with custom fixtures for every page object  
- Injects fully-initialized `HomePage`, `LoginPage`, `ProductsPage`, `AccountInfoPage` into any test callback  

✅ **Benefits in One Glance**  

| Benefit | Description |
|---------|-------------|
| **Code Reuse** | Zero repetitive `new Page(...)` calls |
| **Cleaner Tests** | Test code shows **intent**, not setup boiler-plate |
| **Central Setup/Teardown** | One place to reset state, clear storage, etc. |
| **Type Safety** | Full IntelliSense & compile-time checks |
| **Scalable** | Drop new page fixtures in `pageFixtures.ts`; zero changes to existing specs |



### 1. Encapsulation & Reusability
- Each part of your app (Home, Login, Products, Account Info) is wrapped into its own Page Object Model (POM) class
- Instead of writing selectors and methods in every test, you reuse them via the fixture

```ts
class LoginPage {
  constructor(private page: Page) {}
  async login(username: string, password: string) { ... }
}
```
### 2. Cleaner Tests
- Instead of this boilerplate:
```ts
import { LoginPage } from '../pages/LoginPage';
const loginPage = new LoginPage(page);
await loginPage.login('user', 'pass');
```
You can do:
```ts
import { test, expect } from '../fixtures/pageFixtures';

test('user can log in', async ({ loginPage }) => {
  await loginPage.login('user', 'pass');
});
```
### 3. Centralized Setup / Teardown
- You can add setup or cleanup logic in fixtures (like clearing localStorage or resetting state):
- Ensures consistent state between tests

```ts
homePage: async ({ page }, use) => {
  const homePage = new HomePage(page);
  await homePage.navigate();
  await use(homePage);
  await page.evaluate(() => localStorage.clear());
},
```
### 4. Better Type Safety
- Fixtures are typed, so your IDE provides autocomplete and type hints:
``` ts
test('open products page', async ({ productsPage }) => {
  await productsPage.open();
  await productsPage.verifyProductList();
});
```
### 5. Scalability
- Add new pages or utilities without repeating code
- Used widely in professional Playwright frameworks

---

## Problems, Solutions & Lessons Learned  

### 1️⃣ TypeScript Path Alias / Import Issues  
**Problem:** Cannot find module or file  
**Cause:** `tsconfig.json` paths mis-configured or trailing commas; IDE/Playwright not reading correct config  
**Solution:**  
- Remove trailing commas in `tsconfig.json`  
- Ensure `baseUrl` and `paths` are correct  
- Use consistent import syntax  
``` ts
"baseUrl": ".",
"paths": {
  "@fixtures/*": ["fixtures/*"]
}
```

**Lesson:** Always validate alias setup before chasing runtime errors  

### 2️⃣ Fixtures in describe  
**Problem:** TS error “argument provides too few arguments”  
**Cause:** `test.describe` cannot receive fixtures—only `test()` and hooks can  
**Solution:** Inject fixtures inside `test()` or `beforeEach`  
```ts 
test.describe('Signup', () => {
  test('login', async ({ loginPage }) => { ... });
});
```
**Lesson:** Fixtures are test-scoped, not suite-scoped  

### 3️⃣ toHaveTitle / toHaveURL on custom page object  
**Problem:** TS error “Property does not exist”  
```ts
await expect(loginPage).toHaveTitle(/Signup/i);
await expect(loginPage).toHaveURL(/signup/i);
```
**Cause:** Playwright matchers live on `Page`, `Locator`, `APIResponse`—not on your class  
**Solution:** Wrap matchers in BasePage helper methods  
```ts
async expectTitle(title: string | RegExp) {
  await expect(this.page).toHaveTitle(title);
}

async expectURL(url: string | RegExp) {
  await expect(this.page).toHaveURL(url);
}

```
**Lesson:** Never call raw matchers on page objects; encapsulate them  

### 4️⃣ page is protected  
**Problem:** TS error “page is protected”  
```ts
await expect(loginPage.page).toHaveTitle(/Signup/i);
```
**Cause:** `page` is marked `protected` in BasePage  
**Solution:** Expose safe helpers or getters; or wrap actions like `expectTitle`  
```ts
get Page(): Page {
  return this.page;
}
```
**Lesson:** Keep `page` encapsulated; tests stay clean and intention-revealing  

### 5️⃣ Mixing raw page with page object locators  
**Problem:** Tests touch both `page.locator(...)` and page object methods  
```ts
await page.locator('#name').fill('John');
await loginPage.locator('#email').fill('john@example.com');
```
**Cause:** Violates POM principles  
**Solution:** Make locators private; expose only action methods  
```ts 
private nameInput = this.page.locator('#name');


async enterName(name: string) {
  await this.nameInput.fill(name);
}

```
**Lesson:** Tests express user intent, not DOM queries  

### 6️⃣ await outside async functions  
**Problem:** Syntax error “Unexpected reserved word ‘await’”  
```ts
test('...', ({ loginPage }) => {
  await loginPage.open();
});
```
**Cause:** `await` used inside non-async callback  
**Solution:** Mark callback `async`  
```ts
test('...', async ({ loginPage }) => {
  await loginPage.open();
});
```
**Lesson:** Every `await` must live inside an `async` function; `describe()` can’t be async  

### 7️⃣ Test dependencies / browser closure  
**Problem:** Test 2 fails when Test 1 closes browser  
**Cause:** Playwright creates fresh context per test; sharing state breaks isolation  
**Solution:**  
- Make each test independent  
- Use `beforeEach` with fixtures for shared setup  
- Combine sequential steps into one test if truly dependent  
```ts
await loginPage.open(); // Navigate at start of each test

Optional: use beforeEach(async ({ loginPage }) => { ... }) for setup
Or combine dependent steps into one test if sequential:

test('signup flow', async ({ loginPage }) => {
  await loginPage.open();
  await loginPage.signup(...);
  await accountInfoPage.fillAccountForm(...);
});

```
**Lesson:** Independence &gt; reuse; never rely on prior test state  

### 8️⃣ waitForURL usage  
**Problem:** TS error “Property does not exist”  
```ts
await loginPage.waitForURL(/signup/i);
```
**Cause:** Only `page` exposes `waitForURL`  
**Solution:** Add wrapper in BasePage  
```ts
async waitForURL(urlOrPattern: string | RegExp, options?: { timeout?: number }) {
  await this.page.waitForURL(urlOrPattern, options);
}
```
**Lesson:** Centralize common Playwright calls in BasePage  

### 9️⃣ Encapsulating Account Info Test  
**Problem:** Test leaked `page` and locators  
```ts
await accountInfoPage.page.locator(...).click();
```
**Solution:** Move all interactions into `AccountInfoPage` methods  
```ts
await accountInfoPage.fillAccountForm(accountData);
await accountInfoPage.assertAccountCreated();
await accountInfoPage.continueToHome();
```
**Lesson:** Tests call high-level verbs, never raw selectors  

### 🔟 BasePage Design Patterns Learned  
Essential wrappers to provide:  
- `navigate(url)`  
- `expectTitle(title)`  
- `expectURL(url)`  
- `waitForURL(pattern, options?)`  
- `click(selector)`  
- `fill(selector, text)`  
- `getText(selector)`  
- `isElementVisible(selector)`  
**Lesson:** A thin, consistent BasePage removes duplication and keeps Page Objects focused  

### 1️⃣1️⃣ POM + Test Best Practices  
- Tests invoke page object methods only—no `page.locator`  
- Locators are private fields inside page objects  
- Assertions are page object methods (`assertSignupFormVisible`, etc.)  
- Fixtures inject page objects; tests receive them via callback parameters  
- Each test is isolated; no shared state  
- Wrap every Playwright API call you reuse inside BasePage  
**Lesson:** These rules keep the suite maintainable as it scales  