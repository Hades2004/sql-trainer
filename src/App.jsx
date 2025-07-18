import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import ExerciseDisplayPage from './pages/ExerciseDisplayPage'; // Import the new page
import ExercisesPage from './pages/ExercisesPage';
import HomePage from './pages/HomePage';
import LectionsPage from './pages/LectionsPage';
import QuizPage from './pages/QuizPage'; // Import the QuizPage

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored === null) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      return stored === 'true';
    }
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark:bg-gray-900');
      document.body.classList.remove('bg-white');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.add('bg-white');
      document.body.classList.remove('dark:bg-gray-900');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  return (
    <div
      className={`font-sans ${darkMode ? 'dark' : ''} min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
    >
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main>
        <Routes>
          <Route
            path='/sql-trainer/'
            element={<HomePage darkMode={darkMode} />}
          />
          <Route path='/sql-trainer/lections' element={<LectionsPage />} />
          <Route path='/sql-trainer/exercises' element={<ExercisesPage />} />
          {/* Route for specific exercises, uses exerciseId parameter */}
          <Route
            path='/sql-trainer/exercise/:exerciseId'
            element={<ExerciseDisplayPage darkMode={darkMode} />}
          />
          <Route path='/sql-trainer/quiz' element={<QuizPage />} />
        </Routes>
      </main>
    </div>
  );
}
