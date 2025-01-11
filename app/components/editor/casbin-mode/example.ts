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

export const example: Record<
  string,
  {
    name: string;
    model: string;
    policy: string;
    request: string;
    customConfig?: string;
    enforceContext?: string;
  }
> = {
  basic: {
    name: 'ACL',
    model: `[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = r.sub == p.sub && r.obj == p.obj && r.act == p.act`,
    policy: `p, alice, data1, read
p, bob, data2, write`,
    request: `alice, data1, read`,
    customConfig: undefined,
    enforceContext: undefined,
  },
  basic_with_root: {
    name: 'ACL with superuser',
    model: `[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = r.sub == p.sub && r.obj == p.obj && r.act == p.act || r.sub == "root"`,
    policy: `p, alice, data1, read
p, bob, data2, write`,
    request: `alice, data1, read`,
    customConfig: undefined,
    enforceContext: undefined,
  },
  basic_without_resources: {
    name: 'ACL without resources',
    model: `[request_definition]
r = sub, act

[policy_definition]
p = sub, act

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = r.sub == p.sub && r.act == p.act`,
    policy: `p, alice, read
p, bob, write`,
    request: `alice, read`,
    customConfig: undefined,
    enforceContext: undefined,
  },
  basic_without_users: {
    name: 'ACL without users',
    model: `[request_definition]
r = obj, act

[policy_definition]
p = obj, act

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = r.obj == p.obj && r.act == p.act`,
    policy: `p, data1, read
p, data2, write`,
    request: `data1, read`,
    customConfig: undefined,
    enforceContext: undefined,
  },
  rbac: {
    name: 'RBAC',
    model: `[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act`,
    policy: `p, alice, data1, read
p, bob, data2, write
p, data2_admin, data2, read
p, data2_admin, data2, write

g, alice, data2_admin`,
    request: `alice, data2, read`,
    customConfig: undefined,
    enforceContext: undefined,
  },
  rbac_with_resource_roles: {
    name: 'RBAC with resource roles',
    model: `[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[role_definition]
g = _, _
g2 = _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = g(r.sub, p.sub) && g2(r.obj, p.obj) && r.act == p.act`,
    policy: `p, alice, data1, read
p, bob, data2, write
p, data_group_admin, data_group, write

g, alice, data_group_admin
g2, data1, data_group
g2, data2, data_group`,
    request: `alice, data1, read
alice, data1, write
alice, data2, read
alice, data2, write `,
    customConfig: undefined,
    enforceContext: undefined,
  },
  rbac_with_domains: {
    name: 'RBAC with domains/tenants',
    model: `[request_definition]
r = sub, dom, obj, act

[policy_definition]
p = sub, dom, obj, act

[role_definition]
g = _, _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = g(r.sub, p.sub, r.dom) && r.dom == p.dom && r.obj == p.obj && r.act == p.act`,
    policy: `p, admin, domain1, data1, read
p, admin, domain1, data1, write
p, admin, domain2, data2, read
p, admin, domain2, data2, write

g, alice, admin, domain1
g, bob, admin, domain2`,
    request: `alice, domain1, data1, read`,
    customConfig: undefined,
    enforceContext: undefined,
  },
  rbac_with_pattern: {
    name: 'RBAC with pattern',
    model: `[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = g(r.sub, p.sub) && regexMatch(r.act, p.act)`,
    policy: `p, pen_admin, data1, GET
g, /book/:id, pen_admin
`,
    request: `/book/1, data1, GET`,
    customConfig: `(function() {
  return {
    /**
     * Here is custom functions for Casbin.
     * Currently, there are built-in globMatch, keyMatch, keyMatch2, keyMatch3, keyMatch4, regexMatch, ipMatch.
     * See https://casbin.org/docs/function#functions-in-matchers for more details.
     */
    functions: {},
    /**
     * The value comes from config.functions, Casbin will not use this configuration if the value is undefined.
     * See https://casbin.org/docs/rbac#use-pattern-matching-in-rbac for more details.
     * example:
     * matchingForGFunction: 'globMatch'
     * matchingDomainForGFunction: 'keyMatch'
     */
    matchingForGFunction: 'keyMatch2',
    matchingDomainForGFunction: undefined
  };
})();`,
    enforceContext: undefined,
  },
  rbac_with_all_pattern: {
    name: 'RBAC with all pattern',
    model: `[request_definition]
r = sub, dom, obj, act

[policy_definition]
p = sub, dom, obj, act

[role_definition]
g = _, _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = g(r.sub, p.sub, r.dom) && r.dom == p.dom && r.obj == p.obj &&  r.act == p.act`,
    policy: `p, book_group, domain1, data1, read
p, book_group, domain2, data2, write

g, /book/:id, book_group, *`,
    request: `/book/1, domain1, data1, read
/book/1, domain2, data2, write
`,
    customConfig: `(function() {
  return {
    /**
     * Here is custom functions for Casbin.
     * Currently, there are built-in globMatch, keyMatch, keyMatch2, keyMatch3, keyMatch4, regexMatch, ipMatch.
     */
    functions: {},
    /**
     * The value comes from config.functions, Casbin will not use this configuration if the value is undefined.
     * example:
     * matchingForGFunction: 'globMatch'
     * matchingDomainForGFunction: 'keyMatch'
     */
    matchingForGFunction: 'keyMatch2',
    matchingDomainForGFunction: 'keyMatch2'
  };
})();`,
    enforceContext: undefined,
  },
  rbac_with_deny: {
    name: 'RBAC with deny-override',
    model: `[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act, eft

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow)) && !some(where (p.eft == deny))

[matchers]
m = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act`,
    policy: `p, alice, data1, read, allow
p, bob, data2, write, allow
p, data2_admin, data2, read, allow
p, data2_admin, data2, write, allow
p, alice, data2, write, deny

g, alice, data2_admin`,
    request: `alice, data1, read
alice, data2, write`,
    customConfig: undefined,
    enforceContext: undefined,
  },
  abac: {
    name: 'ABAC',
    model: `[request_definition]
r = sub, obj

[policy_definition]
p = sub, obj

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = r.sub == r.obj.Owner`,
    policy: '',
    request: `alice, { Owner: 'alice'}
alice, { Owner: 'bob'}`,
    customConfig: undefined,
    enforceContext: undefined,
  },
  abac_with_policy_rule: {
    name: 'ABAC with policy rule',
    model: `[request_definition]
r = sub, obj, act

[policy_definition]
p = sub_rule, obj, act

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = eval(p.sub_rule) && r.obj == p.obj && r.act == p.act`,
    policy: `p, r.sub.Age > 18 && r.sub.Age < 60, /data1, read
`,
    request: `{ Age: 30}, /data1, read`,
    customConfig: undefined,
    enforceContext: undefined,
  },
  keymatch: {
    name: 'RESTful (KeyMatch)',
    model: `[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = r.sub == p.sub && keyMatch(r.obj, p.obj) && regexMatch(r.act, p.act)`,
    policy: `p, alice, /alice_data/*, GET
p, alice, /alice_data/resource1, POST

p, bob, /alice_data/resource2, GET
p, bob, /bob_data/*, POST

p, cathy, /cathy_data, (GET)|(POST)`,
    request: 'alice, /alice_data/hello, GET',
    customConfig: undefined,
    enforceContext: undefined,
  },
  keymatch2: {
    name: 'RESTful (KeyMatch2)',
    model: `[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = r.sub == p.sub && keyMatch2(r.obj, p.obj) && regexMatch(r.act, p.act)`,
    policy: `p, alice, /alice_data/:resource, GET
p, alice, /alice_data2/:id/using/:resId, GET`,
    request: `alice, /alice_data/hello, GET
alice, /alice_data/hello, POST`,
    customConfig: undefined,
    enforceContext: undefined,
  },
  keymatch3: {
    name: 'RESTful (KeyMatch3)',
    model: `[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = r.sub == p.sub && keyMatch3(r.obj, p.obj) && regexMatch(r.act, p.act)`,
    policy: `p, alice, /alice_data/{resource}/, GET
p, alice, /alice_data2/{id}/using/{resId}/, GET`,
    request: `alice, /alice_data/hello/, GET
alice, /alice_data/hello/, POST`,
    customConfig: undefined,
    enforceContext: undefined,
  },
  keymatch4: {
    name: 'RESTful (KeyMatch4)',
    model: `[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = r.sub == p.sub && keyMatch4(r.obj, p.obj) && regexMatch(r.act, p.act)`,
    policy: `p, alice, /alice_data/{resource}?, GET
p, alice, /alice_data2/{id}/using/{resId}?, GET`,
    request: `alice, /alice_data/hello?, GET
alice, /alice_data/hello?, POST`,
    customConfig: undefined,
    enforceContext: undefined,
  },
  keymatch5: {
    name: 'RESTful (KeyMatch5)',
    model: `[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = r.sub == p.sub && keyMatch5(r.obj, p.obj) && regexMatch(r.act, p.act)`,
    policy: `p, alice, /alice_data/{resource}/.*, GET
p, alice, /alice_data2/{id}/using/{resId}/.*, GET`,
    request: `alice, /alice_data/hello/123, GET
alice, /alice_data/hello/123, POST`,
    customConfig: undefined,
    enforceContext: undefined,
  },
  ipmatch: {
    name: 'IP match',
    model: `[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = ipMatch(r.sub, p.sub) && r.obj == p.obj && r.act == p.act`,
    policy: `p, 192.168.2.0/24, data1, read
p, 10.0.0.0/16, data2, write`,
    request: `192.168.2.1, data1, read
10.0.2.3, data2, write`,
    customConfig: undefined,
    enforceContext: undefined,
  },
  priority: {
    name: 'Priority',
    model: `[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act, eft

[role_definition]
g = _, _

[policy_effect]
e = priority(p.eft) || deny

[matchers]
m = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act`,
    policy: `p, alice, data1, read, allow
p, data1_deny_group, data1, read, deny
p, data1_deny_group, data1, write, deny
p, alice, data1, write, allow

g, alice, data1_deny_group

p, data2_allow_group, data2, read, allow
p, bob, data2, read, deny
p, bob, data2, write, deny

g, bob, data2_allow_group`,
    request: `alice, data1, read`,
    customConfig: undefined,
    enforceContext: undefined,
  },
};

export const defaultCustomConfig = `(function() {
  return {
    functions: {
      my_func1: (arg1, arg2) => {
  return arg1.endsWith(arg2);
}
    },
  };
})();`;
export const defaultEnforceContext = `{
  "r": "r",
  "p": "p",
  "e": "e",
  "m": "m"
}`;
