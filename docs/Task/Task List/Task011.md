## Task 19: Install and Setup Faker.js  
**Goal:** Generate dynamic test data  

### Actions  
- Install `@faker-js/faker` package  
- Create `src/utils/DataGenerator.ts` utility class  
- Add methods:  
  - `generateUser()` → random user payload  
  - `generateProduct()` → random product payload  
  - `generateEmail()` → random unique email  
- Replace static JSON data in tests with calls to `DataGenerator`  
- Document static vs dynamic data pros & cons  

### Deliverable  
✅ Faker.js integrated  
✅ DataGenerator utility created  
✅ Tests use dynamic data  


### Benefits — Static vs Dynamic Data

| Aspect           | Static Data                                      | Dynamic Data (Faker.js)                          |
|------------------|--------------------------------------------------|--------------------------------------------------|
| **Reusability**  | ❌ Same user/email reused → duplicate-key fails  | ✅ Fresh unique values every run                 |
| **Realism**      | ❌ Hard-coded “test123” stubs                    | ✅ Realistic names, addresses, emails            |
| **Maintainability**| ❌ Manual JSON updates needed                   | ✅ Zero upkeep, generated on demand              |
| **Test Coverage**| ❌ Single scenario per data set                  | ✅ Wide input variety per test run               |
| **Parallel Runs**| ❌ Collisions when same email is reused          | ✅ Safe for parallel/CI execution                |
| **Data Privacy** | ❌ Risk of leaking real customer data            | ✅ 100 % synthetic, privacy-safe data            |

---

### Problem / Bugs faced and it's soln

#### ❓Issue
- You had this TypeScript function:
```ts
async signup(credentials: SignupCredentials): Promise<void> {
  await this.nameInput.fill(credentials.name);
  await this.signupEmailInput.fill(credentials.email);
  await this.signupButton.click();
}

export interface SignupCredentials {
  name: string;
  email: string;
}
```
- And you called it like this:
```ts
await loginPage.signup({ name: user.firstName, email });
```
- You wondered why the call uses {} (curly braces) and what makes using an interface useful here.

#### 💡 Explanation
  1. Why {} is used
      - The curly braces {} create an object literal — it’s how you pass an object that matches the SignupCredentials interface.

      ```ts
      { name: user.firstName, email }
      ```
      - is equivalent to:
```ts
  const credentials = {
  name: user.firstName,
  email: email
};

await loginPage.signup(credentials);
```

- The function signup() expects one argument — an object — not separate parameters.

  2. Why using an interface is good

#### ✅ Benefits of Interface

| Benefit        | Description                                                                 |
|----------------|-----------------------------------------------------------------------------|
| **Type Safety**     | Guarantees the object contains the correct fields with the correct types.     |
| **Autocomplete**    | IDE provides IntelliSense suggestions (e.g., `.name`, `.email`).              |
| **Error Prevention**| TypeScript flags missing or mistyped fields at compile time.                  |
| **Reusability**     | One interface can be imported and reused by any function or file.             |
| **Clean Design**    | Acts as a clear contract between components, classes, or API layers.          |
