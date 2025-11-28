import { PolicyInheritanceParser } from '../app/utils/roleInheritanceParser';

describe('PolicyInheritanceParser', () => {
  describe('determineNodeType', () => {
    it('should correctly identify subject position as user type for all subjects in policy rules', () => {
      const parser = new PolicyInheritanceParser();
      const policy = `p, alice, data1, read
p, bob, data2, write
p, cathy, data1, read`;

      parser.parsePolicy(policy);
      const tree = parser.buildPolicyGraph();

      // Find nodes by name
      const findNode = (name: string) => tree.find((n) => n.name === name);

      // All subjects (first position in p rules) should be typed as 'user'
      const aliceNode = findNode('alice');
      const bobNode = findNode('bob');
      const cathyNode = findNode('cathy');

      expect(aliceNode).toBeDefined();
      expect(bobNode).toBeDefined();
      expect(cathyNode).toBeDefined();

      // This is the key assertion - cathy should be 'user', not 'object'
      expect(aliceNode?.type).toBe('user');
      expect(bobNode?.type).toBe('user');
      expect(cathyNode?.type).toBe('user');
    });

    it('should correctly identify object position as resource type', () => {
      const parser = new PolicyInheritanceParser();
      const policy = `p, alice, data1, read
p, bob, data2, write`;

      parser.parsePolicy(policy);
      const tree = parser.buildPolicyGraph();

      const findNode = (name: string) => tree.find((n) => n.name === name);

      const data1Node = findNode('data1');
      const data2Node = findNode('data2');

      expect(data1Node).toBeDefined();
      expect(data2Node).toBeDefined();

      // Objects in second position should be 'resource'
      expect(data1Node?.type).toBe('resource');
      expect(data2Node?.type).toBe('resource');
    });

    it('should correctly handle new subjects that do not match heuristic patterns', () => {
      const parser = new PolicyInheritanceParser();
      // Names that don't match any heuristic patterns like 'alice', 'bob', 'charlie'
      const policy = `p, john, file1, read
p, sarah, document2, write
p, mike123, resource3, delete`;

      parser.parsePolicy(policy);
      const tree = parser.buildPolicyGraph();

      const findNode = (name: string) => tree.find((n) => n.name === name);

      const johnNode = findNode('john');
      const sarahNode = findNode('sarah');
      const mikeNode = findNode('mike123');

      // All should be typed as 'user' based on position, not heuristics
      expect(johnNode?.type).toBe('user');
      expect(sarahNode?.type).toBe('user');
      expect(mikeNode?.type).toBe('user');
    });

    it('should handle G rules correctly with heuristic fallback for roles', () => {
      const parser = new PolicyInheritanceParser();
      const policy = `p, alice, data1, read
g, alice, admin`;

      parser.parsePolicy(policy);
      const tree = parser.buildPolicyGraph();

      // For G rules, the tree structure is: alice (parent) -> admin (child)
      // So we need to recursively find nodes in the tree
      const findNodeInTree = (nodes: typeof tree, name: string): (typeof tree)[0] | undefined => {
        for (const node of nodes) {
          if (node.name === name) return node;
          if (node.children && node.children.length > 0) {
            const found = findNodeInTree(node.children as typeof tree, name);
            if (found) return found;
          }
        }
        return undefined;
      };

      const aliceNode = findNodeInTree(tree, 'alice');
      const adminNode = findNodeInTree(tree, 'admin');

      expect(aliceNode?.type).toBe('user');
      // 'admin' should be identified as 'role' by heuristics
      expect(adminNode?.type).toBe('role');
    });

    it('should use model parameters when available', () => {
      const parser = new PolicyInheritanceParser();
      const model = `[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = r.sub == p.sub && r.obj == p.obj && r.act == p.act`;

      const policy = `p, cathy, data1, read`;

      parser.parsePolicy(policy, model);
      const tree = parser.buildPolicyGraph();

      const findNode = (name: string) => tree.find((n) => n.name === name);

      const cathyNode = findNode('cathy');
      const data1Node = findNode('data1');

      // With model, types should be based on model parameters
      expect(cathyNode?.type).toBe('sub');
      expect(data1Node?.type).toBe('obj');
    });

    it('should correctly identify roles and users in RBAC with multiple roles', () => {
      const parser = new PolicyInheritanceParser();
      // This is the "RBAC with multiple roles" example from the issue
      const policy = `p, reader, data, read
p, writer, data, write
p, admin, data, delete

g, alice, reader
g, alice, writer
g, bob, reader
g, cathy, admin`;

      parser.parsePolicy(policy);
      const tree = parser.buildPolicyGraph();

      // Helper to find nodes in tree recursively
      const findNodeInTree = (nodes: typeof tree, name: string): (typeof tree)[0] | undefined => {
        for (const node of nodes) {
          if (node.name === name) return node;
          if (node.children && node.children.length > 0) {
            const found = findNodeInTree(node.children as typeof tree, name);
            if (found) return found;
          }
        }
        return undefined;
      };

      // reader, writer, admin are targets in G rules, so they should be 'role'
      const readerNode = findNodeInTree(tree, 'reader');
      const writerNode = findNodeInTree(tree, 'writer');
      const adminNode = findNodeInTree(tree, 'admin');

      expect(readerNode?.type).toBe('role');
      expect(writerNode?.type).toBe('role');
      expect(adminNode?.type).toBe('role');

      // alice, bob, cathy are sources in G rules only (not targets), so they should be 'user'
      const aliceNode = findNodeInTree(tree, 'alice');
      const bobNode = findNodeInTree(tree, 'bob');
      const cathyNode = findNodeInTree(tree, 'cathy');

      expect(aliceNode?.type).toBe('user');
      expect(bobNode?.type).toBe('user');
      expect(cathyNode?.type).toBe('user');

      // data is an object in P rules
      const dataNode = findNodeInTree(tree, 'data');
      expect(dataNode?.type).toBe('resource');
    });
  });
});
