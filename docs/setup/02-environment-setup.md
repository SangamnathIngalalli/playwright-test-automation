## Overview
Step-by-step guide to get the Playwright + TypeScript framework running locally.  
Written for beginners and interview-ready in < 10 min.

---

## 1. Prerequisites
| Tool | Minimum Version | Purpose |
|------|-----------------|---------|
| Node.js | 16.x | JavaScript runtime |
| npm | 7.x (ships with Node) | Package manager |
| Git | any | Clone repo & version control |
| VS Code (or similar) | latest | IDE with TS support |

---

# ✅ Quick check

```bash
node -v   # should print v16+
npm -v    # should print 7+
```

# 2. Clone the pipeline
```bash
git clone https://github.com/SangamnathIngalalli/playwright-test-automation.git
cd playwright-test-automation
```

# 3. Initialise Node + TypeScript
```bash
npm init -y
npm install -D typescript @types/node
npx tsc --init
```


# 4. Add Playwright
```bash
npm install -D @playwright/test
npx playwright install
```

# 5. Verify installation
```bash
npx playwright test --version
npx playwright codegen
```

# 6. Run your first test
```bash
npx playwright test          # headless, all browsers
npx playwright test --ui     # interactive UI mode
npx playwright show-report   # view HTML report
```