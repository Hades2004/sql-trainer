# SQL Trainer (SQL Playground)

SQL Trainer is a lightweight, in-browser SQL playground that allows you to practice your SQL skills. It uses `sql.js` to provide an interactive SQL environment directly in your web browser, without needing any server-side setup.

## ✨ Key Features

*   **Interactive SQL Execution:** Write and run SQL queries directly in the browser.
*   **Instant Results:** View query results displayed dynamically in a table.
*   **In-Browser Database:** Powered by `sql.js`, so no external database is required.
*   **Sample Data:** Comes with a pre-populated `users` table to get you started.
*   **Dark/Light Mode:** Toggle between dark and light themes for comfortable viewing.
*   **Responsive Design:** Built with Tailwind CSS for a clean and responsive user interface.

## 🚀 Getting Started / Running Locally

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (which includes npm) installed on your system. Yarn can also be used.

### Installation & Running

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone <repository-url>
    cd sql-trainer-tailwind
    ```
    *(Replace `<repository-url>` with the actual URL of this repository if you are cloning it for the first time.)*

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

## 🛠️ How it Works

This application leverages the power of `sql.js`, a JavaScript library that allows you to create and query an SQLite database entirely in the browser.

*   **Database Initialization:** When the application loads, it initializes a new `sql.js` database instance.
*   **Default Schema:** A `users` table is created and populated with some sample data for demonstration:
    ```sql
    CREATE TABLE users (id INTEGER, name TEXT);
    INSERT INTO users VALUES (1, 'Alice'), (2, 'Bob');
    ```
*   **Query Execution:** Any SQL query you type into the text area is executed against this in-memory database. The results (or errors) are then displayed.
*   **Persistence:** Note that since the database is in-memory, any changes you make (like creating new tables or inserting more data) will be lost when you refresh the page.

## 💻 Technologies Used

*   **[React](https://reactjs.org/):** A JavaScript library for building user interfaces.
*   **[Vite](https://vitejs.dev/):** A fast build tool and development server for modern web projects.
*   **[Tailwind CSS](https://tailwindcss.com/):** A utility-first CSS framework for rapid UI development.
*   **[sql.js](https://sql.js.org/):** A JavaScript library to run SQLite on the web.
*   **[Node.js](https://nodejs.org/):** Used for the development environment and package management.

## 🚀 Deployment

This project is configured for easy deployment to GitHub Pages.

1.  **Build the project:**
    This command bundles the application for production into the `dist/` directory.
    ```bash
    npm run build
    ```
    or with yarn:
    ```bash
    yarn build
    ```

2.  **Deploy to GitHub Pages:**
    This command uses `gh-pages` to push the contents of the `dist/` directory to the `gh-pages` branch of your repository, making it live.
    ```bash
    npm run deploy
    ```
    or with yarn:
    ```bash
    yarn deploy
    ```
    Ensure your GitHub repository settings are configured to serve from the `gh-pages` branch.

## 🤝 Contributing

Contributions are welcome! If you have ideas for improvements or find any issues, please feel free to:

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

Alternatively, you can also open an issue with the tag "enhancement" or "bug".
