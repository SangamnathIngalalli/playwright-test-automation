# Task 12: Create Test Data Builders  
**Goal:** Implement Builder Pattern for test data  

### Actions  
- Create `src/builders/UserBuilder.ts` (fluent interface)  
- Add chainable methods: `withName`, `withEmail`, `withAddress`, etc.  
- Provide `build()` that returns a typed `User` object with safe defaults  
- Repeat for `ProductBuilder`, `AddressBuilder`, or any domain entity  
- Replace inline objects in tests with builder calls  
- Commit examples and brief README snippet explaining the pattern  

### Deliverable  
✅ Builder classes created  
✅ Fluent, readable data creation  
✅ Tests use builders  

---

## Benefits of Builder Pattern  

| Benefit        | How the Builder Delivers |
|----------------|--------------------------|
| **Readability** | `new UserBuilder().withName(...).withAddress(...).build()` is self-documenting |
| **Flexibility** | Override only the fields that matter; the rest use sensible defaults |
| **Maintainability** | Default values live in one place—the builder constructor |
| **Type Safety** | Full TypeScript support via underlying interfaces |
| **Test Clarity** | Tests show intent without noise from irrelevant fields |
| **Reusability** | Same builder serves login, checkout, profile, API, and UI tests |