## Task 15: Configure Test-Level Retries  
**Goal:** Auto-retry failed tests without human intervention  

### Actions  
- Open `playwright.config.ts`  
- Add `retries: 2` inside `use:` or per-project block  
- Restrict retries to CI only via environment check (`process.env.CI`)  
- Create a flaky/failing test, run it, watch 2 retry attempts  
- Open HTML report → verify retry count shows per-attempt results  
- Document retry policy in `docs/RETRY_STRATEGY.md` or inline comment  

### Deliverable  
✅ Test retries configured  
✅ Flaky tests auto-retry (up to 2x)  
✅ Retry count visible in HTML report  

---

### Retry Strategy Documentation  

| Environment  | Retry Count | Rationale |
|--------------|-------------|-----------|
| **Local Dev** | 0 | Fail fast → instant feedback, easier debugging |
| **CI/CD**     | 2 | Absorb network hiccups, slow containers, browser launch variance |
| **Critical Tests** | override per test | `test('payment', { retries: 0 }, async () =&gt; { ... })` — prevents hiding real defects |