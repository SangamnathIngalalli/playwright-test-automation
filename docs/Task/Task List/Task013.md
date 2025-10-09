## Task 21: Create Wait Utility Class  
**Goal:** Centralize all wait/synchronization logic  

### Actions  
- Create `src/utils/WaitUtils.ts`  
- Add static methods:  
  - `waitForElementVisible(locator, options?)`  
  - `waitForElementClickable(locator, options?)`  
  - `waitForTextToAppear(locator, text, options?)`  
  - `waitForNetworkIdle(page, options?)`  
  - `waitForCondition(page, fn, arg, options?)` ← uses `page.waitForFunction`  
- Import `WaitUtils` in page objects; replace inline `waitFor` calls  
- Exercise waits against slow networks, animations, API delays  

### Deliverable  
✅ Wait utility class created  
✅ Reusable wait methods  
✅ Reduced flakiness in tests  


### Pay-off After Adopting WaitUtils

| Benefit | Evidence |
|---------|----------|
| **Reduced flakiness** | Zero `page.waitForTimeout(3000)` left in suite |
| **Centralized logic** | One file changes wait strategy for entire project |
| **Type-safe** | Locator-based signatures give full TypeScript support |
| **Flexible** | `waitForCondition` accepts any predicate, e.g. “cart count = 2” |
| **Readable** | `wait.waitForTextToAppear(...)` reads like plain English |

---

## Common Issues & Fixes (no code)

### 1️⃣ TypeScript errors: *Property 'offsetParent' does not exist on type 'Locator'*  
**Cause:** `Locator` is a Playwright handle, not a live DOM node  
**Fix:** Convert `Locator` → `ElementHandle` before passing to `page.waitForFunction`  
```ts
const elementHandle = await locator.elementHandle();
await page.waitForFunction(
  ({ el, text }) => el.textContent?.includes(text),
  { el: elementHandle, text: expectedText },
  { timeout: 10000 }
);
```

### 2️⃣ *Parameter 'el' implicitly has an 'any' type*  
**Cause:** Missing type annotation in callback  
**Fix:** Type parameter as `(el: HTMLElement | SVGElement)`  
```ts
await page.waitForFunction(
  ({ el, text }) => el.textContent?.includes(text),
  { el: elementHandle, text: expectedText },
  { timeout: 10000 }
);
```


### 3️⃣ *Expected 1-3 arguments, but got 4*  
**Cause:** `waitForFunction` accepts max 3 params (`pageFunction`, `arg`, `options`)  
**Fix:** Bundle multiple args into single object and de-structure inside function  
```ts
await page.waitForFunction(
  ({ el, text }) => el.textContent?.includes(text),
  { el: elementHandle, text: expectedText },
  { timeout: 10000 }
);
```


### 4️⃣ Overload errors in `waitForFunction`  
**Cause:** Multiple arguments supplied separately  
**Fix:** Pass one object argument; ensure callback signature matches `PageFunction`  
```ts
await page.waitForFunction(
  ({ el, text }) => el.textContent?.includes(text),
  { el: elementHandle, text: expectedText },
  { timeout: 10000 }
);
```


### 5️⃣ Re-declaring `WaitUtils` in every page  
**Cause:** Each page repeated `private wait: WaitUtils`  
**Fix:** Initialize `WaitUtils` once in `BasePage`; all pages inherit `this.wait.*`  
```ts
export class BasePage {
  protected wait: WaitUtils; // make it protected so subclasses can use it

  readonly header: HeaderComponent;
  readonly footer: FooterComponent;

  constructor(protected page: Page) {
    this.wait = new WaitUtils(page); // initialize once here
    this.header = new HeaderComponent(page);
    this.footer = new FooterComponent(page);
  }

  // ... rest of your methods
}
```
