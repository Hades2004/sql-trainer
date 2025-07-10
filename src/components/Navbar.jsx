import PropTypes from 'prop-types'; // Import PropTypes
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { Link } from 'react-router-dom';

export default function Navbar({ darkMode, setDarkMode }) {
  const { t, i18n } = useTranslation();
  const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const menuDropdownRef = useRef(null);
  const langDropdownRef = useRef(null);
  const langToggleButtonRef = useRef(null); // Ref for the language toggle button
  const menuToggleButtonRef = useRef(null); // Ref for the user menu toggle button

  const toggleMenuDropdown = () => setMenuDropdownOpen(!menuDropdownOpen);
  const toggleLangDropdown = () => setLangDropdownOpen(!langDropdownOpen);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLangDropdownOpen(false); // Close dropdown after selection
    langToggleButtonRef.current?.focus(); // Return focus to the button
  };

  const handleLangMenuKeyDown = (event) => {
    if (event.key === 'Escape') {
      setLangDropdownOpen(false);
      langToggleButtonRef.current?.focus(); // Return focus to the button
    }
    // Basic arrow key support (can be expanded)
    // This is simplified; full robust arrow key nav is complex
    // Often relies on browser's native role="menuitem" handling or a library
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const items = Array.from(
        langDropdownRef.current.querySelectorAll('[role="menuitem"]')
      );
      const activeElement = document.activeElement;
      let currentIndex = items.findIndex((item) => item === activeElement);

      if (event.key === 'ArrowDown') {
        currentIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      } else {
        // ArrowUp
        currentIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      }
      // eslint-disable-next-line security/detect-object-injection
      items[currentIndex]?.focus();
    }
  };

  const handleUserMenuKeyDown = (event) => {
    if (event.key === 'Escape') {
      setMenuDropdownOpen(false);
      menuToggleButtonRef.current?.focus(); // Return focus to the button
    }
    // Basic arrow key support for Links (more complex for full menu behavior)
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const items = Array.from(
        menuDropdownRef.current.querySelectorAll('[role="menuitem"]')
      );
      const activeElement = document.activeElement;
      let currentIndex = items.findIndex((item) => item === activeElement);

      if (event.key === 'ArrowDown') {
        currentIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      } else {
        // ArrowUp
        currentIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      }
      // eslint-disable-next-line security/detect-object-injection
      items[currentIndex]?.focus();
    }
  };

  // Effect for closing menu dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuDropdownRef.current &&
        !menuDropdownRef.current.contains(event.target)
      ) {
        setMenuDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuDropdownRef]);

  // Effect for closing language dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target)
      ) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [langDropdownRef]);

  const languages = {
    en: { nativeName: 'English', flag: '🇬🇧' }, // Removed flag from nativeName for clarity
    de: { nativeName: 'Deutsch', flag: '🇩🇪' }, // Removed flag from nativeName for clarity
  };

  const currentLanguage = languages[i18n.resolvedLanguage] || languages.en;

  return (
    <nav className='bg-gray-100 dark:bg-gray-800 p-4 shadow-md'>
      <div className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-8'>
        <div className='relative flex items-center justify-between h-16'>
          <div className='flex-1 flex items-center justify-start'>
            <Link
              to='/sql-trainer/'
              className='text-2xl font-bold text-gray-900 dark:text-white'
            >
              {t('sqlTrainer')}
            </Link>
          </div>

          <div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
            {/* Language Switcher Dropdown */}
            <div className='relative mr-3' ref={langDropdownRef}>
              <div>
                <button
                  type='button'
                  id='language-menu-button' // Added id
                  ref={langToggleButtonRef} // Added ref
                  onClick={toggleLangDropdown}
                  className='px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white flex items-center'
                  aria-expanded={langDropdownOpen}
                  aria-haspopup='true'
                >
                  <span
                    className='mr-1'
                    role='img'
                    aria-label={`${currentLanguage.nativeName} flag`}
                  >
                    {currentLanguage.flag}
                  </span>
                  {currentLanguage.nativeName}
                  <svg
                    className='ml-1 h-5 w-5 text-gray-800 dark:text-gray-100'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                    aria-hidden='true'
                  >
                    <path
                      fillRule='evenodd'
                      d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                      clipRule='evenodd'
                    />
                  </svg>
                </button>
              </div>
              {langDropdownOpen && (
                <div
                  className='origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-20' // Increased z-index
                  role='menu'
                  aria-orientation='vertical'
                  aria-labelledby='language-menu-button' // Added aria-labelledby
                  onKeyDown={handleLangMenuKeyDown} // Added keydown handler
                  tabIndex='-1' // Added tabIndex
                >
                  {Object.keys(languages).map((lng) => (
                    <button
                      key={lng}
                      onClick={() => changeLanguage(lng)}
                      className='w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center'
                      role='menuitem'
                    >
                      <span
                        className='mr-2'
                        role='img'
                         // eslint-disable-next-line security/detect-object-injection
                        aria-label={`${languages[lng].nativeName} flag`}
                      >
                         {/* eslint-disable-next-line security/detect-object-injection */}
                        {languages[lng].flag}
                      </span>
                       {/* eslint-disable-next-line security/detect-object-injection */}
                      {languages[lng].nativeName}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark Mode Toggle Button */}
            <button
              onClick={() => setDarkMode((dm) => !dm)}
              className='mr-3 px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'
            >
              {darkMode ? t('lightMode') : t('darkMode')}
            </button>

            {/* Hamburger Menu Dropdown */}
            <div className='relative ml-3' ref={menuDropdownRef}>
              <div>
                <button
                  type='button'
                  ref={menuToggleButtonRef} // Added ref
                  className='bg-gray-200 dark:bg-gray-700 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'
                  id='user-menu-button'
                  aria-expanded={menuDropdownOpen}
                  aria-haspopup='true'
                  onClick={toggleMenuDropdown}
                >
                  <span className='sr-only'>{t('openUserMenu')}</span>
                  {/* Hamburger icon */}
                  <svg
                    className='h-8 w-8 text-gray-900 dark:text-white'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    aria-hidden='true' // Added aria-hidden
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M4 6h16M4 12h16m-7 6h7'
                    />
                  </svg>
                </button>
              </div>

              {menuDropdownOpen && (
                <div
                  className='origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-10' // z-10 should be fine here, lang dropdown is z-20
                  role='menu'
                  aria-orientation='vertical'
                  aria-labelledby='user-menu-button'
                  tabIndex='-1'
                  onKeyDown={handleUserMenuKeyDown} // Added keydown handler
                >
                  <Link
                    to='/sql-trainer/'
                    className='block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                    role='menuitem'
                    tabIndex='-1'
                    id='user-menu-item-0'
                    onClick={() => setMenuDropdownOpen(false)}
                  >
                    {t('home')}
                  </Link>
                  <Link
                    to='/sql-trainer/lections'
                    className='block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                    role='menuitem'
                    tabIndex='-1'
                    id='user-menu-item-1'
                    onClick={() => setMenuDropdownOpen(false)}
                  >
                    {t('lections')}
                  </Link>
                  <Link
                    to='/sql-trainer/exercises'
                    className='block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                    role='menuitem'
                    tabIndex='-1'
                    id='user-menu-item-2'
                    onClick={() => setMenuDropdownOpen(false)}
                  >
                    {t('exercises')}
                  </Link>
                  <Link
                    to='/sql-trainer/quiz'
                    className='block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                    role='menuitem'
                    tabIndex='-1'
                    id='user-menu-item-3' // Assuming this is the next available ID
                    onClick={() => setMenuDropdownOpen(false)}
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

Navbar.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  setDarkMode: PropTypes.func.isRequired,
};
