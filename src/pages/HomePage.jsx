import { useState, useEffect } from "react";
import initSqlJs from "sql.js";
import tips from "../data/sqlTips.json";

export default function HomePage() {
  const [db, setDb] = useState(null);
  const [query, setQuery] = useState("SELECT * FROM users;");
  const [currentTip, setCurrentTip] = useState("");
  const [lastTipIndex, setLastTipIndex] = useState(-1); // Added to store the last tip index
  const [results, setResults] = useState([]);
  // Dark mode state is kept in App.jsx to be shared across pages

  useEffect(() => {
    const loadDb = async () => {
      try {
        const SQL = await initSqlJs({ locateFile: file => `https://sql.js.org/dist/${file}` });
        const newDb = new SQL.Database();
        newDb.run("CREATE TABLE users (id INTEGER, name TEXT); INSERT INTO users VALUES (1, 'Alice'), (2, 'Bob');");
        setDb(newDb);
      } catch (err) {
        console.error("Failed to load SQL.js:", err);
      }
    };
    loadDb();

    // Select a tip, ensuring it's not the same as the last one if possible
    if (tips.length > 0) {
      let nextTipIndex;
      if (tips.length === 1) {
        nextTipIndex = 0;
      } else {
        if (lastTipIndex === -1) { // First time loading
          nextTipIndex = Math.floor(Math.random() * tips.length);
        } else {
          nextTipIndex = (lastTipIndex + 1) % tips.length;
        }
      }
      setCurrentTip(tips[nextTipIndex]);
      setLastTipIndex(nextTipIndex);
    }
  }, []); // Removed lastTipIndex from dependencies to prevent re-triggering on its change

  const runQuery = () => {
    if (!db) {
      alert("Database not yet loaded. Please wait.");
      return;
    }
    try {
      const res = db.exec(query);
      setResults(res);
    } catch (e) {
      alert("Error: " + e.message);
      setResults([]); // Clear results on error
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans">
      {/* Title is now part of Navbar, so it's removed from here */}
      <textarea
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="w-full h-40 font-mono text-sm p-3 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter your SQL query here..."
      />

      <button
        onClick={runQuery}
        className="mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow disabled:opacity-50"
        disabled={!db}
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
                  <tr key={i} className={`text-sm ${i % 2 === 0 ? "bg-white dark:bg-gray-800" : "dark:bg-gray-850"}`}>
                    {row.map((cell, j) => (
                      <td key={j} className="border-b border-gray-200 dark:border-gray-700 px-4 py-2">
                        {cell !== null && cell !== undefined ? cell.toString() : "NULL"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )) : (
          <p className="text-gray-500 dark:text-gray-400">💡 Enter an SQL query and click "Run" to see results.</p>
        )}
      </div>

      {/* Tip Section */}
      <div className="mt-8 mb-6 p-4 bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">💡 SQL Tip:</h3>
        <p className="text-blue-700 dark:text-blue-300">{currentTip}</p>
      </div>
    </div>
  );
}
