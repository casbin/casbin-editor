/**
 * Casbin built-in matching function configuration templates
 * 
 * All key matching functions follow this format:
 * bool function_name(string url, string pattern)
 * Returns a boolean indicating whether the URL matches the pattern.
 */

export const CONFIG_TEMPLATES = {
  default: {
    label: 'default',
    value: `(function() {
  return {
    /**
     * Here is custom functions for Casbin.
     * Currently, there are built-in globMatch, keyMatch, keyMatch2, keyMatch3, keyMatch4, regexMatch, ipMatch.
     */
    functions: {},
    /**
     * If the value is undefined, the Casbin does not use it.
     * example:
     * matchingForGFunction: 'globMatch'
     * matchingDomainForGFunction: 'keyMatch'
     */
    matchingForGFunction: undefined,
    matchingDomainForGFunction: undefined
  };
})();`
  },

  keyMatch: {
    label: 'RESTful (KeyMatch)',
    value: `(function() {
  return {
    functions: {
      /**
       * keyMatch supports * wildcard matching
       * Example:
       * - URL: /alice_data/resource1
       * - Pattern: /alice_data/* 
       * - Match result: true
       * 
       * Use case: Simple wildcard URL matching
       */
      keyMatch: true,
      regexMatch: true
    },
    matchingForGFunction: undefined,
    matchingDomainForGFunction: undefined
  };
})();`
  },

  keyMatch2: {
    label: 'RESTful (KeyMatch2)',
    value: `(function() {
  return {
    functions: {
      /**
       * keyMatch2 supports :param parameter matching
       * Example:
       * - URL: /alice_data/resource1
       * - Pattern: /alice_data/:resource
       * - Match result: true
       * 
       * Use case: Parameter matching in RESTful APIs
       */
      keyMatch2: true,
      regexMatch: true
    },
    matchingForGFunction: undefined,
    matchingDomainForGFunction: undefined
  };
})();`
  },

  keyMatch3: {
    label: 'RESTful (KeyMatch3)',
    value: `(function() {
  return {
    functions: {
      /**
       * keyMatch3 supports {param} parameter matching
       * Example:
       * - URL: /alice_data/resource1
       * - Pattern: /alice_data/{resource}
       * - Match result: true
       * 
       * Use case: Parameter matching using curly braces
       */
      keyMatch3: true,
      regexMatch: true
    },
    matchingForGFunction: undefined,
    matchingDomainForGFunction: undefined
  };
})();`
  },

  keyMatch4: {
    label: 'RESTful (KeyMatch4)',
    value: `(function() {
  return {
    functions: {
      /**
       * keyMatch4 supports multiple identical parameter matching
       * Example:
       * - URL: /alice_data/123/book/123
       * - Pattern: /alice_data/{id}/book/{id}
       * - Match result: true
       * 
       * Use case: When multiple parameters in a URL need to have the same value
       */
      keyMatch4: true,
      regexMatch: true
    },
    matchingForGFunction: undefined,
    matchingDomainForGFunction: undefined
  };
})();`
  },

  keyMatch5: {
    label: 'RESTful (KeyMatch5)',
    value: `(function() {
  return {
    functions: {
      /**
       * keyMatch5 supports query parameter matching
       * Example:
       * - URL: /alice_data/123/?status=1
       * - Pattern: /alice_data/{id}/*
       * - Match result: true
       * 
       * Use case: Handling URL query parameters
       */
      keyMatch5: true,
      regexMatch: true
    },
    matchingForGFunction: undefined,
    matchingDomainForGFunction: undefined
  };
})();`
  },

  regexMatch: {
    label: 'Regex Match',
    value: `(function() {
  return {
    functions: {
      /**
       * regexMatch supports regular expression matching
       * Example:
       * - String: /alice_data/resource1
       * - Regex pattern: ^/alice_data/.*$
       * - Match result: true
       * 
       * Use case: Complex string matching rules
       */
      regexMatch: true
    },
    matchingForGFunction: undefined,
    matchingDomainForGFunction: undefined
  };
})();`
  },

  ipMatch: {
    label: 'IP Match',
    value: `(function() {
  return {
    functions: {
      /**
       * ipMatch supports IP address and CIDR matching
       * Example:
       * - IP: 192.168.2.123
       * - CIDR: 192.168.2.0/24
       * - Match result: true
       * 
       * Use case: Access control based on IP address
       */
      ipMatch: true
    },
    matchingForGFunction: undefined,
    matchingDomainForGFunction: undefined
  };
})();`
  },

  globMatch: {
    label: 'Glob Match',
    value: `(function() {
  return {
    functions: {
      /**
       * globMatch supports Glob pattern matching
       * Example:
       * - Path: /alice_data/resource1
       * - Glob pattern: /alice_data/*
       * - Match result: true
       * 
       * Use case: File path matching, similar to shell wildcards
       */
      globMatch: true
    },
    matchingForGFunction: undefined,
    matchingDomainForGFunction: undefined
  };
})();`
  }
};
