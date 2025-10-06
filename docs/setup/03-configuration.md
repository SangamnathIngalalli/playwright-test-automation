# Configuration Guide

## Overview
Explains the real-world Playwright setup that switches between dev / staging / prod via a single environment variable.

---

## Main Configuration (`playwright.config.ts`)

```typescript
import { defineConfig, devices } from '@playwright/test';
import { devConfig }    from './config/environments/development';
import { prodConfig }   from './config/environments/production';
import { stagingConfig } from './config/environments/staging';

// Pick the correct config at runtime
function getEnvConfig() {
  switch (process.env.NODE_ENV) {
    case 'production': return prodConfig;
    case 'staging':    return stagingConfig;
    default:           return devConfig;        // development
  }
}

const cfg = getEnvConfig();
console.log(`🎯 ${cfg.environment} → ${cfg.baseURL}`);

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL:   cfg.baseURL,
    headless:  cfg.headless,
    viewport:  cfg.viewport,
  },
  projects: [
    {
      name: 'chromium',
      use:  { ...devices['Desktop Chrome'] },
    },
  ],
});
```

---

## 1. Import Statements

```typescript
import { defineConfig, devices } from '@playwright/test';
import { devConfig }    from './config/environments/development';
import { prodConfig }   from './config/environments/production';
import { stagingConfig } from './config/environments/staging';
```
**Purpose**: Imports Playwright configuration functions and environment-specific settings  
**Why**: Allows using different settings per environment

---

## 2. Environment Selection Logic

```typescript
const getEnvironmentConfig = () =&gt; {
  const environment = process.env.NODE_ENV || 'development';
  
  switch (environment) {
    case 'production': return prodConfig;
    case 'staging':    return stagingConfig;
    case 'development':
    default:            return devConfig;
  }
};
```
**Purpose**: Selects the appropriate configuration based on NODE_ENV variable  
**Default**: Uses development configuration if no environment is specified

---

## 3. Core Configuration Options

| Key | Value | Purpose |
|-----|-------|---------|
| `testDir` | `'./tests'` | Tells Playwright where to find test files |
| `baseURL` | `config.baseURL` | Base URL for all navigation (env-specific) |
| `headless` | `config.headless` | Controls browser visibility (true/false) |
| `viewport` | `config.viewport` | Browser window size (width & height) |

---

## 4. Browser Project Configuration

```typescript
projects: [
  {
    name: 'chromium',
    use:  { ...devices['Desktop Chrome'] },
  },
]
```
**Purpose**: Configures which browser to use (Chrome in this case)  
**Simplification**: Uses only one browser for simplicity

---

## Environment Configuration Files

### Development (`config/environments/development.ts`)
```typescript
export const devConfig = {
  baseURL: 'https://www.facebook.com/',
  timeout: 30000,
  headless: false,
  viewport: { width: 1280, height: 720 },
  environment: 'development',
  retryAttempts: 1
};
```

### Production (`config/environments/production.ts`)
```typescript
export const prodConfig = {
  baseURL: 'https://www.facebook.com/',
  timeout: 20000,
  headless: true,
  viewport: { width: 1280, height: 720 },
  environment: 'production',
  retryAttempts: 2
};
```

### Staging (`config/environments/staging.ts`)
```typescript
export const stagingConfig = {
  baseURL: 'https://www.facebook.com/',
  timeout: 25000,
  headless: true,
  viewport: { width: 1280, height: 720 },
  environment: 'staging',
  retryAttempts: 1
};
```

---

## How Environment Switching Works

### 1. Set Environment Variable
```bash
# Development (default)
NODE_ENV=development npx playwright test

# Staging
NODE_ENV=staging npx playwright test

# Production
NODE_ENV=production npx playwright test
```

### 2. Configuration Loading Process
1. Playwright reads `NODE_ENV` environment variable
2. `getEnvironmentConfig()` selects appropriate config
3. Configuration values are applied to Playwright
4. Tests run with environment-specific settings

### 3. Console Output
```typescript
console.log(`Using ${config.environment} environment with URL: ${config.baseURL}`);
```
**Example Output**:  
`Using development environment with URL: https://www.facebook.com/`

---

## Key Configuration Values

| Value | Purpose | Example |
|-------|---------|---------|
| **Base URL** | Base for all navigation | `https://www.facebook.com/` |
| **Headless Mode** | Browser visibility | `false` (dev), `true` (prod/staging) |
| **Viewport Size** | Window dimensions | `{ width: 1280, height: 720 }` |
| **Timeout** | Max wait time | `30000` ms (dev), `20000` ms (prod) |
| **Retry Attempts** | Auto-retry failed tests | `1` (dev/staging), `2` (prod) |

---

## Running Tests in Different Environments

| Environment | Command | Browser | Timeout | Retries |
|-------------|---------|---------|---------|---------|
| **Development** | `NODE_ENV=development npx playwright test` | Visible | 30 s | 1 |
| **Staging** | `NODE_ENV=staging npx playwright test` | Headless | 25 s | 1 |
| **Production** | `NODE_ENV=production npx playwright test` | Headless | 20 s | 2 |

---

## Simplified Approach Benefits

1. **Easy to Understand**  
   - Minimal complexity  
   - Clear environment switching logic  

2. **Maintains Flexibility**  
   - Easy to add new environments  
   - Simple to modify settings  

3. **Performance Optimized**  
   - Production: headless for speed  
   - Development: visible browser for debugging  
   - Appropriate timeouts per environment

---

