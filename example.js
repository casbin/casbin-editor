
var model_data = {
    /////////////////////////////////////////////////////////////////////////
    'basic': '[request_definition]\n' +
    'r = sub, obj, act\n' +
    '\n' +
    '[policy_definition]\n' +
    'p = sub, obj, act\n' +
    '\n' +
    '[policy_effect]\n' +
    'e = some(where (p.eft == allow))\n' +
    '\n' +
    '[matchers]\n' +
    'm = r.sub == p.sub && r.obj == p.obj && r.act == p.act',
    /////////////////////////////////////////////////////////////////////////
    'basic_with_root': '[request_definition]\n' +
    'r = sub, obj, act\n' +
    '\n' +
    '[policy_definition]\n' +
    'p = sub, obj, act\n' +
    '\n' +
    '[policy_effect]\n' +
    'e = some(where (p.eft == allow))\n' +
    '\n' +
    '[matchers]\n' +
    'm = r.sub == p.sub && r.obj == p.obj && r.act == p.act || r.sub == "root"',
    /////////////////////////////////////////////////////////////////////////
    'basic_without_resources': '[request_definition]\n' +
    'r = sub, act\n' +
    '\n' +
    '[policy_definition]\n' +
    'p = sub, act\n' +
    '\n' +
    '[policy_effect]\n' +
    'e = some(where (p.eft == allow))\n' +
    '\n' +
    '[matchers]\n' +
    'm = r.sub == p.sub && r.act == p.act',
    /////////////////////////////////////////////////////////////////////////
    'basic_without_users': '[request_definition]\n' +
    'r = obj, act\n' +
    '\n' +
    '[policy_definition]\n' +
    'p = obj, act\n' +
    '\n' +
    '[policy_effect]\n' +
    'e = some(where (p.eft == allow))\n' +
    '\n' +
    '[matchers]\n' +
    'm = r.obj == p.obj && r.act == p.act',
    /////////////////////////////////////////////////////////////////////////
    'rbac': '[request_definition]\n' +
    'r = sub, obj, act\n' +
    '\n' +
    '[policy_definition]\n' +
    'p = sub, obj, act\n' +
    '\n' +
    '[role_definition]\n' +
    'g = _, _\n' +
    '\n' +
    '[policy_effect]\n' +
    'e = some(where (p.eft == allow))\n' +
    '\n' +
    '[matchers]\n' +
    'm = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act',
    /////////////////////////////////////////////////////////////////////////
    'rbac_with_resource_roles': '[request_definition]\n' +
    'r = sub, obj, act\n' +
    '\n' +
    '[policy_definition]\n' +
    'p = sub, obj, act\n' +
    '\n' +
    '[role_definition]\n' +
    'g = _, _\n' +
    'g2 = _, _\n' +
    '\n' +
    '[policy_effect]\n' +
    'e = some(where (p.eft == allow))\n' +
    '\n' +
    '[matchers]\n' +
    'm = g(r.sub, p.sub) && g2(r.obj, p.obj) && r.act == p.act',
    /////////////////////////////////////////////////////////////////////////
    'rbac_with_domains': '[request_definition]\n' +
    'r = sub, dom, obj, act\n' +
    '\n' +
    '[policy_definition]\n' +
    'p = sub, dom, obj, act\n' +
    '\n' +
    '[role_definition]\n' +
    'g = _, _, _\n' +
    '\n' +
    '[policy_effect]\n' +
    'e = some(where (p.eft == allow))\n' +
    '\n' +
    '[matchers]\n' +
    'm = g(r.sub, p.sub, r.dom) && r.dom == p.dom && r.obj == p.obj && r.act == p.act',
    /////////////////////////////////////////////////////////////////////////
    'rbac_with_deny': '[request_definition]\n' +
    'r = sub, obj, act\n' +
    '\n' +
    '[policy_definition]\n' +
    'p = sub, obj, act, eft\n' +
    '\n' +
    '[role_definition]\n' +
    'g = _, _\n' +
    '\n' +
    '[policy_effect]\n' +
    'e = some(where (p.eft == allow)) && !some(where (p.eft == deny))\n' +
    '\n' +
    '[matchers]\n' +
    'm = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act',
    /////////////////////////////////////////////////////////////////////////
    'abac': '[request_definition]\n' +
    'r = sub, obj, act\n' +
    '\n' +
    '[policy_definition]\n' +
    'p = sub, obj, act\n' +
    '\n' +
    '[policy_effect]\n' +
    'e = some(where (p.eft == allow))\n' +
    '\n' +
    '[matchers]\n' +
    'm = r.sub == r.obj.Owner',
    /////////////////////////////////////////////////////////////////////////
    'keymatch': '[request_definition]\n' +
    'r = sub, obj, act\n' +
    '\n' +
    '[policy_definition]\n' +
    'p = sub, obj, act\n' +
    '\n' +
    '[policy_effect]\n' +
    'e = some(where (p.eft == allow))\n' +
    '\n' +
    '[matchers]\n' +
    'm = r.sub == p.sub && keyMatch(r.obj, p.obj) && regexMatch(r.act, p.act)',
    /////////////////////////////////////////////////////////////////////////
    'keymatch2': '[request_definition]\n' +
    'r = sub, obj, act\n' +
    '\n' +
    '[policy_definition]\n' +
    'p = sub, obj, act\n' +
    '\n' +
    '[policy_effect]\n' +
    'e = some(where (p.eft == allow))\n' +
    '\n' +
    '[matchers]\n' +
    'm = r.sub == p.sub && keyMatch2(r.obj, p.obj) && regexMatch(r.act, p.act)',
    /////////////////////////////////////////////////////////////////////////
    'ipmatch': '[request_definition]\n' +
    'r = sub, obj, act\n' +
    '\n' +
    '[policy_definition]\n' +
    'p = sub, obj, act\n' +
    '\n' +
    '[policy_effect]\n' +
    'e = some(where (p.eft == allow))\n' +
    '\n' +
    '[matchers]\n' +
    'm = ipMatch(r.sub, p.sub) && r.obj == p.obj && r.act == p.act',
    /////////////////////////////////////////////////////////////////////////
    'priority': '[request_definition]\n' +
    'r = sub, obj, act\n' +
    '\n' +
    '[policy_definition]\n' +
    'p = sub, obj, act, eft\n' +
    '\n' +
    '[role_definition]\n' +
    'g = _, _\n' +
    '\n' +
    '[policy_effect]\n' +
    'e = priority(p.eft) || deny\n' +
    '\n' +
    '[matchers]\n' +
    'm = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act',
    /////////////////////////////////////////////////////////////////////////
};

var policy_data = {
    /////////////////////////////////////////////////////////////////////////
    'basic': 'p, alice, data1, read\n' +
    'p, bob, data2, write',
    /////////////////////////////////////////////////////////////////////////
    'basic_with_root': 'p, alice, data1, read\n' +
    'p, bob, data2, write',
    /////////////////////////////////////////////////////////////////////////
    'basic_without_resources': 'p, alice, read\n' +
    'p, bob, write',
    /////////////////////////////////////////////////////////////////////////
    'basic_without_users': 'p, data1, read\n' +
    'p, data2, write',
    /////////////////////////////////////////////////////////////////////////
    'rbac': 'p, alice, data1, read\n' +
    'p, bob, data2, write\n' +
    'p, data2_admin, data2, read\n' +
    'p, data2_admin, data2, write\n' +
    '\n' +
    'g, alice, data2_admin',
    /////////////////////////////////////////////////////////////////////////
    'rbac_with_resource_roles': 'p, alice, data1, read\n' +
    'p, bob, data2, write\n' +
    'p, data_group_admin, data_group, write\n' +
    '\n' +
    'g, alice, data_group_admin\n' +
    'g2, data1, data_group\n' +
    'g2, data2, data_group',
    /////////////////////////////////////////////////////////////////////////
    'rbac_with_domains': 'p, admin, domain1, data1, read\n' +
    'p, admin, domain1, data1, write\n' +
    'p, admin, domain2, data2, read\n' +
    'p, admin, domain2, data2, write\n' +
    '\n' +
    'g, alice, admin, domain1\n' +
    'g, bob, admin, domain2',
    /////////////////////////////////////////////////////////////////////////
    'rbac_with_deny': 'p, alice, data1, read, allow\n' +
    'p, bob, data2, write, allow\n' +
    'p, data2_admin, data2, read, allow\n' +
    'p, data2_admin, data2, write, allow\n' +
    'p, alice, data2, write, deny\n' +
    '\n' +
    'g, alice, data2_admin',
    /////////////////////////////////////////////////////////////////////////
    'abac': '',
    /////////////////////////////////////////////////////////////////////////
    'keymatch': 'p, alice, /alice_data/*, GET\n' +
    'p, alice, /alice_data/resource1, POST\n' +
    '\n' +
    'p, bob, /alice_data/resource2, GET\n' +
    'p, bob, /bob_data/*, POST\n' +
    '\n' +
    'p, cathy, /cathy_data, (GET)|(POST)',
    /////////////////////////////////////////////////////////////////////////
    'keymatch2': 'p, alice, /alice_data/:resource, GET\n' +
    'p, alice, /alice_data2/:id/using/:resId, GET',
    /////////////////////////////////////////////////////////////////////////
    'ipmatch': 'p, 192.168.2.0/24, data1, read\n' +
    'p, 10.0.0.0/16, data2, write',
    /////////////////////////////////////////////////////////////////////////
    'priority': 'p, alice, data1, read, allow\n' +
    'p, data1_deny_group, data1, read, deny\n' +
    'p, data1_deny_group, data1, write, deny\n' +
    'p, alice, data1, write, allow\n' +
    '\n' +
    'g, alice, data1_deny_group\n' +
    '\n' +
    'p, data2_allow_group, data2, read, allow\n' +
    'p, bob, data2, read, deny\n' +
    'p, bob, data2, write, deny\n' +
    '\n' +
    'g, bob, data2_allow_group',
    /////////////////////////////////////////////////////////////////////////
};
