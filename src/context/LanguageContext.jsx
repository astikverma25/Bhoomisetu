import React, { createContext, useContext, useState, useEffect } from 'react';
import { contentEn } from '../data/content-en.js';
import { contentHi } from '../data/content-hi.js';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const content = lang === 'hi' ? contentHi : contentEn;

  return (
    <LanguageContext.Provider value={{ lang, setLang, content }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
