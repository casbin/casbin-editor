'use client';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useLang } from '@/app/context/LangContext';

const LanguageMenu = () => {
  const { lang, setLang } = useLang();
  const [mounted, setMounted] = useState(false);

  const languageNames = {
    en: 'English',
    zh: '简体中文',
    hant: '繁體中文',
    ja: '日本語',
    fr: 'Français',
    de: 'Deutsch',
  };

  const handleLangChange = (newLang) => {
    setLang(newLang);
  };

  const currentLanguage = languageNames[lang] || 'Unknown';

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
            'border border-[#453d7d]',
            'text-[#453d7a]',
            'bg-[#efefef]',
            'hover:bg-[#453d7d] hover:text-white',
          )}
        >
          <img
            src="LanguageSwitching.svg"
            alt="Language"
            className="w-6 h-6 mr-1"
            style={{
              transition: 'filter 0.5s',
            }}
          />
          {currentLanguage}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content sideOffset={5} className="bg-white rounded-md p-2 z-10">
        {Object.keys(languageNames).map((code) => {
          return (
            <DropdownMenu.Item
              key={code}
              onSelect={() => {
                handleLangChange(code);
              }}
              className="p-2 cursor-pointer"
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
