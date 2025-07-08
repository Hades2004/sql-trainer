import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation

export default function Navbar({ darkMode, setDarkMode }) {
  const { t, i18n } = useTranslation(); // Initialize useTranslation
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <nav className="bg-gray-100 dark:bg-gray-800 p-4 shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-start">
            <Link to="/sql-trainer/" className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('sqlTrainer')}
            </Link>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button onClick={() => changeLanguage('en')} className="mr-3 px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              EN
            </button>
            <button onClick={() => changeLanguage('de')} className="mr-3 px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              DE
            </button>
            <button
              onClick={() => setDarkMode(dm => !dm)}
              className="mr-3 px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              {darkMode ? t('lightMode') : t('darkMode')}
            </button>

            <div className="relative ml-3" ref={dropdownRef}>
              <div>
                <button
                  type="button"
                  className="bg-gray-200 dark:bg-gray-700 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  id="user-menu-button"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                  onClick={toggleDropdown}
                >
                  <span className="sr-only">{t('openUserMenu')}</span>
                  {/* Hamburger icon */}
                  <svg className="h-8 w-8 text-gray-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </button>
              </div>

              {dropdownOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex="-1"
                >
                  <Link
                    to="/sql-trainer/"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    role="menuitem"
                    tabIndex="-1"
                    id="user-menu-item-0"
                    onClick={() => setDropdownOpen(false)}
                  >
                    {t('home')}
                  </Link>
                  <Link
                    to="/sql-trainer/lections"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    role="menuitem"
                    tabIndex="-1"
                    id="user-menu-item-1"
                    onClick={() => setDropdownOpen(false)}
                  >
                    {t('lections')}
                  </Link>
                  <Link
                    to="/sql-trainer/exercises"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    role="menuitem"
                    tabIndex="-1"
                    id="user-menu-item-2"
                    onClick={() => setDropdownOpen(false)}
                  >
                    {t('exercises')}
                  </Link>
                  <Link
                    to="/sql-trainer/quiz"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    role="menuitem"
                    tabIndex="-1"
                    id="user-menu-item-3" // Assuming this is the next available ID
                    onClick={() => setDropdownOpen(false)}
                  >
                    {t('quiz')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
