import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

/**
 * @file Configures and initializes i18next for internationalization.
 *
 * This setup includes:
 * - `i18next-http-backend`: For loading translations from external files.
 * - `i18next-browser-languagedetector`: For detecting user language.
 * - `react-i18next`: For integrating i18next with React components.
 *
 * Key configurations:
 * - `supportedLngs`: Specifies available languages ('en', 'de').
 * - `fallbackLng`: Default language if detection fails or requested language is unavailable.
 * - `debug`: Enables console logging for i18next in development mode.
 * - `ns` and `defaultNS`: Defines translation namespaces.
 * - `detection`: Configures language detection order and caching.
 * - `backend.loadPath`: Specifies the path to translation JSON files.
 * - `react.useSuspense`: Enables React Suspense for loading translations.
 */

// eslint-disable-next-line import/no-named-as-default-member
i18n
  .use(Backend) // Use i18next-http-backend
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'de'],
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development', // Enable debug mode in development
    ns: ['translation'], // Define namespaces
    defaultNS: 'translation',
    detection: {
      order: [
        'querystring',
        'cookie',
        'localStorage',
        'sessionStorage',
        'navigator',
        'htmlTag',
        'path',
        'subdomain',
      ],
      caches: ['cookie', 'localStorage'],
    },
    backend: {
      loadPath: '/sql-trainer/locales/{{lng}}/{{ns}}.json', // Path to your translation files
    },
    react: {
      useSuspense: true, // Set to true, will be handled by <Suspense> in main.jsx
    },
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
  });

export default i18n;
