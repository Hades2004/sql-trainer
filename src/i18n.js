import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

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
      order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
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
