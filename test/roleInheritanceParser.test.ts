import { PolicyInheritanceParser } from '@/app/utils/roleInheritanceParser';

describe('PolicyInheritanceParser', () => {
  describe('parsePolicyRule with effect parameter', () => {
    it('should correctly parse policy rule with deny effect', () => {
      const parser = new PolicyInheritanceParser();
      const policy = 'p, alice, data1, read, deny';
      
      parser.parsePolicy(policy);
      const connections = parser.getConnectionsByType();
      
      expect(connections['p']).toBeDefined();
      expect(connections['p'].length).toBe(1);
      expect(connections['p'][0].source).toBe('alice');
      expect(connections['p'][0].target).toBe('data1');
      expect(connections['p'][0].action).toBe('read');
      expect(connections['p'][0].effect).toBe('deny');
    });

    it('should correctly parse policy rule with allow effect', () => {
      const parser = new PolicyInheritanceParser();
      const policy = 'p, bob, data2, write, allow';
      
      parser.parsePolicy(policy);
      const connections = parser.getConnectionsByType();
      
      expect(connections['p']).toBeDefined();
      expect(connections['p'].length).toBe(1);
      expect(connections['p'][0].source).toBe('bob');
      expect(connections['p'][0].target).toBe('data2');
      expect(connections['p'][0].action).toBe('write');
      expect(connections['p'][0].effect).toBe('allow');
    });

    it('should correctly parse policy rule without effect parameter', () => {
      const parser = new PolicyInheritanceParser();
      const policy = 'p, alice, data1, read';
      
      parser.parsePolicy(policy);
      const connections = parser.getConnectionsByType();
      
      expect(connections['p']).toBeDefined();
      expect(connections['p'].length).toBe(1);
      expect(connections['p'][0].source).toBe('alice');
      expect(connections['p'][0].target).toBe('data1');
      expect(connections['p'][0].action).toBe('read');
      expect(connections['p'][0].effect).toBeUndefined();
    });

    it('should correctly parse policy rule with domain (non-effect 4th parameter)', () => {
      const parser = new PolicyInheritanceParser();
      const policy = 'p, alice, data1, read, domain1';
      
      parser.parsePolicy(policy);
      const connections = parser.getConnectionsByType();
      
      expect(connections['p']).toBeDefined();
      expect(connections['p'].length).toBe(1);
      expect(connections['p'][0].source).toBe('alice');
      expect(connections['p'][0].target).toBe('data1');
      expect(connections['p'][0].action).toBe('read');
      expect(connections['p'][0].domain).toBe('domain1');
      expect(connections['p'][0].effect).toBeUndefined();
    });

    it('should correctly parse policy rule with both effect and domain', () => {
      const parser = new PolicyInheritanceParser();
      const policy = 'p, alice, data1, read, deny, domain1';
      
      parser.parsePolicy(policy);
      const connections = parser.getConnectionsByType();
      
      expect(connections['p']).toBeDefined();
      expect(connections['p'].length).toBe(1);
      expect(connections['p'][0].source).toBe('alice');
      expect(connections['p'][0].target).toBe('data1');
      expect(connections['p'][0].action).toBe('read');
      expect(connections['p'][0].effect).toBe('deny');
      expect(connections['p'][0].domain).toBe('domain1');
    });

    it('should correctly parse multiple policy rules with mixed effects', () => {
      const parser = new PolicyInheritanceParser();
      const policy = `p, alice, data1, read, deny
p, bob, data2, write, allow
p, charlie, data3, read`;
      
      parser.parsePolicy(policy);
      const connections = parser.getConnectionsByType();
      
      expect(connections['p']).toBeDefined();
      expect(connections['p'].length).toBe(3);
      
      // Check first policy (deny)
      expect(connections['p'][0].source).toBe('alice');
      expect(connections['p'][0].effect).toBe('deny');
      
      // Check second policy (allow)
      expect(connections['p'][1].source).toBe('bob');
      expect(connections['p'][1].effect).toBe('allow');
      
      // Check third policy (no effect)
      expect(connections['p'][2].source).toBe('charlie');
      expect(connections['p'][2].effect).toBeUndefined();
    });
  });
});
