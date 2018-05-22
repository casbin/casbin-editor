
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
