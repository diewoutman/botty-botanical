import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Language } from '../types';
import { SUPPORTED_LANGUAGES } from '../types';
import { useTranslation } from 'react-i18next';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('app_language');
    if (savedLang && SUPPORTED_LANGUAGES.includes(savedLang as Language)) {
      setLanguageState(savedLang as Language);
      i18n.changeLanguage(savedLang);
    } else {
      const browserLang = navigator.language.split('-')[0];
      const detected = SUPPORTED_LANGUAGES.includes(browserLang as Language)
        ? (browserLang as Language)
        : 'en';
      setLanguageState(detected);
      i18n.changeLanguage(detected);
    }
  }, [i18n]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
    i18n.changeLanguage(lang);
  }, [i18n]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};