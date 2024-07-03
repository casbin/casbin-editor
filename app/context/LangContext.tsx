'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

const translations = {
  en: require('../../messages/en.json'),
  zh: require('../../messages/zh.json'),
  hant: require('../../messages/zh-Hant.json'),
  ja: require('../../messages/ja.json'),
  fr: require('../../messages/fr.json'),
  de: require('../../messages/de.json'),
};

type LangContextType = {
  lang: string;
  setLang: (lang: string) => void;
  t: (key: string) => string;
};

const LangContext = createContext<LangContextType | undefined>(undefined);

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState('en');

  const t = (key: string) => {
    const value = translations[lang][key];
    return value || key;
  };

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
};

export const useLang = () => {
  const context = useContext(LangContext);
  if (!context) {
    throw new Error('useLang must be used within a LangProvider');
  }
  return context;
};
