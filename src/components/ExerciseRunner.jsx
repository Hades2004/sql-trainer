import React, { useState, useEffect, useCallback } from 'react';
import initSqlJs from 'sql.js';

// Helper function to compare results - simplified version
const compareResults = (userResult, correctResult) => {
  if (!userResult || !correctResult) return false;
  if (userResult.length === 0 && correctResult.length === 0) return true; // Both empty is considered a match for some cases
  if (userResult.length !== correctResult.length) return false;

  const userRes = userResult[0];
  const correctRes = correctResult[0];

  if (!userRes || !correctRes) return false; // Should have one result object

  // Compare columns
  if (userRes.columns.length !== correctRes.columns.length) return false;
  for (let i = 0; i < userRes.columns.length; i++) {
    if (userRes.columns[i] !== correctRes.columns[i]) return false;
  }

  // Compare values
  if (userRes.values.length !== correctRes.values.length) return false;
  for (let i = 0; i < userRes.values.length; i++) {
    if (userRes.values[i].length !== correctRes.values[i].length) return false;
    for (let j = 0; j < userRes.values[i].length; j++) {
      if (userRes.values[i][j] !== correctRes.values[i][j]) return false;
    }
  }
  return true;
};

export default function ExerciseRunner({ exerciseDetail }) {
  const { taskDescription, schema, sampleDataSetup, correctQuery, initialQuery = "SELECT 'your query here';" } = exerciseDetail;

  const [db, setDb] = useState(null);
  const [userQuery, setUserQuery] = useState(initialQuery);
  const [queryResults, setQueryResults] = useState([]);
  const [feedback, setFeedback] = useState({ isCorrect: null, message: '' });
  const [error, setError] = useState(null);
  const [correctResultsForComparison, setCorrectResultsForComparison] = useState(null);

  const initializeDb = useCallback(async () => {
    try {
      const SQL = await initSqlJs({ locateFile: file => `https://sql.js.org/dist/${file}` });
      const newDb = new SQL.Database();
      newDb.run(schema); // Create tables
      newDb.run(sampleDataSetup); // Populate with sample data
      setDb(newDb);

      // Pre-run the correct query to store its results for comparison
      const correctRes = newDb.exec(correctQuery);
      setCorrectResultsForComparison(correctRes);

    } catch (err) {
      console.error("Failed to load or initialize SQL.js:", err);
      setError("Error initializing database: " + err.message);
    }
  }, [schema, sampleDataSetup, correctQuery]);

  useEffect(() => {
    initializeDb();
  }, [initializeDb]);

  const runUserQuery = () => {
    if (!db) {
      setError("Database not yet loaded. Please wait.");
      setQueryResults([]);
      setFeedback({ isCorrect: null, message: '' });
      return;
    }
    setError(null);
    setFeedback({ isCorrect: null, message: '' });
    try {
      const results = db.exec(userQuery);
      setQueryResults(results);

      if (correctResultsForComparison) {
        const isCorrect = compareResults(results, correctResultsForComparison);
        if (isCorrect) {
          setFeedback({ isCorrect: true, message: 'Correct! Well done.' });
        } else {
          setFeedback({ isCorrect: false, message: 'Incorrect. Check your query against the requirements, column names, and expected data.' });
        }
      } else {
         setFeedback({ isCorrect: false, message: 'Could not verify correctness (missing expected results).' });
      }

    } catch (e) {
      setError("Error executing query: " + e.message);
      setQueryResults([]);
      setFeedback({ isCorrect: false, message: 'Query execution failed. Check your SQL syntax.' });
    }
  };

  return (
    <div className="p-4 font-sans">
      <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Exercise Task</h3>
      <p className="mb-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{taskDescription}</p>

      <h4 className="text-lg font-semibold mt-6 mb-2 text-gray-900 dark:text-gray-100">Schema</h4>
      <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
        {schema}
      </pre>

      <h4 className="text-lg font-semibold mt-6 mb-2 text-gray-900 dark:text-gray-100">Your SQL Query</h4>
      <textarea
        value={userQuery}
        onChange={e => setUserQuery(e.target.value)}
        className="w-full h-32 font-mono text-sm p-3 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
        placeholder="Enter your SQL query here..."
      />

      <button
        onClick={runUserQuery}
        className="mt-3 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow disabled:opacity-50"
        disabled={!db}
      >
        ▶️ Run SQL
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {feedback.message && (
        <div className={`mt-4 p-3 rounded border ${feedback.isCorrect ? 'bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-700 text-green-700 dark:text-green-200' : 'bg-yellow-100 dark:bg-yellow-900 border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-200'}`}>
          <p className="font-bold">{feedback.isCorrect ? '✅ Correct!' : '🤔 Feedback:'}</p>
          <p>{feedback.message}</p>
        </div>
      )}

      <h4 className="text-lg font-semibold mt-6 mb-2 text-gray-900 dark:text-gray-100">Query Results</h4>
      <div className="mt-2">
        {queryResults.length > 0 ? queryResults.map((res, idx) => (
          <div key={idx} className="overflow-x-auto mb-6">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  {res.columns.map((col, i) => (
                    <th key={i} className="border-b border-gray-300 dark:border-gray-600 px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-200">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {res.values.map((row, i) => (
                  <tr key={i} className={`text-sm ${i % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-850"}`}>
                    {row.map((cell, j) => (
                      <td key={j} className="border-b border-gray-200 dark:border-gray-700 px-3 py-2 text-gray-800 dark:text-gray-200">
                        {cell !== null && cell !== undefined ? cell.toString() : "NULL"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )) : (
          <p className="text-gray-500 dark:text-gray-400">No results to display. Run a query or check for errors.</p>
        )}
        {queryResults.length > 0 && queryResults[0].values.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400">Query executed successfully, but returned no rows.</p>
        )}
      </div>
    </div>
  );
}
