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

import {
  parseModelDefinitions,
  validatePolicyLine,
  validatePolicy,
  PolicyDefinition,
} from '../app/utils/policyValidator';

describe('Policy Validator', () => {
  const basicModel = `[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = r.sub == p.sub && r.obj == p.obj && r.act == p.act`;

  const rbacModel = `[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act`;

  const multiRoleModel = `[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[role_definition]
g = _, _
g2 = _, _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act`;

  describe('parseModelDefinitions', () => {
    it('should parse basic policy definition', () => {
      const definitions = parseModelDefinitions(basicModel);
      
      expect(definitions.size).toBe(1);
      expect(definitions.has('p')).toBe(true);
      
      const pDef = definitions.get('p');
      expect(pDef).toBeDefined();
      expect(pDef?.fieldCount).toBe(3);
      expect(pDef?.fieldNames).toEqual(['sub', 'obj', 'act']);
    });

    it('should parse RBAC model with role definition', () => {
      const definitions = parseModelDefinitions(rbacModel);
      
      expect(definitions.size).toBe(2);
      expect(definitions.has('p')).toBe(true);
      expect(definitions.has('g')).toBe(true);
      
      const gDef = definitions.get('g');
      expect(gDef).toBeDefined();
      expect(gDef?.fieldCount).toBe(2);
      expect(gDef?.fieldNames).toEqual(['_', '_']);
    });

    it('should parse model with multiple role definitions', () => {
      const definitions = parseModelDefinitions(multiRoleModel);
      
      expect(definitions.size).toBe(3);
      expect(definitions.has('p')).toBe(true);
      expect(definitions.has('g')).toBe(true);
      expect(definitions.has('g2')).toBe(true);
      
      const g2Def = definitions.get('g2');
      expect(g2Def).toBeDefined();
      expect(g2Def?.fieldCount).toBe(3);
    });

    it('should return empty map for empty model', () => {
      const definitions = parseModelDefinitions('');
      expect(definitions.size).toBe(0);
    });

    it('should ignore comments', () => {
      const modelWithComments = `[policy_definition]
# This is a comment
p = sub, obj, act
# Another comment`;
      
      const definitions = parseModelDefinitions(modelWithComments);
      expect(definitions.size).toBe(1);
      expect(definitions.has('p')).toBe(true);
    });
  });

  describe('validatePolicyLine', () => {
    let definitions: Map<string, PolicyDefinition>;

    beforeEach(() => {
      definitions = parseModelDefinitions(basicModel);
    });

    it('should accept valid policy line', () => {
      const error = validatePolicyLine('p, alice, data1, read', definitions);
      expect(error).toBeNull();
    });

    it('should accept policy line with extra whitespace', () => {
      const error = validatePolicyLine('p,  alice,  data1,  read', definitions);
      expect(error).toBeNull();
    });

    it('should skip empty lines', () => {
      const error = validatePolicyLine('', definitions);
      expect(error).toBeNull();
    });

    it('should skip comment lines', () => {
      const error = validatePolicyLine('# This is a comment', definitions);
      expect(error).toBeNull();
    });

    it('should detect incomplete policy line with trailing comma', () => {
      const error = validatePolicyLine('p, bob,', definitions);
      expect(error).not.toBeNull();
      expect(error).toContain('Incomplete policy line');
      expect(error).toContain('missing value after comma');
    });

    it('should detect incomplete policy line with missing fields', () => {
      const error = validatePolicyLine('p, bob, data2', definitions);
      expect(error).not.toBeNull();
      expect(error).toContain('Incomplete policy line');
      expect(error).toContain('expected 3 fields');
      expect(error).toContain('got 2');
    });

    it('should detect too many fields', () => {
      const error = validatePolicyLine('p, bob, data2, write, extra', definitions);
      expect(error).not.toBeNull();
      expect(error).toContain('Too many fields');
      expect(error).toContain('expected 3 fields');
      expect(error).toContain('got 4');
    });

    it('should detect empty values', () => {
      const error = validatePolicyLine('p, bob, , write', definitions);
      expect(error).not.toBeNull();
      expect(error).toContain('Empty value');
    });

    it('should detect unknown policy type', () => {
      const error = validatePolicyLine('p2, alice, data1, read', definitions);
      expect(error).not.toBeNull();
      expect(error).toContain('Unknown policy type');
      expect(error).toContain('p2');
    });

    it('should return null when no definitions available', () => {
      const emptyDefinitions = new Map<string, PolicyDefinition>();
      const error = validatePolicyLine('p, alice, data1, read', emptyDefinitions);
      expect(error).toBeNull();
    });
  });

  describe('validatePolicyLine with RBAC', () => {
    let definitions: Map<string, PolicyDefinition>;

    beforeEach(() => {
      definitions = parseModelDefinitions(rbacModel);
    });

    it('should validate role definition line', () => {
      const error = validatePolicyLine('g, alice, admin', definitions);
      expect(error).toBeNull();
    });

    it('should detect incomplete role definition', () => {
      const error = validatePolicyLine('g, alice', definitions);
      expect(error).not.toBeNull();
      expect(error).toContain('Incomplete policy line');
      expect(error).toContain('expected 2 fields');
    });
  });

  describe('validatePolicy', () => {
    it('should validate complete policy text', () => {
      const policyText = `p, alice, data1, read
p, bob, data2, write
p, charlie, data3, read`;

      const errors = validatePolicy(policyText, basicModel);
      expect(errors).toHaveLength(0);
    });

    it('should detect multiple errors in policy text', () => {
      const policyText = `p, alice, data1, read
p, bob,
p, charlie, data3, read, extra
p2, dave, data4, write`;

      const errors = validatePolicy(policyText, basicModel);
      expect(errors.length).toBeGreaterThan(0);
      
      // Check that line numbers are correct (1-indexed)
      const errorLines = errors.map(e => e.line);
      expect(errorLines).toContain(2); // p, bob,
      expect(errorLines).toContain(3); // too many fields
      expect(errorLines).toContain(4); // unknown policy type
    });

    it('should skip comments and empty lines', () => {
      const policyText = `# This is a comment
p, alice, data1, read

p, bob, data2, write
# Another comment`;

      const errors = validatePolicy(policyText, basicModel);
      expect(errors).toHaveLength(0);
    });

    it('should return empty array for empty policy', () => {
      const errors = validatePolicy('', basicModel);
      expect(errors).toHaveLength(0);
    });

    it('should return empty array when model has no definitions', () => {
      const policyText = 'p, alice, data1, read';
      const errors = validatePolicy(policyText, '');
      expect(errors).toHaveLength(0);
    });

    it('should validate RBAC policies with roles', () => {
      const policyText = `p, alice, data1, read
p, data2_admin, data2, write
g, bob, data2_admin`;

      const errors = validatePolicy(policyText, rbacModel);
      expect(errors).toHaveLength(0);
    });

    it('should detect errors in RBAC role lines', () => {
      const policyText = `p, alice, data1, read
g, bob`;

      const errors = validatePolicy(policyText, rbacModel);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].line).toBe(2);
      expect(errors[0].policyType).toBe('g');
    });
  });
});
