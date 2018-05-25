// CodeMirror, copyright (c) by Casbin
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  CodeMirror.defineMode("casbin-csv", function() {
    function tokenBase (stream, state) {
      var ch = stream.peek();

      if (ch === "#") {
        stream.skipToEnd();
        return "comment";
      } else if (ch === ",") {
        stream.eat(",");
        return "";
      }

      if (stream.sol() && stream.match("p")) {
        return "def";
      }
      if (stream.sol() && (stream.match("g2") || stream.match("g"))) {
        return "keyword";
      }

      if (stream.skipTo(",")) {
        return "string"
      }

      stream.skipToEnd();
      return "property";

      // stream.next();
    }

    return {
      startState: function () {
        return {tokenize: tokenBase};
      },
      token: function (stream, state) {
        return state.tokenize(stream, state);
      }
    };
  });
});
