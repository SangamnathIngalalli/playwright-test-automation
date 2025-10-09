## Task 16: Environment Configuration Setup  
**Goal:** Run the same suite against dev, staging, or prod with zero code changes  

### Actions  
- `npm install -D dotenv`  
- Create `.env.example` (committed) listing every required variable  
- Create `.env` (git-ignored) with real values  
- Add `config/env/*.ts` files (`dev.ts`, `staging.ts`, `prod.ts`)  
- Build `src/utils/EnvConfig.ts` utility that:  
  - loads `.env` via `dotenv`  
  - returns correct `BASE_URL`, `API_URL`, etc. based on `process.env.ENV`  
- Update `playwright.config.ts` to import `EnvConfig.baseURL`  
- Document variable meanings in `docs/ENV_VARIABLES.md`  

### Deliverable  
✅ Can switch environments from CLI  
✅ Environment variables loaded correctly  
✅ `EnvConfig` accessible throughout project (tests, fixtures, reporters)  

---

### ▶️ Switch Environments (CLI)

| Target  | Command |
|---------|---------|
| **Production** | `npx playwright test` |
| **Staging**    | `ENV=staging npx playwright test` |
| **Local Dev**  | `ENV=dev npx playwright test` |
| **Windows PS** | `$env:ENV="dev"; npx playwright test` |

---

### 📝 Core Environment Variables

| Var | Purpose | Sample Value |
|-----|---------|--------------|
| `ENV` | Active environment | `dev` \| `staging` \| `prod` |
| `BASE_URL` | Web app entry point | `https://automationexercise.com` |
| `API_URL` | Backend base (optional) | `${BASE_URL}/api` |

&gt; Most tests consume only `BASE_URL`; extras are future-proofing.