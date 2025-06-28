import { useState, useEffect } from "react";
import initSqlJs from "sql.js";

export default function App() {
  const [db, setDb] = useState(null);
  const [query, setQuery] = useState("SELECT * FROM users;");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const loadDb = async () => {
      const SQL = await initSqlJs({ locateFile: file => `https://sql.js.org/dist/${file}` });
      const newDb = new SQL.Database();
      newDb.run("CREATE TABLE users (id INTEGER, name TEXT); INSERT INTO users VALUES (1, 'Alice'), (2, 'Bob');");
      setDb(newDb);
    };
    loadDb();
  }, []);

  const runQuery = () => {
    try {
      const res = db.exec(query);
      setResults(res);
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '800px', margin: 'auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>SQL Playground</h1>

      <textarea
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ width: '100%', height: '8rem', fontFamily: 'monospace', padding: '0.5rem', marginTop: '1rem' }}
      />

      <button onClick={runQuery} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>Run</button>

      <div style={{ marginTop: '1rem' }}>
        {results.length > 0 ? results.map((res, idx) => (
          <div key={idx} style={{ marginBottom: '1rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {res.columns.map((col, i) => <th key={i} style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>{col}</th>)}
                </tr>
              </thead>
              <tbody>
                {res.values.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => <td key={j} style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )) : <p style={{ color: '#666' }}>No results yet.</p>}
      </div>
    </div>
  );
}
