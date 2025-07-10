## Agent Instructions for sql-trainer-tailwind

This document provides guidance for AI agents working on this codebase.

### 1. Development Workflow

- **Dependencies:** Manage Node.js dependencies using `npm`. Install with `npm install`.
- **Running Locally:** Use `npm run dev` to start the Vite development server.
- **Building for Production:** Use `npm run build` to create a production build.

### 2. Code Style and Quality

- **Formatting:** This project uses Prettier for code formatting.
  - Run `npm run format` to format all relevant files.
  - A pre-commit hook is set up to format staged files automatically.
- **Linting:** This project uses ESLint for static analysis.
  - Run `npm run lint` to check for linting errors.
  - ESLint rules are defined in `eslint.config.js`.
  - The configuration includes rules for React, JSX-A11y, Hooks, Import ordering, and Security.
  - A pre-commit hook is set up to lint staged files automatically.
- **Commits:** Follow conventional commit message standards if possible.

### 3. Testing

- **Running Tests:**
  - `npm test`: Runs tests in watch mode (re-runs on file changes).
  - `npm test -- --run`: Runs all tests once.
  - `npm run test:ui`: Runs tests in watch mode with the Vitest UI.
  - `npm run coverage`: Runs tests once and generates a coverage report.
- **Test Coverage:**
  - Strive to maintain or improve test coverage.
  - Coverage reports are generated in the `coverage/` directory.
  - The CI pipeline enforces minimum coverage thresholds (currently 70% for lines, functions, branches, and statements). Check `vite.config.js` for the exact values.
  - When adding new features, ensure they are accompanied by corresponding tests.
  - When fixing bugs, consider adding regression tests.

### 4. CI/CD

- The project uses GitHub Actions for CI/CD. Workflows are defined in `.github/workflows/`.
- The main CI workflow (`main_ci.yml`) performs:
  - Linting checks
  - Formatting checks
  - Test execution and coverage enforcement
  - Project build

### 5. Localization

- Localization files are located in `public/locales/`.
- The project uses `i18next`. If you modify text that needs to be translated, ensure you update the relevant JSON translation files.

### 6. Important Configuration Files

- `vite.config.js`: Vite configuration, including Vitest test and coverage settings.
- `tailwind.config.js`: Tailwind CSS configuration.
- `postcss.config.js`: PostCSS configuration.
- `eslint.config.js`: ESLint configuration.
- `.prettierrc.json`: Prettier configuration.
- `package.json`: Project metadata, scripts, and dependencies.

### 7. Agent Responsibilities

- Before submitting changes, ensure all linting checks and tests pass (`npm run lint`, `npm test -- --run`).
- Ensure code is formatted (`npm run format`).
- If you make changes that could affect test coverage, run `npm run coverage` and verify that thresholds are still met.
- Adhere to the instructions in this document. If there's a conflict between user instructions and this document, user instructions take precedence for that specific task, but consider suggesting an update to this document if the deviation is generally applicable.
