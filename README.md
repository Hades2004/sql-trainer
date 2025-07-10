# SQL Trainer (SQL Playground)

SQL Trainer is a lightweight, in-browser SQL playground that allows you to practice your SQL skills. It uses `sql.js` to provide an interactive SQL environment directly in your web browser, without needing any server-side setup.

## ✨ Key Features

- **Interactive SQL Execution:** Write and run SQL queries directly in the browser.
- **Instant Results:** View query results displayed dynamically in a table.
- **In-Browser Database:** Powered by `sql.js`, so no external database is required.
- **Sample Data:** Comes with a pre-populated `users` table to get you started.
- **Dark/Light Mode:** Toggle between dark and light themes for comfortable viewing.
- **Responsive Design:** Built with Tailwind CSS for a clean and responsive user interface.

## 🚀 Getting Started / Running Locally

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (which includes npm) installed on your system. Yarn can also be used.

### Installation & Running

1.  **Clone the repository (if you haven't already):**

    ```bash
    git clone <repository-url>
    cd sql-trainer-tailwind
    ```

    _(Replace `<repository-url>` with the actual URL of this repository if you are cloning it for the first time.)_

2.  **Install dependencies:**
    Open your terminal in the project root directory and run:

    ```bash
    npm install
    ```

    or if you prefer yarn:

    ```bash
    yarn install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    or with yarn:
    ```bash
    yarn dev
    ```
    This will start the Vite development server, typically on `http://localhost:5173` (the port might vary, check your terminal output). Open this URL in your web browser to see the application.

## 🧪 Running Tests

This project uses [Vitest](https://vitest.dev/) for running unit and integration tests, along with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) for testing React components.

Available test scripts (defined in `package.json`):

- **Run all tests in watch mode:**

  ```bash
  npm test
  ```

  or

  ```bash
  yarn test
  ```

  This is useful during development as it re-runs tests on file changes.

- **Run all tests once:**

  ```bash
  npm test -- --run
  ```

  or

  ```bash
  yarn test --run
  ```

  _(Note: the extra `--` is to pass the `--run` flag to the `vitest` command itself, not to npm/yarn)._

- **Run tests with a UI:**
  Vitest provides an interactive UI for a better testing experience.

  ```bash
  npm run test:ui
  ```

  or

  ```bash
  yarn test:ui
  ```

  This will open a browser window where you can see test results, filter tests, etc.

- **Generate coverage report:**
  To see test coverage, run:
  ```bash
  npm run coverage
  ```
  or
  ```bash
  yarn coverage
  ```
  This will output a coverage summary to the console and generate a full HTML report in the `coverage/` directory.

### Test Structure

Tests are co-located with the components or pages they test (e.g., `src/components/Navbar.test.jsx` tests `src/components/Navbar.jsx`). This makes it easy to find tests related to a specific piece of code.

The tests aim to cover:

- Component rendering and basic structure.
- User interactions (e.g., button clicks, form inputs simulated via `userEvent`).
- Logic within components, often by mocking dependencies (like `sql.js` or data files) to isolate the unit under test.
- Correct feedback and state changes based on user actions.

## 🧹 Linting and Formatting

This project uses [ESLint](https://eslint.org/) for identifying and reporting on patterns in JavaScript and JSX, and [Prettier](https://prettier.io/) for enforcing consistent code style.

- **Run Linter:**
  Checks for code quality and potential errors.

  ```bash
  npm run lint
  ```

  or

  ```bash
  yarn lint
  ```

  Many linting issues can be fixed automatically by running:

  ```bash
  npm run lint -- --fix
  ```

  or

  ```bash
  yarn lint --fix
  ```

- **Run Formatter:**
  Formats all relevant files in the project according to the Prettier configuration.
  ```bash
  npm run format
  ```
  or
  ```bash
  yarn format
  ```
  To check if files are formatted correctly without modifying them (useful for CI):
  ```bash
  npx prettier --check "src/**/*.{js,jsx,json,css,md}" "*.{js,json,md}" ".github/**/*.{yml,md}"
  ```

**Pre-commit Hooks:**
This project uses [Husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/okonet/lint-staged) to automatically run ESLint (with `--fix`) and Prettier on staged files before each commit. This helps ensure that code pushed to the repository adheres to the project's coding standards and formatting guidelines.

### Code Quality

- **PropTypes**: React components use `PropTypes` for runtime type checking of props, ensuring better component API clarity and easier debugging. This is enforced by the `react/prop-types` ESLint rule.

## 📂 Project Structure

A brief overview of the main directories and files:

- **`.github/`**: Contains GitHub Actions workflows (CI, deployment) and Dependabot configuration.
- **`public/`**: Static assets that are served directly.
  - **`public/locales/`**: Translation files for internationalization (i18n).
- **`src/`**: Contains all the source code for the application.
  - **`src/components/`**: Reusable React components (e.g., `Navbar`, `SqlEditor`). Test files are co-located here (e.g., `Navbar.test.jsx`).
  - **`src/data/`**: Static data files like quiz questions (`quizQuestions.json`) and SQL tips (`sqlTips.json`).
  - **`src/pages/`**: React components that represent different pages/views of the application (e.g., `HomePage`, `QuizPage`). Test files are co-located.
  - **`src/App.jsx`**: The main application component, sets up routing and global layout.
  - **`src/main.jsx`**: The entry point of the React application.
  - **`src/i18n.js`**: Configuration for `i18next` (internationalization).
  - **`src/index.css`**: Global styles and Tailwind CSS imports.
- **`eslint.config.js`**: ESLint configuration file.
- **`.prettierrc.json`**: Prettier configuration file.
- **`package.json`**: Project metadata, dependencies, and scripts.
- **`vite.config.js`**: Vite configuration.
- **`tailwind.config.js`**: Tailwind CSS configuration.
- **`postcss.config.js`**: PostCSS configuration (used by Tailwind).

## 🛠️ How it Works

This application leverages the power of `sql.js`, a JavaScript library that allows you to create and query an SQLite database entirely in the browser.

- **Database Initialization:** When the application loads, it initializes a new `sql.js` database instance.
- **Default Schema:** A `users` table is created and populated with some sample data for demonstration:
  ```sql
  CREATE TABLE users (id INTEGER, name TEXT);
  INSERT INTO users VALUES (1, 'Alice'), (2, 'Bob');
  ```
- **Query Execution:** Any SQL query you type into the text area is executed against this in-memory database. The results (or errors) are then displayed.
- **Persistence:** Note that since the database is in-memory, any changes you make (like creating new tables or inserting more data) will be lost when you refresh the page.

## 💻 Technologies Used

- **[React](https://reactjs.org/):** A JavaScript library for building user interfaces.
- **[Vite](https://vitejs.dev/):** A fast build tool and development server for modern web projects.
- **[Tailwind CSS](https://tailwindcss.com/):** A utility-first CSS framework for rapid UI development.
- **[sql.js](https://sql.js.org/):** A JavaScript library to run SQLite on the web.
- **[Node.js](https://nodejs.org/):** Used for the development environment and package management.

## 🚀 Deployment

This project is configured for easy deployment to GitHub Pages. It automatically deployes every time something is commited to the main branch.

## 🤝 Contributing

Contributions are welcome! We value feedback and contributions from the community. Please see our [**Contributing Guidelines (CONTRIBUTING.md)**](CONTRIBUTING.md) for detailed information on how to get started, our coding standards, and the pull request process.

You can also open an issue with the tag "enhancement" or "bug". We also adhere to a [**Code of Conduct (CODE_OF_CONDUCT.md)**](CODE_OF_CONDUCT.md) to ensure a welcoming environment for everyone.
