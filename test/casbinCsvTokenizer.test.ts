import { StringStream } from '@codemirror/language';
import { token as casbinToken } from '../app/components/editor/casbin-mode/casbin-csv';

describe('Casbin CSV Tokenizer', () => {
  const createStream = (text: string, pos = 0) => {
    const stream = new StringStream(text, 4, pos);
    return stream;
  };

  describe('Policy keyword recognition', () => {
    it('should recognize "p" at start of line followed by comma', () => {
      const stream = createStream('p, alice, data1, read');
      const state = {};
      const token = casbinToken(stream, state);
      expect(token).toBe('def');
    });

    it('should recognize "g" at start of line followed by comma', () => {
      const stream = createStream('g, alice, admin');
      const state = {};
      const token = casbinToken(stream, state);
      expect(token).toBe('keyword');
    });

    it('should recognize "g2" at start of line followed by comma', () => {
      const stream = createStream('g2, alice, admin');
      const state = {};
      const token = casbinToken(stream, state);
      expect(token).toBe('keyword');
    });

    it('should NOT recognize "p" when it is part of a larger identifier', () => {
      const stream = createStream('password, alice, data1, read');
      const state = {};
      const token = casbinToken(stream, state);
      expect(token).not.toBe('def');
      expect(token).toBe('string'); // Should be treated as a regular string
    });

    it('should NOT recognize "g" when it is part of "guest"', () => {
      const stream = createStream('guest, 2, 2, file_public, 2, 2, read');
      const state = {};
      const token = casbinToken(stream, state);
      expect(token).not.toBe('keyword');
      expect(token).toBe('string'); // Should be treated as a regular string
    });

    it('should NOT recognize "g" when it is part of "manager"', () => {
      const stream = createStream('manager, 4, 4, file_secret, 4, 2, read');
      const state = {};
      const token = casbinToken(stream, state);
      expect(token).not.toBe('keyword');
      expect(token).toBe('string'); // Should be treated as a regular string
    });

    it('should recognize "p" with spaces before comma', () => {
      const stream = createStream('p , alice, data1, read');
      const state = {};
      const token = casbinToken(stream, state);
      expect(token).toBe('def');
    });

    it('should recognize "g" with spaces before comma', () => {
      const stream = createStream('g , alice, admin');
      const state = {};
      const token = casbinToken(stream, state);
      expect(token).toBe('keyword');
    });
  });

  describe('Comment recognition', () => {
    it('should recognize comments starting with #', () => {
      const stream = createStream('# This is a comment');
      const state = {};
      const token = casbinToken(stream, state);
      expect(token).toBe('comment');
    });
  });

  describe('General tokenization', () => {
    it('should handle comma separators', () => {
      const stream = createStream(', alice');
      const state = {};
      const token = casbinToken(stream, state);
      expect(token).toBe(''); // Comma returns empty string
    });
  });
});
