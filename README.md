## Playwright Test Automation

Modern, TypeScript-based UI test automation framework built with Playwright. It showcases clean page objects, custom fixtures, environment-driven configuration, data builders, and rich reporting. Optimized for readability, scalability, and CI.

---

### Highlights
- **TypeScript + Playwright**: Fast, reliable, parallelized tests
- **Clean POM**: `pages/` with reusable `BasePage`, header/footer components
- **Custom fixtures**: Centralized page objects via `fixtures/pageFixtures.ts`
- **Environment configs**: `config/environments/{dev,staging,prod}.ts` toggled by `ENV`
- **Self‑healing locators**: `utils/SmartLocator.ts` fallbacks for resilient tests
- **Data-driven**: `data/users.json` + `data/testDataLoader.ts`
- **Builder pattern**: `builders/UserBuilder.ts` for clean test data creation
- **HTML report & traces**: `reports/html-report/`, `test-results/`

---

### Design Patterns Used
- **Page Object Model (POM)**: Encapsulates page behavior and selectors in `pages/` (e.g., `Base.Page.ts`, `HomePage.ts`, `login.page.ts`, `ProductsPage.ts`, `account-info.page.ts`).
- **Component Object Model**: Reusable UI parts in `pages/components/HeaderComponent.ts` and `pages/components/FooterComponent.ts` composed into pages.
- **Dependency Injection via Fixtures**: `fixtures/pageFixtures.ts` injects typed page objects (`homePage`, `loginPage`, etc.) into tests, improving test readability and isolation.
- **Test Data Builder**: `builders/UserBuilder.ts` provides a fluent API to construct valid `AccountInfoData` with sensible defaults.
- **Self‑healing Locator Strategy**: `utils/SmartLocator.ts` attempts a primary locator, then fallbacks, increasing robustness against minor UI changes.
- **Repository/Data Loader**: `data/testDataLoader.ts` centralizes access to `data/users.json`, validating keys and exposing a simple API.
- **Environment-based Configuration (Strategy)**: `utils/Config.ts` selects from `config/environments/{dev,staging,prod}.ts` at runtime using `ENV`, exposing a stable interface (`BASE_URL`, `API_URL`).
- **Utilities/Helpers Layer**: `utils/WaitUtils.ts` and helpers consolidate common waits and interactions to keep page objects lean.

---

### Project Structure
```text
.
├─ api/
├─ builders/
│  └─ UserBuilder.ts
├─ config/
│  └─ environments/
│     ├─ dev.ts
│     ├─ prod.ts
│     └─ staging.ts
├─ data/
│  ├─ testDataLoader.ts
│  └─ users.json
├─ fixtures/
│  └─ pageFixtures.ts
├─ models/
│  └─ AccountInfoData.ts
├─ pages/
│  ├─ Base.Page.ts
│  ├─ components/
│  │  ├─ FooterComponent.ts
│  │  └─ HeaderComponent.ts
│  ├─ HomePage.ts
│  ├─ ProductsPage.ts
│  ├─ account-info.page.ts
│  └─ login.page.ts
├─ tests/
│  └─ ui/
│     ├─ basic-test.spec.ts
│     └─ smoke.spec.ts
├─ playwright.config.ts
├─ tsconfig.json
└─ utils/
   ├─ Config.ts
   ├─ SmartLocator.ts
   └─ WaitUtils.ts
```

---

### Prerequisites
- Node.js 18+
- npm 9+

---

### Setup
```bash
# 1) Install dependencies
npm install

# 2) Install Playwright browsers
npx playwright install

# 3) (Optional) set environment
# Values: dev | staging | prod (default: prod)
$env:ENV="staging"   # PowerShell (Windows)
# export ENV=staging  # macOS/Linux
```

---

### Run Tests
```bash
# Run all tests in parallel
npm test

# Run only UI tests
npm run test:ui

# Headed mode (see the browser)
npm run test:ui:headed

# Debug mode with inspector
npm run test:ui:debug

# Filter by title
npx playwright test -g "navigate to Facebook"
```

Artifacts and reports:
- HTML report: `reports/html-report/index.html` → open with `npm run report`
- Traces, videos, screenshots: `test-results/`

```bash
# Open the latest HTML report
npm run report

# Open a specific trace
npx playwright show-trace test-results/<trace.zip>
```

---

### Environment Execution Examples
Set the `ENV` variable to switch configs in `utils/Config.ts` (values: `dev`, `staging`, `prod`). Examples for different shells:

- PowerShell (Windows):
```powershell
$env:ENV="prod"; npx playwright test tests/ui/smoke.spec.ts
$env:ENV="staging"; npx playwright test
```

- CMD (Windows):
```cmd
set ENV=prod && npx playwright test tests\ui\smoke.spec.ts
set ENV=staging && npx playwright test
```

- Bash/Zsh (macOS/Linux):
```bash
ENV=prod npx playwright test tests/ui/smoke.spec.ts
ENV=staging npx playwright test
```

Notes:
- `ENV` defaults to `prod` if not set.
- The selected environment resolves to `config/environments/<env>.ts` via `utils/Config.ts`.
- You can combine with filters, headed/debug modes, etc. For example:
```bash
ENV=staging npx playwright test -g "login"
ENV=dev npx playwright test --headed
```

---

### Key Design Pieces
- **Base Page Object**: common navigation, waits, actions
```ts
// pages/Base.Page.ts (excerpt)
export class BasePage {
  constructor(protected page: Page) {}
  async open(): Promise<void> { await this.page.goto(Config.BASE_URL); }
  async click(selector: string): Promise<void> { await this.page.locator(selector).click(); }
}
```

- **Custom Fixtures**: injectable, typed page objects per test
```ts
// fixtures/pageFixtures.ts (excerpt)
export const test = base.extend<{ homePage: HomePage; loginPage: LoginPage; }>({
  homePage: async ({ page }, use) => { await use(new HomePage(page)); },
  loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
});
```

- **Self‑healing Locators**: attempt primary then fallbacks
```ts
// utils/SmartLocator.ts (excerpt)
export class SmartLocator {
  static async find(page: Page, primary: string, fallbacks: string[]): Promise<Locator> {
    if (await page.locator(primary).isVisible({ timeout: 1000 })) return page.locator(primary);
    for (const fb of fallbacks) {
      const loc = page.locator(fb);
      try { await loc.waitFor({ state: 'visible', timeout: 1000 }); return loc; } catch {}
    }
    throw new Error('All locators failed');
  }
}
```

- **Environment Config**: switch by `ENV`
```ts
// utils/Config.ts (excerpt)
dotenv.config();
const env = process.env.ENV?.toLowerCase() || 'prod';
export const Config = { get BASE_URL() { return config.baseUrl; } };
```

- **Data‑driven Tests**: JSON + typed loader
```ts
// data/testDataLoader.ts (excerpt)
const users = JSON.parse(fs.readFileSync(path.resolve('data', 'users.json'), 'utf-8'));
export const testLoader = { users, getUser: (key: string) => users[key] };
```

---

### Example Test
```ts
import { test, expect } from '@playwright/test';

test('should navigate to Facebook successfully', async ({ page }) => {
  await page.goto('https://www.facebook.com/');
  await expect(page).toHaveURL(/facebook\.com\/?$/);
  await expect(page).toHaveTitle(/Facebook/);
});
```

---

### CI Integration
- Install browsers in CI: `npx playwright install --with-deps`
- Cache `~/.cache/ms-playwright` to speed up builds
- Publish `reports/html-report` as an artifact

Example GitHub Actions outline:
```yaml
name: tests
on: [push, pull_request]
jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 18 }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm test
      - run: npm run report -- --open=never
      - uses: actions/upload-artifact@v4
        with:
          name: html-report
          path: reports/html-report
```

---

### Learning Path (Task List)
A quick index to my step-by-step learning and implementation notes.

| Task ID | Title | Link |
| --- | --- | --- |
| Task005 | Playwright Base Framework and playwright.config.ts | [Task005](docs/Task/Task%20List/Task005.md) |
| Task006 | Create Your First Page Object | [Task006](docs/Task/Task%20List/Task006.md) |
| Task007 | Create Page Component Pattern | [Task007](docs/Task/Task%20List/Task007.md) |
| Task008 | Understand and Create Playwright Fixtures | [Task008](docs/Task/Task%20List/Task008.md) |
| Task009 | Implement Multi-tab / Window Testing | [Task009](docs/Task/Task%20List/Task009.md) |
| Task010 | Setup Test Data Files – Implementation Summary | [Task010](docs/Task/Task%20List/Task010.md) |
| Task011 | Install and Setup Faker.js | [Task011](docs/Task/Task%20List/Task011.md) |
| Task012 | Create Test Data Builders | [Task012](docs/Task/Task%20List/Task012.md) |
| Task013 | Create Wait Utility Class | [Task013](docs/Task/Task%20List/Task013.md) |
| Task014 | Basic Playwright Configuration | [Task014](docs/Task/Task%20List/Task014.md) |
| Task015 | Configure Test-Level Retries | [Task015](docs/Task/Task%20List/Task015.md) |
| Task016 | Environment Configuration Setup | [Task016](docs/Task/Task%20List/Task016.md) |
| Task017 | Implement Self-Healing Test Capabilities | [Task017](docs/Task/Task%20List/Task017.md) |

---

### How to Review This Repo (for Interviewers)
- Start at `playwright.config.ts` to see timeouts, reporters, and projects
- Check `pages/` for page objects and components
- Open `fixtures/pageFixtures.ts` for injected fixtures
- Review `utils/SmartLocator.ts` for self-healing approach
- Look at `data/` + `builders/UserBuilder.ts` for test data patterns
- Run `npm test` then open `reports/html-report/index.html`

---

### License
ISC
