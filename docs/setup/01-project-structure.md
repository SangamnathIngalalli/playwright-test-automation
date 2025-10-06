# Project Structure

## Overview
This document explains the folder structure and organization of the Playwright test automation framework. The structure follows industry best practices for maintainability and scalability.

## Directory Layout
```
playwright-test-automation/
├── tests/                     # Test files organized by type
│   ├── ui/                    # UI-interaction tests
│   ├── api/                   # API-endpoint tests
│   └── e2e/                   # End-to-end workflow tests
│
├── pages/                     # Page-Object-Model classes
│   ├── base.page.ts           # Base page with common methods
│   ├── login.page.ts          # Facebook-login page
│   └── common/                # Shared page components
│
├── api/                       # API-testing utilities
│   ├── base.api.ts            # Base API class
│   └── endpoints/             # Specific API endpoints
│
├── utils/                     # Helper functions & utilities
│   ├── constants.ts           # Application constants
│   ├── helpers/               # Utility functions
│   └── test-data.ts           # Test-data management
│
├── config/                    # Configuration files
│   ├── test.config.ts         # Test-framework config
│   └── environments/          # Environment-specific configs
│
├── docs/                      # Project documentation
│   ├── setup/                 # Setup guides
│   ├── implementation/        # Implementation details
│   └── testing/               # Testing procedures
│
├── src/                       # Source code (if needed)
│
├── playwright.config.ts       # Playwright framework configuration
├── package.json               # Project dependencies & scripts
├── tsconfig.json              # TypeScript compiler configuration
├── .env.example               # Environment-variables template
└── .gitignore                 # Git ignore rules
```