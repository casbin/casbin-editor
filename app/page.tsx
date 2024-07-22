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
    <main className={clsx('flex flex-col sm:h-screen', 'min-h-screen sm:min-h-0', theme === 'dark' ? 'bg-customDark' : 'bg-white')}>
      <div className={clsx('flex-grow', 'overflow-auto sm:overflow-hidden')}>
        <EditorScreen />
      </div>
      <div className={clsx('bg-[#222222] px-2 py-3 mt-2', 'flex flex-col sm:flex-row items-center')}>
        <a target="_blank" rel="noopener noreferrer" href="https://github.com/casbin/casbin-editor" className="mb-2 sm:mb-0">
          <img alt="GitHub stars" src="https://img.shields.io/github/stars/casbin/casbin-editor?style=social" />
        </a>
        <div className={'grow hidden sm:block'}></div>
        <span className="text-white text-xs sm:text-sm">Copyright © {new Date().getFullYear()} Casbin contributors.</span>
      </div>
    </main>
  );
}
