# playwright-test-automation


# Initialize npm project
npm init -y



# Install TypeScript
npm install -D typescript @types/node


# Initialize TypeScript config
npx tsc --init


# Install Playwright
npm install -D @playwright/test

# Install browsers
npx playwright install

# To Run
npx playwright test tests/ui/smoke.spec.ts              