'use client';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useLang } from '@/app/context/LangContext';

const LanguageMenu = () => {
  const { lang, setLang, theme } = useLang();
  const [mounted, setMounted] = useState(false);

  const languageNames = {
    en: 'English',
    zh: '简体中文',
    hant: '繁體中文',
    ja: '日本語',
    fr: 'Français',
    de: 'Deutsch',
    es: 'Español',
    id: 'Indonesia',
    ko: '한국어',
    ru: 'Русский',
    vi: 'Việt Nam',
    pt: 'Português',
    it: 'Italiano',
    ms: 'Malay',
    tr: 'Turkish',
    ar: 'العربية',
  };

  const handleLangChange = (newLang) => {
    setLang(newLang);
  };

  const currentLanguage = languageNames[lang] || 'Unknown';
  const textClass = clsx(theme === 'dark' ? 'text-gray-200' : 'text-gray-800');
  const iconFilterClass = clsx(theme === 'dark' ? 'filter invert' : '');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <button
          className={clsx(
            'bg-transparent',
            'cursor-pointer',
            'flex items-center',
            'transition-colors duration-500',
            'rounded',
            'px-2 py-1',
            'border border-[#5734D3]',
            'text-[#5734D3]',
            'bg-[#efefef]',
            'hover:bg-[#5734D3] hover:text-white',
            textClass,
          )}
        >
          <img
            src="LanguageSwitching.svg"
            alt="Language"
            className={clsx('w-6 h-6 mr-1', iconFilterClass)}
            style={{
              transition: 'filter 0.5s',
            }}
          />
          {currentLanguage}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content sideOffset={5} className="bg-white dark:bg-slate-800 rounded-md p-2 z-10 dropdown-content">
        {Object.keys(languageNames).map((code) => {
          return (
            <DropdownMenu.Item
              key={code}
              onSelect={() => {
                handleLangChange(code);
              }}
              className="p-2 cursor-pointer hover:bg-secondary rounded transition-colors duration-200 dark:text-gray-200"
            >
              {languageNames[code]}
            </DropdownMenu.Item>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default LanguageMenu;
