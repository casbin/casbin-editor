import { PolicyInheritanceParser } from '../app/utils/roleInheritanceParser';

describe('Role Inheritance Graph - Multiple Actions', () => {
  it('should aggregate multiple actions for the same user-resource pair', () => {
    const parser = new PolicyInheritanceParser();
    const policy = `
p, alice, data1, read
p, alice, data1, write
p, bob, data2, write
    `.trim();

    parser.parsePolicy(policy);
    const relations = parser.getConnectionsByType();

    // Should have 3 policy relations
    expect(relations['p']).toBeDefined();
    expect(relations['p'].length).toBe(3);

    // Check that we have the expected relations
    const aliceData1Relations = relations['p'].filter(
      (rel) => rel.source === 'alice' && rel.target === 'data1'
    );
    expect(aliceData1Relations.length).toBe(2);

    // Check individual actions
    const actions = aliceData1Relations.map((rel) => rel.action);
    expect(actions).toContain('read');
    expect(actions).toContain('write');
  });

  it('should handle multiple actions across different users', () => {
    const parser = new PolicyInheritanceParser();
    const policy = `
p, alice, data1, read
p, alice, data1, write
p, alice, data1, delete
p, bob, data1, read
p, bob, data2, write
    `.trim();

    parser.parsePolicy(policy);
    const relations = parser.getConnectionsByType();

    expect(relations['p']).toBeDefined();
    expect(relations['p'].length).toBe(5);

    // Alice should have 3 actions on data1
    const aliceData1Relations = relations['p'].filter(
      (rel) => rel.source === 'alice' && rel.target === 'data1'
    );
    expect(aliceData1Relations.length).toBe(3);
    const aliceActions = aliceData1Relations.map((rel) => rel.action).sort();
    expect(aliceActions).toEqual(['delete', 'read', 'write']);

    // Bob should have 1 action on data1 and 1 on data2
    const bobData1Relations = relations['p'].filter(
      (rel) => rel.source === 'bob' && rel.target === 'data1'
    );
    expect(bobData1Relations.length).toBe(1);
    expect(bobData1Relations[0].action).toBe('read');

    const bobData2Relations = relations['p'].filter(
      (rel) => rel.source === 'bob' && rel.target === 'data2'
    );
    expect(bobData2Relations.length).toBe(1);
    expect(bobData2Relations[0].action).toBe('write');
  });

  it('should preserve actions when mixed with role inheritance', () => {
    const parser = new PolicyInheritanceParser();
    const policy = `
p, alice, data1, read
p, alice, data1, write
g, alice, admin
    `.trim();

    parser.parsePolicy(policy);
    const relations = parser.getConnectionsByType();

    // Should have both p and g relations
    expect(relations['p']).toBeDefined();
    expect(relations['g']).toBeDefined();

    expect(relations['p'].length).toBe(2);
    expect(relations['g'].length).toBe(1);

    // Check p relations
    const aliceRelations = relations['p'].filter((rel) => rel.source === 'alice');
    expect(aliceRelations.length).toBe(2);

    const actions = aliceRelations.map((rel) => rel.action).sort();
    expect(actions).toEqual(['read', 'write']);
  });

  it('should handle empty or single action policies', () => {
    const parser = new PolicyInheritanceParser();
    const policy = 'p, alice, data1, read';

    parser.parsePolicy(policy);
    const relations = parser.getConnectionsByType();

    expect(relations['p']).toBeDefined();
    expect(relations['p'].length).toBe(1);
    expect(relations['p'][0].action).toBe('read');
  });
});
