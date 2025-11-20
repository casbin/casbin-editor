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

import Giscus from '@giscus/react';
import { useLang } from '@/app/context/LangContext';

/**
 * Giscus Comments Component
 * 
 * Integrates GitHub Discussions-powered comments via giscus.
 * 
 * Setup Required:
 * 1. Enable GitHub Discussions on the repository
 * 2. Install the giscus app: https://github.com/apps/giscus
 * 3. Configure at https://giscus.app/ to get correct repoId and categoryId
 * 
 * See GISCUS_SETUP.md for detailed setup instructions.
 */
export function GiscusComments() {
  const { theme } = useLang();

  return (
    <Giscus
      id="comments"
      repo="casbin/casbin-editor"
      repoId="R_kgDODbjKlA"
      category="General"
      categoryId="DIC_kwDODbjKlM4Clhuw"
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={theme === 'dark' ? 'dark' : 'light'}
      lang="en"
      loading="lazy"
    />
  );
}
