import { useState, useEffect } from "react";
import initSqlJs from "sql.js";

export default function App() {
  const [db, setDb] = useState(null);
  const [query, setQuery] = useState("SELECT * FROM users;");
  const [results, setResults] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored === null) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } else {
      return stored === "true";
    }
  });

  useEffect(() => {
    const loadDb = async () => {
      const SQL = await initSqlJs({ locateFile: file => `https://sql.js.org/dist/${file}` });
      const newDb = new SQL.Database();
      newDb.run("CREATE TABLE users (id INTEGER, name TEXT); INSERT INTO users VALUES (1, 'Alice'), (2, 'Bob');");
      setDb(newDb);
    };
    loadDb();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const runQuery = () => {
    try {
      const res = db.exec(query);
      setResults(res);
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">🧪 SQL Playground</h1>
        <button
          onClick={() => setDarkMode(dm => !dm)}
          className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <textarea
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="w-full h-40 font-mono text-sm p-3 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={runQuery}
        className="mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow"
      >
        ▶️ Run
      </button>

      <div className="mt-8">
        {results.length > 0 ? results.map((res, idx) => (
          <div key={idx} className="overflow-x-auto mb-6">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  {res.columns.map((col, i) => (
                    <th key={i} className="border-b border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-medium">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {res.values.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white dark:bg-gray-800" : "dark:bg-gray-850"}>
                    {row.map((cell, j) => (
                      <td key={j} className="border-b border-gray-200 dark:border-gray-700 px-4 py-2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )) : (
          <p className="text-gray-500 dark:text-gray-400">💡 Gib eine SQL-Abfrage ein und klicke auf „Run“.</p>
        )}
      </div>
    </div>
  );
}
