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
import { EditorScreen } from '@/app/components/editor';
import { clsx } from 'clsx';
import { useLang } from '@/app/context/LangContext';

export default function Home() {
  const { theme } = useLang();
  return (
    <main
      className={clsx(
        'flex flex-col sm:h-screen',
        'min-h-screen sm:min-h-0',
        theme === 'dark' ? 'bg-customDark' : 'bg-gradient-to-br from-slate-50 to-slate-100',
      )}
    >
      <div className={clsx('flex-grow', 'overflow-auto sm:overflow-hidden')}>
        <EditorScreen />
      </div>
      <div
        className={clsx(
          'bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-4 mt-2',
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
          <img alt="GitHub stars" src="https://img.shields.io/github/stars/casbin/casbin-editor?style=social" />
        </a>
        <span className="text-slate-300 text-sm font-medium">
          Copyright © {new Date().getFullYear()} Casbin contributors.
        </span>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://discord.gg/S5UjpzGZjN"
          className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-200"
        >
          <img src="/discord.svg" alt="Discord" className="w-5 h-5 invert-[0.8]" />
          <span className="text-sm font-medium">Casbin Discord</span>
        </a>
      </div>
    </main>
  );
}
