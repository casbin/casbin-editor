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

const token = (stream: StringStream, state) => {
  const ch = stream.peek();
  if (ch === '[') {
    if (stream.match('[request_definition')) {
      state.sec = 'r';
      stream.skipTo(']');
      stream.eat(']');
      return 'header';
    } else if (stream.match('[policy_definition')) {
      state.sec = 'p';
      stream.skipTo(']');
      stream.eat(']');
      return 'header';
    } else if (stream.match('[role_definition')) {
      state.sec = 'g';
      stream.skipTo(']');
      stream.eat(']');
      return 'header';
    } else if (stream.match('[policy_effect')) {
      state.sec = 'e';
      stream.skipTo(']');
      stream.eat(']');
      return 'header';
    } else if (stream.match('[matchers')) {
      state.sec = 'm';
      stream.skipTo(']');
      stream.eat(']');
      return 'header';
    } else {
      state.sec = '';
      stream.skipToEnd();
      return '';
    }
  } else if (ch === '#') {
    stream.skipToEnd();
    return 'comment';
  } else if (ch === '"') {
    stream.skipToEnd();
    stream.skipTo('"');
    stream.eat('"');
    return 'string';
  } else if (ch === '=') {
    state.after_equal = true;
    stream.eat('=');
  }

  if (stream.sol()) {
    state.after_equal = false;
  }

  if (state.sec === '') {
    stream.skipToEnd();
    return '';
  }

  if (stream.sol()) {
    if (state.sec !== '') {
      if ((state.sec === 'g' && stream.match(new RegExp('^g[2-9]?'))) || stream.match(state.sec)) {
        if (stream.peek() === ' ' || stream.peek() === '=') {
          return 'builtin';
        } else {
          state.sec = '';
          stream.next();
          return null;
        }
      } else {
        state.sec = '';
        stream.next();
        return null;
      }
    } else {
      stream.next();
      return null;
    }
  }

  if (!state.after_equal) {
    stream.next();
    return null;
  }

  if (state.sec === 'r' || state.sec === 'p') {
    // Match: r = [sub], [obj], [act]
    //        p = [sub], [obj], [act]
    if (state.comma) {
      state.comma = false;
      if (stream.match(new RegExp('^[_a-zA-Z][_a-zA-Z0-9]*'))) {
        return 'property';
      }
    }
    if (stream.eat(',') || stream.eat(' ')) {
      state.comma = true;
      return '';
    }
  } else if (state.sec === 'e') {
    // Match: e = some(where (p.[eft] == allow))
    if (state.dot) {
      state.dot = false;
      if (stream.match(new RegExp('^[_a-zA-Z][_a-zA-Z0-9]*'))) {
        return 'property';
      }
    }
    if (stream.eat('.')) {
      state.dot = true;
      return '';
    }

    // Match: e = some(where ([p].eft == allow))
    if (stream.match('p') && stream.peek() === '.') {
      return 'builtin';
    }

    // Match: e = [some]([where] (p.eft == allow))
    if (stream.match('some') || stream.match('where') || stream.match('priority')) {
      return 'keyword';
    }

    // Match: e = some(where (p.eft == [allow]))
    if (stream.match('allow') || stream.match('deny')) {
      return 'string';
    }
  } else if (state.sec === 'm') {
    // Match: m = r.[sub] == p.[sub] && r.[obj] == p.[obj] && r.[act] == p.[act]
    if (state.dot) {
      state.dot = false;
      if (stream.match(new RegExp('^[_a-zA-Z][_a-zA-Z0-9]*'))) {
        return 'property';
      }
    }
    if (stream.eat('.')) {
      state.dot = true;
      return '';
    }

    // Match: m = [r].sub == [p].sub && [r].obj == [p].obj && [r].act == [p].act
    if ((stream.match('r') || stream.match('p')) && stream.peek() === '.') {
      return 'builtin';
    }

    // Match: m = [g](r.sub, p.sub) && r.obj == p.obj && r.act == p.act
    if (stream.match(new RegExp('^[_a-zA-Z][_a-zA-Z0-9]*')) && stream.peek() === '(') {
      return 'def';
    }
  }

  stream.next();
  return null;
};

export const CasbinConfLang = StreamLanguage.define({
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

export function CasbinConfSupport() {
  return new LanguageSupport(CasbinConfLang);
}
