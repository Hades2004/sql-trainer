# Contributing to SQL Trainer

First off, thank you for considering contributing to SQL Trainer! We welcome any help to make this project better. Whether it's reporting a bug, discussing improvements, or submitting a pull request, your contribution is valuable.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Fork & Clone](#fork--clone)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [Making Changes](#making-changes)
  - [Branching](#branching)
  - [Coding Standards](#coding-standards)
    - [Style and Formatting](#style-and-formatting)
    - [Linting](#linting)
    - [PropTypes](#proptypes)
  - [Commit Messages](#commit-messages)
- [Testing](#testing)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md) (Note: We'll need to create this file or remove this reference if not applicable). Please follow it in all your interactions with the project.

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (which includes npm) installed. Refer to the `README.md` for specific version recommendations if any.

### Fork & Clone

1.  **Fork** the repository on GitHub.
2.  **Clone** your fork locally:
    ```bash
    git clone https://github.com/your-username/sql-trainer-tailwind.git
    cd sql-trainer-tailwind
    ```

### Installation

Install the project dependencies:

```bash
npm install
```

### Running Locally

Start the development server:

```bash
npm run dev
```

This will typically make the application available at `http://localhost:5173`. Check your terminal output for the exact URL. For more details, see the [Running Locally section in README.md](README.md#running-locally).

## Making Changes

### Branching

Create a new branch for your feature or bug fix:

```bash
git checkout -b feature/your-amazing-feature
# or
git checkout -b fix/issue-description
```

Use a descriptive branch name (e.g., `feature/add-quiz-timer`, `fix/navbar-dropdown-bug`).

### Coding Standards

#### Style and Formatting

This project uses [Prettier](https://prettier.io/) for code formatting. Code is automatically formatted before each commit using Husky and lint-staged. You can also run the formatter manually:

```bash
npm run format
```

Please ensure your code adheres to the established style.

#### Linting

We use [ESLint](https://eslint.org/) for identifying and reporting on patterns in JavaScript and JSX. Code is automatically linted (with auto-fix attempts) before each commit. You can run the linter manually:

```bash
npm run lint
```

To attempt automatic fixes:

```bash
npm run lint -- --fix
```

Please address any linting errors or warnings before submitting your changes.

#### PropTypes

All React components that accept props must use `PropTypes` for type checking. This helps ensure component APIs are clear and catches prop-related bugs early. The ESLint rule `react/prop-types` is set to `error` to enforce this.

Example:

```jsx
import PropTypes from 'prop-types';

function MyComponent({ name, count }) {
  // ...
}

MyComponent.propTypes = {
  name: PropTypes.string.isRequired,
  count: PropTypes.number,
};

MyComponent.defaultProps = {
  count: 0,
};
```

### Commit Messages

Follow conventional commit message standards:

- Start with a type (e.g., `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`).
- Use a concise subject line (max 50 chars).
- Provide a more detailed body if necessary, separated by a blank line.

Example:

```
feat: Add dark mode toggle to settings

Implement a new toggle switch in the user settings page
that allows users to manually switch between light and dark themes.
The preference is saved to localStorage.
```

## Testing

This project uses [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/). Before submitting a pull request, please ensure all tests pass and that you've added new tests for any new features or bug fixes.

- Run all tests in watch mode:
  ```bash
  npm test
  ```
- Run all tests once:
  ```bash
  npm test -- --run
  ```
- Generate a coverage report:
  ```bash
  npm run coverage
  ```
  Aim to maintain or improve test coverage. The report is generated in the `coverage/` directory.

Refer to the [Running Tests section in README.md](README.md#running-tests) for more details.

## Submitting a Pull Request

1.  Push your changes to your fork:
    ```bash
    git push origin feature/your-amazing-feature
    ```
2.  Open a pull request (PR) against the `main` branch of the original repository.
3.  Provide a clear title and description for your PR. Explain the problem you're solving and the changes you've made. Reference any related issues (e.g., "Closes #123").
4.  Ensure all CI checks (tests, linting, formatting) pass.
5.  Be prepared to discuss your changes and make adjustments if requested by the maintainers.

## Reporting Bugs

If you find a bug, please open an issue on GitHub. Include:

- A clear and descriptive title.
- Steps to reproduce the bug.
- What you expected to happen.
- What actually happened (including any error messages or screenshots).
- Your environment (browser, OS, etc., if relevant).

## Suggesting Enhancements

If you have an idea for an enhancement, feel free to open an issue to discuss it. This allows for feedback before you potentially spend time on an implementation.

Thank you for contributing!
