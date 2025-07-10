import { sublime } from '@uiw/codemirror-theme-sublime';
import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import initSqlJs from 'sql.js';

import SqlEditor from './SqlEditor';

// --- compareResults Refactoring ---
const compareArrayContent = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    // eslint-disable-next-line security/detect-object-injection
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
};

const compareTableValues = (val1, val2) => {
  if (val1.length !== val2.length) return false;
  for (let i = 0; i < val1.length; i++) {
    // eslint-disable-next-line security/detect-object-injection
    if (!compareArrayContent(val1[i], val2[i])) return false;
  }
  return true;
};

const compareResults = (userResult, correctResult) => {
  if (!userResult || !correctResult) return false;
  if (userResult.length === 0 && correctResult.length === 0) return true;
  if (userResult.length !== correctResult.length) return false;

  const userRes = userResult[0];
  const correctRes = correctResult[0];

  if (!userRes || !correctRes) return false;

  if (!compareArrayContent(userRes.columns, correctRes.columns)) return false;
  if (!compareTableValues(userRes.values, correctRes.values)) return false;

  return true;
};
// --- End compareResults Refactoring ---

// sonarjs/prefer-single-boolean-return is now disabled globally in eslint.config.js
const determineFeedbackLogic = (
  userResults,
  correctComparisonResults,
  tFunction
) => {
  const hasComparisonResults = !!correctComparisonResults;

  const isEvalCorrect = hasComparisonResults
    ? compareResults(userResults, correctComparisonResults)
    : false;

  const finalIsCorrect = hasComparisonResults && isEvalCorrect;

  // Flattened logic for messageKey to avoid sonarjs/no-nested-conditional
  let messageKey;
  if (hasComparisonResults) {
    if (isEvalCorrect) {
      messageKey = 'feedbackCorrectMessage';
    } else {
      messageKey = 'feedbackIncorrectMessage';
    }
  } else {
    messageKey = 'feedbackVerificationError';
  }

  return {
    isCorrect: finalIsCorrect,
    message: tFunction(messageKey),
  };
};

const QueryResultTable = ({ results }) => {
  return results.map((res, idx) => (
    <div key={idx} className='overflow-x-auto mb-6'>
      <table className='w-full border-collapse text-sm'>
        <thead className='bg-gray-100 dark:bg-gray-700'>
          <tr>
            {res.columns.map((col, i) => (
              <th
                key={i}
                className='border-b border-gray-300 dark:border-gray-600 px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-200'
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
                  className='border-b border-gray-200 dark:border-gray-700 px-3 py-2 text-gray-800 dark:text-gray-200'
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
  ));
};

QueryResultTable.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      columns: PropTypes.arrayOf(PropTypes.string).isRequired,
      values: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.any)).isRequired,
    })
  ).isRequired,
};

export default function ExerciseRunner({ exerciseDetail, darkMode }) {
  const { t } = useTranslation();
  const {
    taskDescription,
    schema,
    sampleDataSetup,
    correctQuery,
    initialQuery = "SELECT 'your query here';",
  } = exerciseDetail;

  const [db, setDb] = useState(null);
  const [userQuery, setUserQuery] = useState(initialQuery);
  const [queryResults, setQueryResults] = useState([]);
  const [feedback, setFeedback] = useState({ isCorrect: null, message: '' });
  const [error, setError] = useState(null);
  const [correctResultsForComparison, setCorrectResultsForComparison] =
    useState(null);

  const initializeDb = useCallback(async () => {
    try {
      const SQL = await initSqlJs({
        locateFile: (file) => `https://sql.js.org/dist/${file}`,
      });
      const newDb = new SQL.Database();
      newDb.run(schema);
      newDb.run(sampleDataSetup);
      setDb(newDb);

      const correctRes = newDb.exec(correctQuery);
      setCorrectResultsForComparison(correctRes);
    } catch (err) {
      // Removed commented out console.error
      setError(t('errorInitializingDB', { message: err.message }));
    }
  }, [schema, sampleDataSetup, correctQuery, t]);

  useEffect(() => {
    initializeDb();
  }, [initializeDb]);

  const runUserQuery = () => {
    if (!db) {
      setError(t('dbNotLoaded'));
      setQueryResults([]);
      setFeedback({ isCorrect: null, message: '' });
      return;
    }
    setError(null);
    setFeedback({ isCorrect: null, message: '' });
    try {
      const results = db.exec(userQuery);
      setQueryResults(results);
      setFeedback(
        determineFeedbackLogic(results, correctResultsForComparison, t)
      );
    } catch (e) {
      setError(t('errorExecutingQuery', { message: e.message }));
      setQueryResults([]);
      setFeedback({ isCorrect: false, message: t('feedbackQueryFailed') });
    }
  };

  return (
    <div className='p-4 font-sans'>
      <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100'>
        {t('exerciseTask')}
      </h3>
      <p className='mb-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap'>
        {taskDescription}
      </p>

      <h4 className='text-lg font-semibold mt-6 mb-2 text-gray-900 dark:text-gray-100'>
        {t('schema')}
      </h4>
      <pre className='bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap'>
        {schema}
      </pre>

      <h4
        id='yourSQLQueryLabel'
        className='text-lg font-semibold mt-6 mb-2 text-gray-900 dark:text-gray-100'
      >
        {t('yourSQLQuery')}
      </h4>
      <SqlEditor
        value={userQuery}
        onChange={setUserQuery}
        onExecute={runUserQuery}
        height='128px'
        theme={darkMode ? sublime : 'light'}
        aria-labelledby='yourSQLQueryLabel'
      />

      <button
        onClick={runUserQuery}
        className='mt-3 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow disabled:opacity-50'
        disabled={!db}
      >
        {t('runSQL')}
      </button>

      {error && (
        <div className='mt-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded'>
          <p className='font-bold'>{t('errorLabel')}</p>
          <p>{error}</p>
        </div>
      )}

      {feedback.message && (
        <div
          className={`mt-4 p-3 rounded border ${feedback.isCorrect ? 'bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-700 text-green-700 dark:text-green-200' : 'bg-yellow-100 dark:bg-yellow-900 border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-200'}`}
        >
          <p className='font-bold'>
            {feedback.isCorrect
              ? t('feedbackCorrectTitle')
              : t('feedbackIncorrectTitle')}
          </p>
          <p>{feedback.message}</p>
        </div>
      )}

      <h4 className='text-lg font-semibold mt-6 mb-2 text-gray-900 dark:text-gray-100'>
        {t('queryResults')}
      </h4>
      <div className='mt-2'>
        {queryResults.length > 0 ? (
          <QueryResultTable results={queryResults} />
        ) : (
          <p className='text-gray-500 dark:text-gray-400'>
            {t('noResultsToDisplay')}
          </p>
        )}
        {queryResults.length > 0 &&
          queryResults[0] &&
          queryResults[0].values.length === 0 && (
            <p className='text-gray-500 dark:text-gray-400'>
              {t('queryReturnedNoRows')}
            </p>
          )}
      </div>
    </div>
  );
}

ExerciseRunner.propTypes = {
  exerciseDetail: PropTypes.shape({
    taskDescription: PropTypes.string.isRequired,
    schema: PropTypes.string.isRequired,
    sampleDataSetup: PropTypes.string.isRequired,
    correctQuery: PropTypes.string.isRequired,
    initialQuery: PropTypes.string,
  }).isRequired,
  darkMode: PropTypes.bool.isRequired,
};
