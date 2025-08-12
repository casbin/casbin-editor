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
  blp: {
    name: 'BLP',
    model: `[request_definition]
r = sub, sub_level, obj, obj_level, act

[policy_definition]
p = sub, obj, act

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = (r.act == "read" && r.sub_level >= r.obj_level) || (r.act == "write" && r.sub_level <= r.obj_level)`,
    policy: '',
    request: `alice, 3, data1, 1, read
bob, 2, data2, 2, read
charlie, 1, data1, 1, read
bob, 2, data3, 3, read
charlie, 1, data2, 2, read
alice, 3, data3, 3, write
bob, 2, data3, 3, write
charlie, 1, data2, 2, write
alice, 3, data1, 1, write
bob, 2, data1, 1, write`,
    customConfig: undefined,
    enforceContext: undefined,
  },
  biba: {
    name: 'BIBA',
    model: `[request_definition]
r = sub, sub_level, obj, obj_level, act

[policy_definition]
p = sub, obj, act

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = (r.act == "read" && r.sub_level <= r.obj_level) || (r.act == "write" && r.sub_level >= r.obj_level)`,
    policy: '',
    request: `alice, 3, data1, 1, read
bob, 2, data2, 2, read
charlie, 1, data1, 1, read
bob, 2, data3, 3, read
charlie, 1, data2, 2, read
alice, 3, data3, 3, write
bob, 2, data3, 3, write
charlie, 1, data2, 2, write
alice, 3, data1, 1, write
bob, 2, data1, 1, write`,
    customConfig: undefined,
    enforceContext: undefined,
  },
  lbac: {
    name: 'LBAC',
    model: `[request_definition]
r = sub, subject_confidentiality, subject_integrity, obj, object_confidentiality, object_integrity, act

[policy_definition]
p = sub, obj, act

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = (r.act == "read" && r.subject_confidentiality >= r.object_confidentiality && ` +
     `r.subject_integrity >= r.object_integrity) || ` +
     `(r.act == "write" && r.subject_confidentiality <= r.object_confidentiality && ` +
     `r.subject_integrity <= r.object_integrity)`,
    policy: '',
    request: `admin, 5, 5, file_topsecret, 3, 3, read
manager, 4, 4, file_secret, 4, 2, read
staff, 3, 3, file_internal, 2, 3, read
guest, 2, 2, file_public, 2, 2, read
staff, 3, 3, file_secret, 4, 2, read
manager, 4, 4, file_sensitive, 3, 5, read
guest, 2, 2, file_internal, 3, 1, read
staff, 3, 3, file_protected, 1, 4, read
guest, 2, 2, file_public, 2, 2, write
staff, 3, 3, file_internal, 5, 4, write
manager, 4, 4, file_secret, 4, 5, write
admin, 5, 5, file_archive, 5, 5, write
manager, 4, 4, file_internal, 3, 5, write
staff, 3, 3, file_public, 2, 2, write
admin, 5, 5, file_secret, 5, 4, write
guest, 2, 2, file_private, 1, 3, write`,
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
  rbac_with_domains_and_resources: {
    name: 'RBAC with domains and resource hierarchy',
    model: `[request_definition]
r = sub, dom, obj, act

[policy_definition]
p = sub, dom, obj, act

[role_definition]
g = _, _, _
g2 = _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = g(r.sub, p.sub, r.dom) && r.dom == p.dom && g2(r.obj, p.obj) && r.act == p.act`,
    policy: `p, admin, domain1, resource1, read
p, admin, domain1, resource1, write
p, admin, domain2, resource2, read
p, admin, domain2, resource2, write

g, alice, admin, domain1
g, bob, admin, domain2

g2, resource1:sub1, resource1
g2, resource2:sub2, resource2`,
    request: `alice, domain1, resource1:sub1, read
bob, domain1, resource1, read
alice, domain1, resource2, read
bob, domain2, resource2:sub2, write`,
    customConfig: undefined,
    enforceContext: undefined,
  },
  rbac_with_time: {
    name: 'RBAC with time constraints',
    model: `[request_definition]
r = sub, obj, act, time

[policy_definition]
p = sub, obj, act, time_start, time_end

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act && r.time >= p.time_start && r.time <= p.time_end`,
    policy: `p, alice, data1, read, 09:00, 18:00
p, bob, data2, write, 13:00, 16:00

g, cathy, alice`,
    request: `cathy, data1, read, 10:00
cathy, data1, read, 08:00
cathy, data1, read, 19:00
bob, data2, write, 14:00
bob, data2, write, 12:00`,
    customConfig: undefined,
    enforceContext: undefined,
  },
  rbac_with_tags: {
    name: 'RBAC with tags',
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
m = g(r.sub, p.sub) && (r.obj == p.obj || g2(r.obj, p.obj)) && r.act == p.act`,
    policy: `p, admin, restricted_data, read
p, admin, confidential, write

g, alice, admin
g, bob, admin

g2, data1, restricted_data
g2, data2, confidential`,
    request: `alice, data1, read
alice, data2, write
bob, data2, read
alice, data3, read`,
    customConfig: undefined,
    enforceContext: undefined,
  },
  rbac_with_resource_filter: {
    name: 'RBAC with resource filter',
    model: `[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = g(r.sub, p.sub) && keyMatch2(r.obj, p.obj) && r.act == p.act`,
    policy: `p, admin, /data/*, read
p, admin, /data/private/*, write
g, alice, admin`,
    request: `alice, /data/test, read
alice, /data/private/file, write
alice, /other/test, read`,
    customConfig: undefined,
    enforceContext: undefined,
  },

  rbac_with_multiple_roles: {
    name: 'RBAC with multiple roles',
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
    policy: `p, reader, data, read
p, writer, data, write
p, admin, data, delete

g, alice, reader
g, alice, writer
g, bob, reader
g, cathy, admin`,
    request: `alice, data, read
alice, data, write
alice, data, delete
bob, data, write`,
    customConfig: undefined,
    enforceContext: undefined,
  },

  rbac_with_resource_roles_and_deny: {
    name: 'RBAC with resource roles and deny rules',
    model: `[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act, eft

[role_definition]
g = _, _
g2 = _, _

[policy_effect]
e = some(where (p.eft == allow)) && !some(where (p.eft == deny))

[matchers]
m = (g(r.sub, p.sub) || g2(r.obj, p.sub)) && r.obj == p.obj && r.act == p.act`,
    policy: `p, admin, data1, read, allow
p, admin, data2, write, allow
p, public_data, data3, read, allow
p, sensitive_data, data3, read, deny

g, alice, admin
g2, data1, public_data
g2, data2, sensitive_data`,
    request: `alice, data1, read
alice, data2, write
bob, data3, read`,
    customConfig: undefined,
    enforceContext: undefined,
  },
    rebac: {
    name: 'ReBAC',
    model: `[request_definition]
r = sub, obj, act

[policy_definition]
p = role, obj_type, act

[role_definition]
g = _, _, _
g2 = _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = g(r.sub, r.obj, p.role) && g2(r.obj, p.obj_type) && r.act == p.act`,
    policy: `p, collaborator, doc, read

g, alice, doc1, collaborator
g, bob, doc2, collaborator

g2, doc1, doc
g2, doc2, doc`,
    request: `alice, doc1, read
alice, doc1, write
alice, doc2, read
alice, doc2, write
alice, doc3, read
alice, doc3, write
bob, doc1, read
bob, doc1, write
bob, doc2, read
bob, doc2, write
bob, doc3, read
bob, doc3, write`,
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
    request: `alice, { "Owner" : "alice" }
alice, { "Owner" : "bob" }`,
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
    request: `{ "Age": 30}, /data1, read`,
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
