## Task 14: Basic Playwright Configuration  
**Goal:** Create a working `playwright.config.ts` with sensible defaults  

### Actions  
- Place `playwright.config.ts` in project root  
- Point `testDir` to `./tests`  
- Set `baseURL: 'https://automationexercise.com'`  
- Add `timeout`, `actionTimeout`, `expect.timeout`  
- Define 3 projects: Chromium, Firefox, WebKit  
- Enable `screenshot: 'only-on-failure'`  
- Enable `video: 'retain-on-failure'`  
- Configure HTML reporter  
- Set `workers: 4` for parallel execution  

### Deliverable  
✅ `playwright.config.ts` created  
✅ `npx playwright test` runs without errors  
✅ HTML report opens via `npx playwright show-report`  

---

### ✅ Key Features Implemented  

| Feature | Status | Details |
|---------|--------|---------|
| `playwright.config.ts` created | ✅ | Located in project root |
| Test directory path | ✅ | `testDir: './tests'` |
| Base URL | ✅ | `baseURL: 'https://automationexercise.com'` |
| Timeout settings | ✅ | `timeout`, `actionTimeout`, `expect.timeout` |
| Cross-browser projects | ✅ | Chromium, Firefox, WebKit |
| Screenshot on failure | ✅ | `screenshot: 'only-on-failure'` |
| Video on failure | ✅ | `video: 'retain-on-failure'` |
| HTML reporter | ✅ | Generates inside `test-results/html-report/` |
| Parallel worker count | ✅ | `workers: 4` |

---

### 📁 Expected Folder Structure After Run  
```bash
playwright-test-automation/
├── tests/
│   └── *.spec.ts
├── test-results/
│   ├── html-report/       ← ✅ HTML report
│   ├── <test-name>-chromium/
│   │   ├── trace.zip
│   │   ├── video.webm     ← ✅ Video on failure
│   │   └── test-failed-1.png ← ✅ Screenshot on failure
├── playwright.config.ts   ← ✅ This file
└── package.json
```

