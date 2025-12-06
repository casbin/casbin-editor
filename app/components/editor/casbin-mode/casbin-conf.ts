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
  if (stream.sol()) {
    state.afterEqual = false;

    if (stream.match(/[rpem]\s*=/) || stream.match(/g\d*\s*=/)) {
      stream.backUp(1);
      return 'builtin';
    }

    if (state.sec === 'matchers' && (stream.match(/[rpem]\./) || stream.match(/g\d*\./))) {
      return 'builtin';
    }
  }

  if (stream.match(/^\[.*?\]/)) {
    state.sec = stream.current().slice(1, -1);
    return 'header';
  }

  if (stream.match(/#.*/)) {
    return 'comment';
  }

  if (stream.eat('=')) {
    state.afterEqual = true;
    return null;
  }

  if (state.afterEqual || state.sec === 'matchers') {
    if (state.sec === 'request_definition' || state.sec === 'policy_definition' || state.sec === 'role_definition') {
      if (stream.match(/[a-zA-Z][a-zA-Z0-9]*/)) return 'property';
    } else if (state.sec === 'policy_effect') {
      if (stream.match(/some|where/)) return 'keyword';
      if (stream.match(/allow|deny/)) return 'string';
      if (stream.match(/p\./)) return 'builtin';
      if (stream.match(/[a-zA-Z][a-zA-Z0-9]*/)) return 'property';
    } else if (state.sec === 'matchers') {
      if (stream.match(/[a-zA-Z_][a-zA-Z0-9_]*\(/)) {
        return 'def';
      }
      if (stream.match(/[rpem](?=\.)/) || stream.match(/g\d*(?=\.)/)) {
        return 'builtin';
      }
      if (stream.eat('.')) {
        return null;
      }
      if (stream.match(/[a-zA-Z][a-zA-Z0-9]*/)) return 'property';
      if (stream.match(/==|!=|&&|\|\|/)) return 'operator';
      if (stream.match(/"/)) {
        stream.skipTo('"');
        stream.next();
        return 'string';
      }
    }
  }

  stream.next();
  return null;
};

export const CasbinConfLang = StreamLanguage.define({
  name: 'firestore',
  startState: () => {
    return { sec: '', afterEqual: false };
  },
  token: token,
  blankLine: (_state: {}, _indentUnit: number): void => {},
  copyState: (state: {}) => {
    return { ...state };
  },
  indent: (_state: {}, _textAfter: string, _context: IndentContext): number | null => {
    return null;
  },
  languageData: {
    commentTokens: { line: ';' },
  },
  tokenTable: {
    header: t.heading,
    comment: t.lineComment,
    builtin: t.variableName,
    property: t.propertyName,
    keyword: t.keyword,
    string: t.string,
    operator: t.operator,
  },
});

export function CasbinConfSupport() {
  return new LanguageSupport(CasbinConfLang);
}
