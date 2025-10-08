## Task 10: Setup Test Data Files – Implementation Summary  

### 1. What We Implemented  
Externalized hard-coded test data into structured JSON and built a **centralized, type-safe loader** (`testLoader`) that serves the right user object by key—no more scattered magic strings.

✅ **Key Components**  
- `data/users.json` – complete account payloads matching AutomationExercise signup form  
- `models/AccountInfoData.ts` – strong TypeScript interface for every field  
- `data/testDataLoader.ts` – runtime loader that:
  - resolves absolute path via `path.resolve('data', 'users.json')`  
  - validates file exists and parses JSON  
  - exports `testLoader` with:
    - `users` – full dataset  
    - `getUser(key)` – type-safe accessor, throws on invalid key  
- Tests now import `testLoader` and call `getUser('validUser')` (or any key) for instant, consistent data  

**Result:** Clean, maintainable, reusable test data across the entire suite.

---

## 1. Problem: Broken module import in test files
``` ts
import { testLoader } from '../data/testDataLoader';
```
- Playwright/TypeScript threw:
``` ts
Cannot find module '../data/testDataLoader'
```
- The relative path from tests/ui/smoke.spec.ts was incorrect.
#### Cause
- The relative path ../data/testDataLoader did not point to the correct folder because the test file is two folders deep (tests/ui/).

#### Solution:
- Update the import path to correctly resolve from the test file:

``` ts
import { testLoader } from '../../data/testDataLoader';
``` 

## 2. Problem: TypeScript could not find modules in data/ and models/

#### Symptom:

- TypeScript showed errors like Cannot find module '../models/AccountInfoData' or similar.

#### Cause:

- tsconfig.json did not include the data and models directories in the compilation scope.

#### Solution:

- Update tsconfig.json include section to cover these folders:

``` ts
{
  "include": [
    "tests/**/*.ts",
    "data/**/*.ts",
    "models/**/*.ts",
    "src/**/*.ts"
  ]
}

```
## 3. Problem: SyntaxError: Unexpected token '/', "//users.js"... is not valid JSON

#### Symptom
``` ts
const loadUsers = loadJson<Record<string, AccountInfoData>>('users.json');
```
Node/Playwright threw a JSON parsing error, even though users.json appeared valid.

Cause:
- Node or Playwright was reading the wrong file (users.js) instead of users.json.
- This happened because:
   - __dirname or process.cwd() sometimes resolved incorrectly in Playwright/TS.
   - Windows path with spaces (Resume Projects) could interfere with module resolution.
   - Stray compiled .js files in the data/ folder could confuse Node.

#### Solution:
1. Ensure users.json is valid JSON (no comments, no extra slashes):
``` ts
{
  "validUser": {
    "title": "Mr",
    "password": "Test@1234",
    "days": "10",
    "months": "5",
    "years": "1990",
    "newsletter": true,
    "optin": false,
    "firstName": "Sangam",
    "lastName": "Kumar",
    "company": "MyCompany",
    "address1": "123 Main St",
    "country": "India",
    "state": "Delhi",
    "city": "New Delhi",
    "zipcode": "110001",
    "mobileNumber": "9876543210"
  }
}
```
2. Delete any stray .js files in the data/ folder.
3. Use an absolute path from the project root to load JSON safely:
``` ts
import * as fs from 'fs';
import * as path from 'path';
import { AccountInfoData } from '../models/AccountInfoData';

const usersFilePath = path.resolve('data', 'users.json'); // absolute path from project root
const fileContent = fs.readFileSync(usersFilePath, 'utf-8');
const loadUsers: Record<string, AccountInfoData> = JSON.parse(fileContent);
```
4. Optionally, add a helper in testDataLoader.ts:
``` ts
export const getTestUser = (key: string): AccountInfoData => loadUsers[key];

export const testLoader = {
  users: loadUsers,
  getUser: getTestUser,
};
```
## 4. Problem: Cannot find exported member loadUsers or testLoader
#### Symptom:
``` ts
await accountInfoPage.fillAccountForm(loadUsers);
```
- TypeScript error: Cannot find name 'loadUsers'.ts(2304)

#### Cause:
- The variable was exported from testDataLoader.ts but not imported in the test file.

#### Solution:
- Import it correctly in your test:

``` ts
import { testLoader } from '../../data/testDataLoader';

await accountInfoPage.fillAccountForm(testLoader.getUser('validUser'));
```
----

