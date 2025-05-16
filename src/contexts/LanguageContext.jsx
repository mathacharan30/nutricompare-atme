import React, { createContext, useState, useContext, useEffect } from 'react';
import i18n from '../i18n';

// Create the language context
const LanguageContext = createContext();

// Available languages
export const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', flag: '🇮🇳' }
];

// Language provider component
export const LanguageProvider = ({ children }) => {
  // Get the current language or default to English
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');

  // Change language function
  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setCurrentLanguage(code);
  };

  // Update state when i18n language changes
  useEffect(() => {
    const handleLanguageChanged = () => {
      setCurrentLanguage(i18n.language);
    };

    // Listen for language change
    i18n.on('languageChanged', handleLanguageChanged);

    // Cleanup
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  // Context value
  const value = {
    currentLanguage,
    changeLanguage,
    languages
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
