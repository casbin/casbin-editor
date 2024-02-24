import {
  IndentContext,
  LanguageSupport,
  StreamLanguage,
  StringStream,
} from '@codemirror/language'
import { tags as t } from '@lezer/highlight'

const token = (stream: StringStream, state) => {
  const ch = stream.peek()

  if (ch === '#') {
    stream.skipToEnd()
    return 'comment'
  } else if (ch === ',') {
    stream.eat(',')
    return ''
  }

  if (stream.sol() && stream.match('p')) {
    return 'def'
  }
  if (stream.sol() && (stream.match('g2') || stream.match('g'))) {
    return 'keyword'
  }

  if (stream.skipTo(',')) {
    return 'string'
  }

  stream.skipToEnd()
  return 'property'

  // stream.next();
}

export const CasbinPolicyLang = StreamLanguage.define({
  name: 'firestore',
  startState: (indentUnit: number) => {
    return {}
  },
  token: token,
  blankLine: (state: {}, indentUnit: number): void => {},
  copyState: (state: {}) => {},
  indent: (
    state: {},
    textAfter: string,
    context: IndentContext,
  ): number | null => {
    return 0
  },
  languageData: {
    commentTokens: { line: ';' },
  },
  tokenTable: {
    p: t.keyword,
    read: t.keyword,
    write: t.keyword,
  },
})

export function CasbinPolicySupport() {
  return new LanguageSupport(CasbinPolicyLang)
}
