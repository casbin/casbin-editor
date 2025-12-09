// Copyright 2024 The casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import { ArrowLeft, ExternalLink, Search } from 'lucide-react';
import { useLang } from '@/app/context/LangContext';
import { modelMetadata, categories } from '@/app/config/modelMetadata';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/components/ui/tooltip';

export default function GalleryPage() {
  const { theme, t } = useLang();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleModelClick = (modelKey: string) => {
    // Navigate to home page with model selection
    router.push(`/?model=${modelKey}`);
  };

  const filteredModels = modelMetadata.filter((model) => {
    // Filter by category
    const categoryMatch =
      selectedCategory === 'All' || model.category === selectedCategory;

    // Filter by search query
    const searchLower = searchQuery.toLowerCase().trim();
    const searchMatch =
      !searchLower ||
      t(model.name).toLowerCase().includes(searchLower) ||
      t(model.description).toLowerCase().includes(searchLower) ||
      t(model.category).toLowerCase().includes(searchLower);

    return categoryMatch && searchMatch;
  });

  const textClass = clsx(theme === 'dark' ? 'text-gray-200' : 'text-gray-800');
  const cardBgClass = clsx(theme === 'dark' ? 'bg-slate-800' : 'bg-white');
  const hoverClass = clsx(
    theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-slate-50',
  );

  return (
    <main
      className={clsx(
        'min-h-screen flex flex-col',
        theme === 'dark' ? 'bg-customDark' : 'bg-gradient-to-br from-slate-50 to-slate-100',
      )}
    >
      {/* Header */}
      <div
        className={clsx(
          'border-b border-border shadow-sm',
          theme === 'dark' ? 'bg-slate-900' : 'bg-white',
        )}
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => {
                return router.push('/');
              }}
              className="text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <img
              src="https://cdn.casbin.org/img/casbin_logo_1024x256.png"
              alt="Casbin Logo"
              className="h-8 w-auto"
            />
            <h1 className={clsx('text-3xl font-bold', textClass)}>
              {t('Model Gallery')}
            </h1>
          </div>
          <p className={clsx('text-lg', textClass, 'opacity-80')}>
            {t('Gallery description')}
          </p>
        </div>
      </div>

      {/* Category Filter and Model Grid */}
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Search and Category Filter Section */}
          <div className="flex flex-col gap-4 mb-8">
            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search
                className={clsx(
                  'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
                )}
              />
              <input
                type="text"
                placeholder={t('Search placeholder')}
                value={searchQuery}
                onChange={(e) => {
                  return setSearchQuery(e.target.value);
                }}
                className={clsx(
                  'w-full pl-10 pr-4 py-2 rounded-lg border transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-primary/50',
                  theme === 'dark'
                    ? 'bg-slate-800 border-border text-gray-200 placeholder-gray-500'
                    : 'bg-white border-border text-gray-800 placeholder-gray-400',
                )}
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                return (
                  <button
                    key={category}
                    onClick={() => {
                      return setSelectedCategory(category);
                    }}
                    className={clsx(
                      'px-4 py-2 rounded-lg font-medium transition-all duration-200',
                      selectedCategory === category
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : clsx(
                            cardBgClass,
                            textClass,
                            'border border-border',
                            hoverClass,
                          ),
                    )}
                  >
                    {t(category)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Model Grid */}
          <TooltipProvider delayDuration={700} skipDelayDuration={0}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModels.map((model) => {
                return (
                  <div
                    key={model.key}
                    className={clsx(
                      'rounded-lg border border-border shadow-sm transition-all duration-200',
                      cardBgClass,
                      'hover:shadow-lg',
                    )}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className={clsx('text-xl font-semibold', textClass)}>
                          {t(model.name)}
                        </h3>
                        <span
                          className={clsx(
                            'px-2 py-1 text-xs font-medium rounded',
                            'bg-primary/10 text-primary',
                          )}
                        >
                          {t(model.category)}
                        </span>
                      </div>
                      <p className={clsx('text-sm mb-4', textClass, 'opacity-70')}>
                        {t(model.description)}
                      </p>
                      <div className="flex justify-end">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => {
                                handleModelClick(model.key);
                              }}
                              className={clsx(
                                'inline-flex items-center gap-2 p-2 rounded-lg',
                                'text-sm font-medium transition-all duration-200',
                                'bg-primary text-primary-foreground',
                                'hover:bg-primary/90 hover:shadow-md',
                                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                              )}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent
                            className={clsx(
                              'bg-white dark:bg-gray-800 text-primary border border-primary',
                            )}
                          >
                            <p>{t('Load in Editor')}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TooltipProvider>
        </div>
      </div>

      {/* Footer */}
      <div
        className={clsx(
          'bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-4 mt-8',
          'flex flex-col sm:flex-row items-center justify-center gap-4',
          'border-t border-slate-700 shadow-lg',
        )}
      >
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/casbin/casbin-editor"
          className="transition-transform hover:scale-105 rounded-lg overflow-hidden shadow-md hover:shadow-xl"
        >
          <img
            alt="GitHub stars"
            src="https://img.shields.io/github/stars/casbin/casbin-editor?style=social"
          />
        </a>
        <span className="text-slate-300 text-sm font-medium">
          {t('Copyright').replace('{year}', new Date().getFullYear().toString())}
        </span>
      </div>
    </main>
  );
}
