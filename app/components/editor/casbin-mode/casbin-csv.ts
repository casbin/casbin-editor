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

import { IndentContext, LanguageSupport, StreamLanguage, StringStream } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

export const token = (stream: StringStream, state) => {
  const ch = stream.peek();

  if (ch === '#') {
    stream.skipToEnd();
    return 'comment';
  } else if (ch === ',') {
    stream.eat(',');
    return '';
  }

  if (stream.sol() && stream.match(/^p(?=\s*,)/)) {
    return 'def';
  }
  if (stream.sol() && (stream.match(/^g2(?=\s*,)/) || stream.match(/^g(?=\s*,)/))) {
    return 'keyword';
  }

  if (stream.skipTo(',')) {
    return 'string';
  }

  stream.skipToEnd();
  return 'property';

  // stream.next();
};

export const CasbinPolicyLang = StreamLanguage.define({
  name: 'firestore',
  startState: (indentUnit: number) => {
    return {};
  },
  token: token,
  blankLine: (state: {}, indentUnit: number): void => {},
  copyState: (state: {}) => {},
  indent: (state: {}, textAfter: string, context: IndentContext): number | null => {
    return 0;
  },
  languageData: {
    commentTokens: { line: ';' },
  },
  tokenTable: {
    p: t.keyword,
    read: t.keyword,
    write: t.keyword,
  },
});

export function CasbinPolicySupport() {
  return new LanguageSupport(CasbinPolicyLang);
}
