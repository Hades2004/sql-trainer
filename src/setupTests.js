// src/setupTests.js
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock react-i18next
vi.mock('react-i18next', async (importOriginal) => {
  const original = await importOriginal();
  // Simple dictionary for mock translations - add keys as needed by tests
  const mockTranslations = {
    'sqlTrainer': '🧪 SQL Trainer',
    'lightMode': '☀️ Light',
    'darkMode': '🌙 Dark',
    'openUserMenu': 'Open user menu',
    'home': 'Home',
    'lections': 'Lections',
    'exercises': 'Exercises',
    'quiz': 'Quiz',
    'runSQL': '▶️ Run SQL',
    'errorLabel': 'Error:',
    'errorExecutingQuery': 'Error: {{message}}',
    'errorInitializingDB': 'Error initializing DB: {{message}}', // Added for ExerciseRunner
    'dbNotLoaded': 'Database not yet loaded. Please wait.',
    'feedbackCorrectTitle': '✅ Correct!',
    'feedbackIncorrectTitle': '🤔 Feedback:',
    'feedbackCorrectMessage': 'Correct! Well done.',
    'feedbackIncorrectMessage': 'Incorrect. Check your query against the requirements, column names, and expected data.',
    'feedbackVerificationError': 'Could not verify correctness (missing expected results).',
    'feedbackQueryFailed': 'Query execution failed. Check your SQL syntax.',
    'queryResults': 'Query Results',
    'noResultsToDisplay': 'No results to display. Run a query or check for errors.',
    'queryReturnedNoRows': 'Query executed successfully, but returned no rows.',
    'exerciseTask': 'Task', // Added for ExerciseRunner
    'schema': 'Schema', // Added for ExerciseRunner
    'yourSQLQuery': 'Your SQL Query', // Added for ExerciseRunner
    'questionOutOf': 'Question {{current}} of {{total}}',
    'scoreLabel': 'Score: {{score}}',
    'correctExclamation': '🎉 Correct!',
    'incorrectFeedback': '🤔 Incorrect. The correct answer is: {{correctAnswer}}',
    'nextQuestion': 'Next Question',
    'showResults': 'Show Results',
    'quizCompleted': 'Quiz Completed!',
    'quizScore': 'You scored {{score}} out of {{totalQuestions}}.',
    'restartQuiz': 'Restart Quiz',
    'noQuizQuestions': 'No quiz questions available.',
    'loadingQuiz': 'Loading quiz...',
    // Add other keys used directly or via interpolation in tests here
  };

  const stableMockT = (key, options) => {
    let translation = mockTranslations[key] || key;
    if (options && mockTranslations[key]) {
      Object.keys(options).forEach((optKey) => {
        const regex = new RegExp(`{{${optKey}}}`, 'g');
        translation = translation.replace(regex, options[optKey]);
      });
    }
    return translation;
  };

  const stableMockI18n = {
    changeLanguage: () => new Promise(() => {}),
    resolvedLanguage: 'en',
    language: 'en',
    isInitialized: true,
  };

  return {
    ...original,
    useTranslation: () => ({
      t: stableMockT,
      i18n: stableMockI18n,
    }),
    // Trans: ({ i18nKey }) => i18nKey, // Mock Trans if used
  };
});
