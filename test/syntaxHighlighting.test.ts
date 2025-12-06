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

import { token as confToken } from '../app/components/editor/casbin-mode/casbin-conf';
import { token as csvToken } from '../app/components/editor/casbin-mode/casbin-csv';

// Helper function to create a mock StringStream
function createStream(input: string, pos = 0) {
  const stream = {
    string: input,
    pos: pos,
    start: pos,
    tabSize: 4,
    indentUnit: 2,
    lastColumnPos: 0,
    lastColumnValue: 0,
    lineStart: 0,
    
    sol: function() {
      return this.pos === this.lineStart;
    },
    
    eol: function() {
      return this.pos >= this.string.length;
    },
    
    peek: function() {
      return this.string.charAt(this.pos) || undefined;
    },
    
    next: function() {
      if (this.pos < this.string.length) {
        return this.string.charAt(this.pos++);
      }
    },
    
    eat: function(match: string | RegExp | ((char: string) => boolean)) {
      const ch = this.string.charAt(this.pos);
      let ok;
      if (typeof match === 'string') {
        ok = ch === match;
      } else if (match instanceof RegExp) {
        ok = match.test(ch);
      } else {
        ok = match(ch);
      }
      if (ok) {
        this.pos++;
        return ch;
      }
    },
    
    eatWhile: function(match: string | RegExp | ((char: string) => boolean)) {
      const start = this.pos;
      while (this.eat(match)) {}
      return this.pos > start;
    },
    
    eatSpace: function() {
      const start = this.pos;
      while (/\s/.test(this.string.charAt(this.pos))) this.pos++;
      return this.pos > start;
    },
    
    skipToEnd: function() {
      this.pos = this.string.length;
    },
    
    skipTo: function(ch: string) {
      const found = this.string.indexOf(ch, this.pos);
      if (found > -1) {
        this.pos = found;
        return true;
      }
      return false;
    },
    
    match: function(pattern: string | RegExp, consume = true, caseInsensitive = false) {
      if (typeof pattern === 'string') {
        const cased = (str: string) => caseInsensitive ? str.toLowerCase() : str;
        const substr = this.string.substr(this.pos, pattern.length);
        if (cased(substr) === cased(pattern)) {
          if (consume) this.pos += pattern.length;
          return true;
        }
        return false;
      } else {
        const match = this.string.slice(this.pos).match(pattern);
        if (match && match.index === 0) {
          if (consume) this.pos += match[0].length;
          return match;
        }
        return null;
      }
    },
    
    backUp: function(n: number) {
      this.pos -= n;
    },
    
    column: function() {
      return this.pos - this.lineStart;
    },
    
    indentation: function() {
      return 0;
    },
    
    current: function() {
      return this.string.slice(this.start, this.pos);
    },
  };
  
  return stream;
}

describe('Casbin Conf Syntax Highlighting', () => {
  describe('Model Editor - Role Definitions', () => {
    it('should highlight g = _, _', () => {
      const stream = createStream('g = _, _');
      const state = { sec: '', afterEqual: false };
      
      const tokenType = confToken(stream as any, state);
      expect(tokenType).toBe('builtin');
      expect(stream.current()).toBe('g ');
    });

    it('should highlight g2 = _, _', () => {
      const stream = createStream('g2 = _, _');
      const state = { sec: '', afterEqual: false };
      
      const tokenType = confToken(stream as any, state);
      expect(tokenType).toBe('builtin');
      expect(stream.current()).toBe('g2 ');
    });

    it('should highlight g3 = _, _', () => {
      const stream = createStream('g3 = _, _');
      const state = { sec: '', afterEqual: false };
      
      const tokenType = confToken(stream as any, state);
      expect(tokenType).toBe('builtin');
      expect(stream.current()).toBe('g3 ');
    });

    it('should highlight g10 = _, _, _', () => {
      const stream = createStream('g10 = _, _, _');
      const state = { sec: '', afterEqual: false };
      
      const tokenType = confToken(stream as any, state);
      expect(tokenType).toBe('builtin');
      expect(stream.current()).toBe('g10 ');
    });

    it('should highlight r = sub, obj, act', () => {
      const stream = createStream('r = sub, obj, act');
      const state = { sec: '', afterEqual: false };
      
      const tokenType = confToken(stream as any, state);
      expect(tokenType).toBe('builtin');
      expect(stream.current()).toBe('r ');
    });

    it('should highlight p = sub, obj, act', () => {
      const stream = createStream('p = sub, obj, act');
      const state = { sec: '', afterEqual: false };
      
      const tokenType = confToken(stream as any, state);
      expect(tokenType).toBe('builtin');
      expect(stream.current()).toBe('p ');
    });
  });

  describe('Model Editor - Matchers with g2, g3', () => {
    it('should highlight g. in matchers', () => {
      const stream = createStream('g.sub');
      const state = { sec: 'matchers', afterEqual: false };
      
      const tokenType = confToken(stream as any, state);
      expect(tokenType).toBe('builtin');
      expect(stream.current()).toBe('g.');
    });

    it('should highlight g2. in matchers', () => {
      const stream = createStream('g2.obj');
      const state = { sec: 'matchers', afterEqual: false };
      
      const tokenType = confToken(stream as any, state);
      expect(tokenType).toBe('builtin');
      expect(stream.current()).toBe('g2.');
    });

    it('should highlight g3. in matchers', () => {
      const stream = createStream('g3.obj');
      const state = { sec: 'matchers', afterEqual: false };
      
      const tokenType = confToken(stream as any, state);
      expect(tokenType).toBe('builtin');
      expect(stream.current()).toBe('g3.');
    });
  });
});

describe('Casbin CSV Syntax Highlighting', () => {
  describe('Policy Editor - Role Grouping', () => {
    it('should highlight g, alice, admin', () => {
      const stream = createStream('g, alice, admin');
      const state = {};
      
      const tokenType = csvToken(stream as any, state);
      expect(tokenType).toBe('keyword');
      expect(stream.current()).toBe('g');
    });

    it('should highlight g2, data1, data_group', () => {
      const stream = createStream('g2, data1, data_group');
      const state = {};
      
      const tokenType = csvToken(stream as any, state);
      expect(tokenType).toBe('keyword');
      expect(stream.current()).toBe('g2');
    });

    it('should highlight g3, data1, data_group', () => {
      const stream = createStream('g3, data1, data_group');
      const state = {};
      
      const tokenType = csvToken(stream as any, state);
      expect(tokenType).toBe('keyword');
      expect(stream.current()).toBe('g3');
    });

    it('should highlight g10, data1, data_group', () => {
      const stream = createStream('g10, data1, data_group');
      const state = {};
      
      const tokenType = csvToken(stream as any, state);
      expect(tokenType).toBe('keyword');
      expect(stream.current()).toBe('g10');
    });

    it('should highlight p, alice, data1, read', () => {
      const stream = createStream('p, alice, data1, read');
      const state = {};
      
      const tokenType = csvToken(stream as any, state);
      expect(tokenType).toBe('def');
      expect(stream.current()).toBe('p');
    });
  });
});
