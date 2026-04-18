import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import en from '../i18n/locales/en.json';
import nl from '../i18n/locales/nl.json';
import de from '../i18n/locales/de.json';
import fr from '../i18n/locales/fr.json';
import es from '../i18n/locales/es.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      nl: { translation: nl },
      de: { translation: de },
      fr: { translation: fr },
      es: { translation: es },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'app_language',
      caches: ['localStorage'],
    },
  });

export default i18n;