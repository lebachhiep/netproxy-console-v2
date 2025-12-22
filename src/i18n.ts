// src/i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { SupportedLanguages } from './config/constants';

const storedLang = typeof window !== 'undefined' ? localStorage.getItem('i18nextLng') : null;
i18n
  .use(HttpBackend) // loads translation using http (default public/locales/{{lng}}/{{ns}}.json)
  .use(LanguageDetector) // detect user language
  .use(initReactI18next) // pass i18n instance to react-i18next
  .init({
    lng: storedLang || 'en',
    fallbackLng: 'en',
    supportedLngs: SupportedLanguages.map((l) => l.code), // list of supported languages
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false // React already escapes by default
    },

    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    }
  });
export default i18n;
