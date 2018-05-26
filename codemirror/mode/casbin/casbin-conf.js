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

  CodeMirror.defineMode("casbin-conf", function() {
    function tokenBase (stream, state) {
      var ch = stream.peek();

      if (ch === "[") {
        if (stream.match("[request_definition")) {
          state.sec = "r";
          stream.skipTo("]");
          stream.eat("]");
          return "header"
        } else if (stream.match("[policy_definition")) {
          state.sec = "p";
          stream.skipTo("]");
          stream.eat("]");
          return "header"
        } else if (stream.match("[role_definition")) {
          state.sec = "g";
          stream.skipTo("]");
          stream.eat("]");
          return "header"
        } else if (stream.match("[policy_effect")) {
          state.sec = "e";
          stream.skipTo("]");
          stream.eat("]");
          return "header"
        } else if (stream.match("[matchers")) {
          state.sec = "m";
          stream.skipTo("]");
          stream.eat("]");
          return "header"
        } else {
          state.sec = "";
          stream.skipTo("]");
          stream.eat("]");
          return ""
        }
      } else if (ch === "#") {
        stream.skipToEnd();
        return "comment";
      } else if (ch === "\"") {
        stream.skipToEnd();
        stream.skipTo("\"");
        stream.eat("\"");
        return "string"
      } else if (ch === "=") {
        state.after_equal = true
        stream.eat("=");
      }

      if (stream.sol()) {
        state.after_equal = false
      }

      if (state.sec === "") {
        stream.skipToEnd();
        return ""
      }

      if (!state.after_equal && stream.sol()) {
        if (state.sec === "r" && stream.match("r")) {
          return "builtin"
        } else if (state.sec === "p" && stream.match("p")) {
          return "builtin"
        } else if (state.sec === "e" && stream.match("e")) {
          return "builtin"
        } else if (state.sec === "m" && stream.match("m")) {
          return "builtin"
        } else if (state.sec === "g" && stream.match(new RegExp("^g[2-9]?"))) {
          return "builtin"
        } else {
          stream.next();
          return
        }
      }

      if (state.sec === "r" || state.sec === "p") {
        if (state.after_equal && stream.match(new RegExp("^[_a-zA-Z][_a-zA-Z0-9]*"))) {
          return "property"
        }
      } else if (state.sec === "e") {
        if (stream.match("some") || stream.match("where") || stream.match("priority")) {
          return "keyword"
        }
        if (stream.match("allow") || stream.match("deny")) {
          return "string"
        }

        // Match: e = some(where (p.[eft] == allow))
        if (stream.eat(".")) {
          state.dot = true;
          return ""
        }
        if (state.dot && stream.match(new RegExp("^[_a-zA-Z][_a-zA-Z0-9]*"))) {
          state.dot = false;
          return "property"
        }

        // Match: e = some(where ([p].eft == allow))
        if (stream.match("p") && stream.peek() === ".") {
          return "builtin"
        }
      } else if (state.sec === "m") {
        // Match: m = r.[sub] == p.[sub] && r.[obj] == p.[obj] && r.[act] == p.[act]
        if (stream.eat(".")) {
          state.dot = true;
          return ""
        }
        if (state.dot && stream.match(new RegExp("^[_a-zA-Z][_a-zA-Z0-9]*"))) {
          state.dot = false;
          return "property"
        }

        // Match: m = [r].sub == [p].sub && [r].obj == [p].obj && [r].act == [p].act
        if ((stream.match("r") || stream.match("p")) && stream.peek() === ".") {
          return "builtin"
        }

        // Match: m = [g](r.sub, p.sub) && r.obj == p.obj && r.act == p.act
        if (stream.match(new RegExp("^[_a-zA-Z][_a-zA-Z0-9]*")) && stream.peek() === "(") {
          return "def"
        }
      }

      stream.next();
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
