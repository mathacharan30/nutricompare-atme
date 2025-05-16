import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import translationEN from './locales/en/translation.json';
import translationES from './locales/es/translation.json';
import translationHI from './locales/hi/translation.json';
import translationTA from './locales/ta/translation.json';
import translationBN from './locales/bn/translation.json';

// Resources object with translations
const resources = {
  en: {
    translation: translationEN
  },
  es: {
    translation: translationES
  },
  hi: {
    translation: translationHI
  },
  ta: {
    translation: translationTA
  },
  bn: {
    translation: translationBN
  }
};

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // Detection options
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    }
  });

export default i18n;
