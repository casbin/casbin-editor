/* eslint-disable */

const examplePolicy = {
  /////////////////////////////////////////////////////////////////////////
  basic: 'p, alice, data1, read\n' + 'p, bob, data2, write',
  /////////////////////////////////////////////////////////////////////////
  basic_with_root: 'p, alice, data1, read\n' + 'p, bob, data2, write',
  /////////////////////////////////////////////////////////////////////////
  basic_without_resources: 'p, alice, read\n' + 'p, bob, write',
  /////////////////////////////////////////////////////////////////////////
  basic_without_users: 'p, data1, read\n' + 'p, data2, write',
  /////////////////////////////////////////////////////////////////////////
  rbac:
    'p, alice, data1, read\n' +
    'p, bob, data2, write\n' +
    'p, data2_admin, data2, read\n' +
    'p, data2_admin, data2, write\n' +
    '\n' +
    'g, alice, data2_admin',
  /////////////////////////////////////////////////////////////////////////
  rbac_with_resource_roles:
    'p, alice, data1, read\n' +
    'p, bob, data2, write\n' +
    'p, data_group_admin, data_group, write\n' +
    '\n' +
    'g, alice, data_group_admin\n' +
    'g2, data1, data_group\n' +
    'g2, data2, data_group',
  /////////////////////////////////////////////////////////////////////////
  rbac_with_domains:
    'p, admin, domain1, data1, read\n' +
    'p, admin, domain1, data1, write\n' +
    'p, admin, domain2, data2, read\n' +
    'p, admin, domain2, data2, write\n' +
    '\n' +
    'g, alice, admin, domain1\n' +
    'g, bob, admin, domain2',
  /////////////////////////////////////////////////////////////////////////
  rbac_with_deny:
    'p, alice, data1, read, allow\n' +
    'p, bob, data2, write, allow\n' +
    'p, data2_admin, data2, read, allow\n' +
    'p, data2_admin, data2, write, allow\n' +
    'p, alice, data2, write, deny\n' +
    '\n' +
    'g, alice, data2_admin',
  /////////////////////////////////////////////////////////////////////////
  abac: '',
  /////////////////////////////////////////////////////////////////////////
  abac_with_policy_rule: 'p, r.sub.Age > 18 && r.sub.Age < 60, /data1, read\n',
  /////////////////////////////////////////////////////////////////////////
  keymatch:
    'p, alice, /alice_data/*, GET\n' +
    'p, alice, /alice_data/resource1, POST\n' +
    '\n' +
    'p, bob, /alice_data/resource2, GET\n' +
    'p, bob, /bob_data/*, POST\n' +
    '\n' +
    'p, cathy, /cathy_data, (GET)|(POST)',
  /////////////////////////////////////////////////////////////////////////
  keymatch2: 'p, alice, /alice_data/:resource, GET\n' + 'p, alice, /alice_data2/:id/using/:resId, GET',
  /////////////////////////////////////////////////////////////////////////
  ipmatch: 'p, 192.168.2.0/24, data1, read\n' + 'p, 10.0.0.0/16, data2, write',
  /////////////////////////////////////////////////////////////////////////
  priority:
    'p, alice, data1, read, allow\n' +
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
    'g, bob, data2_allow_group'
  /////////////////////////////////////////////////////////////////////////
};

export default examplePolicy;
