'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const translations = {
  en: require('../../messages/en.json'),
  zh: require('../../messages/zh.json'),
  zhHant: require('../../messages/zh-Hant.json'),
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

const langMapping = {
  'zh-Hant': 'zhHant',
};

const getTranslationKey = (lang) => {
  return langMapping[lang] || lang;
};

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    localStorage.clear();
    const savedLang = localStorage.getItem('lang');

    if (savedLang) {
      setLangState(savedLang);
    } else {
      const browserLang = navigator.language.split('-')[0];
      const supportedLangs = ['en', 'zh', 'zh-Hant', 'ja', 'fr', 'de'];
      const defaultLang = supportedLangs.includes(browserLang) ? browserLang : 'en';
      setLangState(defaultLang);
      localStorage.setItem('lang', defaultLang);
    }
    setIsLoading(false);
  }, []);

  const setLang = (newLang: string) => {
    setLangState(newLang);
    localStorage.setItem('lang', newLang);
  };

  const t = (key: string) => {
    const langKey = getTranslationKey(lang);
    const value = translations[langKey][key];
    return value || key;
  };

  if (isLoading) {
    return null;
  }

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
};

export const useLang = () => {
  const context = useContext(LangContext);
  if (!context) {
    throw new Error('useLang must be used within a LangProvider');
  }
  return context;
};
