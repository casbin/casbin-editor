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
import { useLang } from '@/app/context/LangContext';
import { modelMetadata, categories } from '@/app/config/modelMetadata';

export default function GalleryPage() {
  const { theme } = useLang();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleModelClick = (modelKey: string) => {
    // Navigate to home page with model selection
    router.push(`/?model=${modelKey}`);
  };

  const filteredModels =
    selectedCategory === 'All'
      ? modelMetadata
      : modelMetadata.filter((model) => {
          return model.category === selectedCategory;
        });

  const textClass = clsx(theme === 'dark' ? 'text-gray-200' : 'text-gray-800');
  const cardBgClass = clsx(theme === 'dark' ? 'bg-slate-800' : 'bg-white');
  const hoverClass = clsx(
    theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-slate-50',
  );

  return (
    <main
      className={clsx(
        'min-h-screen',
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
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <img
              src="https://cdn.casbin.org/img/casbin_logo_1024x256.png"
              alt="Casbin Logo"
              className="h-8 w-auto"
            />
            <h1 className={clsx('text-3xl font-bold', textClass)}>
              Model Gallery
            </h1>
          </div>
          <p className={clsx('text-lg', textClass, 'opacity-80')}>
            Explore and select from our collection of access control models
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-8">
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
                {category}
              </button>
            );
          })}
        </div>

        {/* Model Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.map((model) => {
            return (
              <div
                key={model.key}
                onClick={() => {
                  return handleModelClick(model.key);
                }}
                className={clsx(
                  'rounded-lg border border-border shadow-sm cursor-pointer transition-all duration-200',
                  cardBgClass,
                  hoverClass,
                  'hover:shadow-lg hover:border-primary/50',
                )}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className={clsx('text-xl font-semibold', textClass)}>
                      {model.name}
                    </h3>
                    <span
                      className={clsx(
                        'px-2 py-1 text-xs font-medium rounded',
                        'bg-primary/10 text-primary',
                      )}
                    >
                      {model.category}
                    </span>
                  </div>
                  <p className={clsx('text-sm', textClass, 'opacity-70')}>
                    {model.description}
                  </p>
                </div>
              </div>
            );
          })}
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
          Copyright © {new Date().getFullYear()} Casbin contributors.
        </span>
      </div>
    </main>
  );
}
