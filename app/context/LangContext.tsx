'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const translations = {
  en: require('../../messages/en.json'),
  zh: require('../../messages/zh.json'),
  hant: require('../../messages/zh-Hant.json'),
  ja: require('../../messages/ja.json'),
  fr: require('../../messages/fr.json'),
  de: require('../../messages/de.json'),
  es: require('../../messages/es.json'),
  id: require('../../messages/id.json'),
  ko: require('../../messages/ko.json'),
  ru: require('../../messages/ru.json'),
  vi: require('../../messages/vi.json'),
  pt: require('../../messages/pt.json'),
  it: require('../../messages/it.json'),
  ms: require('../../messages/ms.json'),
  tr: require('../../messages/tr.json'),
  ar: require('../../messages/ar.json'),
};

type LangContextType = {
  lang: string;
  setLang: (lang: string) => void;
  t: (key: string) => string;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

const LangContext = createContext<LangContextType | undefined>(undefined);

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlTheme = urlParams.get('theme');
    const savedLang = localStorage.getItem('lang');

    if (savedLang) {
      setLangState(savedLang);
    } else {
      const browserLang = navigator.language.split('-')[0];
      const supportedLangs = ['en', 'zh', 'hant', 'ja', 'fr', 'de'];
      const defaultLang = supportedLangs.includes(browserLang) ? browserLang : 'en';
      setLangState(defaultLang);
      localStorage.setItem('lang', defaultLang);
    }

    if (urlTheme === 'dark' || urlTheme === 'light') {
      setTheme(urlTheme);
      localStorage.setItem('theme', urlTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
      localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
    }

    setIsLoading(false);
  }, []);

  const setLang = (newLang: string) => {
    setLangState(newLang);
    localStorage.setItem('lang', newLang);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const t = (key: string) => {
    const value = translations[lang][key];
    return value || key;
  };

  if (isLoading) {
    return null;
  }

  return <LangContext.Provider value={{ lang, setLang, t, theme, toggleTheme }}>{children}</LangContext.Provider>;
};

export const useLang = () => {
  const context = useContext(LangContext);
  if (!context) {
    throw new Error('useLang must be used within a LangProvider');
  }
  return context;
};
