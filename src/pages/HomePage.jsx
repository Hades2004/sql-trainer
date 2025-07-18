import { sublime } from '@uiw/codemirror-theme-sublime';
import PropTypes from 'prop-types'; // Import PropTypes
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import initSqlJs from 'sql.js';

import SqlEditor from '../components/SqlEditor'; // Import the SqlEditor component
import tips from '../data/sqlTips.json';

export default function HomePage({ darkMode }) {
  const { t } = useTranslation(); // Initialize useTranslation
  const [db, setDb] = useState(null);
  const [query, setQuery] = useState('SELECT * FROM users;');
  const [results, setResults] = useState([]);

  // Function to select an initial tip, ensuring it runs only once.
  const getInitialTipState = () => {
    if (tips.length > 0) {
      // Using Math.random for non-cryptographic purposes (selecting a random tip) is acceptable here.
      // eslint-disable-next-line sonarjs/pseudo-random
      const initialTipIndex = Math.floor(Math.random() * tips.length);
      return {
        // eslint-disable-next-line security/detect-object-injection
        currentTip: tips[initialTipIndex],
        lastTipIndex: initialTipIndex,
      };
    }
    return { currentTip: '', lastTipIndex: -1 };
  };

  // Initialize tip state using the function so it's computed once.
  const [tipState] = useState(getInitialTipState); // Removed _setTipState
  const currentTip = tipState.currentTip;
  // lastTipIndex is implicitly managed by tipState, if needed elsewhere, extract from tipState.
  // For now, setLastTipIndex is not directly called to change tips after initial load.

  // Dark mode state is kept in App.jsx to be shared across pages

  useEffect(() => {
    const loadDb = async () => {
      try {
        const SQL = await initSqlJs({
          locateFile: (file) => `https://sql.js.org/dist/${file}`,
        });
        const newDb = new SQL.Database();
        newDb.run(
          "CREATE TABLE users (id INTEGER, name TEXT); INSERT INTO users VALUES (1, 'Alice'), (2, 'Bob');"
        );
        setDb(newDb);
      } catch {
        // Explicitly ignore error object
        // console.error("Failed to load SQL.js:"); // ESLint: no-console
        // Consider a user-facing error message here
      }
    };
    loadDb();
    // Tip selection is now handled by useState initializer, so it's removed from here.
  }, []); // Empty dependency array: runs only once on mount.

  const handleQueryChange = (value) => {
    setQuery(value);
  };

  const runQuery = () => {
    if (!db) {
      alert(t('databaseNotLoaded'));
      return;
    }
    try {
      const res = db.exec(query);
      setResults(res);
    } catch (e) {
      alert(t('errorExecutingQuery', { message: e.message }));
      setResults([]); // Clear results on error
    }
  };

  return (
    <div className='p-6 max-w-4xl mx-auto font-sans'>
      {/* Title is now part of Navbar, so it's removed from here */}
      <SqlEditor
        value={query}
        onChange={handleQueryChange}
        onExecute={runQuery} // Pass runUserQuery to handle Shift+Enter
        height='160px' // Adjusted height for the new editor
        theme={darkMode ? sublime : 'light'} // Pass the theme based on darkMode
        aria-label={t('sqlQueryEditorLabel')}
      />

      <button
        onClick={runQuery}
        className='mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow disabled:opacity-50'
        disabled={!db}
      >
        {t('runQuery')}
      </button>

      <div className='mt-8'>
        {results.length > 0 ? (
          results.map((res, idx) => (
            <div key={idx} className='overflow-x-auto mb-6'>
              <table className='w-full border-collapse'>
                <thead className='bg-gray-100 dark:bg-gray-700'>
                  <tr>
                    {res.columns.map((col, i) => (
                      <th
                        key={i}
                        className='border-b border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-medium'
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {res.values.map((row, i) => (
                    <tr
                      key={i}
                      className={`text-sm ${i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'dark:bg-gray-850'}`}
                    >
                      {row.map((cell, j) => (
                        <td
                          key={j}
                          className='border-b border-gray-200 dark:border-gray-700 px-4 py-2'
                        >
                          {cell !== null && cell !== undefined
                            ? cell.toString()
                            : 'NULL'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <p className='text-gray-500 dark:text-gray-400'>
            {t('enterQueryPrompt')}
          </p>
        )}
      </div>

      {/* Tip Section */}
      <div className='mt-8 mb-6 p-4 bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 rounded-lg'>
        <h3 className='text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2'>
          {t('sqlTip')}
        </h3>
        <p className='text-blue-700 dark:text-blue-300'>{currentTip}</p>
      </div>
    </div>
  );
}

HomePage.propTypes = {
  darkMode: PropTypes.bool.isRequired,
};
