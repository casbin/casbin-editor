// @ts-nocheck
import CodeMirror from 'codemirror';

CodeMirror.defineMode('casbin-csv', function() {
  function tokenBase(stream, state) {
    const ch = stream.peek();

    if (ch === '#') {
      stream.skipToEnd();
      return 'comment';
    } else if (ch === ',') {
      stream.eat(',');
      return '';
    }

    if (stream.sol() && stream.match('p')) {
      return 'def';
    }
    if (stream.sol() && (stream.match('g2') || stream.match('g'))) {
      return 'keyword';
    }

    if (stream.skipTo(',')) {
      return 'string';
    }

    stream.skipToEnd();
    return 'property';

    // stream.next();
  }

  return {
    startState: function() {
      return { tokenize: tokenBase };
    },
    token: function(stream, state) {
      return state.tokenize(stream, state);
    }
  };
});
