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
export default function Home() {
  return (
    <main className={'space-y-2'}>
      <EditorScreen />
      <div className={'bg-gray-500 p-5'}>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/casbin/casbin-editor"
        >
          <img
            alt="GitHub stars"
            src="https://img.shields.io/github/stars/casbin/casbin-editor?style=social"
          />
        </a>
        <span style={{ color: '#FFFFFF', float: 'right', fontSize: 14 }}>
          Copyright © {new Date().getFullYear()} Casbin contributors.
        </span>
      </div>
    </main>
  );
}
