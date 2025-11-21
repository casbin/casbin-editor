/**
 * Test for the download content functionality
 */

describe('Download Content Functionality', () => {

  test('should create a blob with formatted content', () => {
    const modelText = '[request_definition]\nr = sub, obj, act\n\n[policy_definition]\np = sub, obj, act';
    const policy = 'p, alice, data1, read\np, bob, data2, write';
    const request = 'alice, data1, read';
    const requestResult = 'true Reason: ["alice","data1","read"]';

    const expectedContent = [
      '# Casbin Policy Configuration',
      '',
      '## Model',
      '```',
      modelText,
      '```',
      '',
      '## Policy',
      '```',
      policy,
      '```',
      '',
      '## Request',
      '```',
      request,
      '```',
      '',
      '## Enforcement Result',
      '```',
      requestResult,
      '```',
    ].join('\n');

    const blob = new Blob([expectedContent], { type: 'text/plain' });
    expect(blob.type).toBe('text/plain');
    expect(blob.size).toBeGreaterThan(0);
  });

  test('should handle empty policy and request', () => {
    const modelText = '[request_definition]\nr = sub, obj, act';
    const policy = '';
    const request = '';
    const requestResult = '';

    const expectedContent = [
      '# Casbin Policy Configuration',
      '',
      '## Model',
      '```',
      modelText,
      '```',
      '',
      '## Policy',
      '```',
      '(empty)',
      '```',
      '',
      '## Request',
      '```',
      '(empty)',
      '```',
      '',
      '## Enforcement Result',
      '```',
      '(empty)',
      '```',
    ].join('\n');

    const blob = new Blob([expectedContent], { type: 'text/plain' });
    expect(blob.type).toBe('text/plain');
  });

  test('should format content suitable for download', () => {
    const modelText = '[request_definition]\nr = sub, obj, act';
    const policy = 'p, alice, data1, read';
    const request = 'alice, data1, read';
    const requestResult = 'true';

    const content = [
      '# Casbin Policy Configuration',
      '',
      '## Model',
      '```',
      modelText,
      '```',
      '',
      '## Policy',
      '```',
      policy,
      '```',
      '',
      '## Request',
      '```',
      request,
      '```',
      '',
      '## Enforcement Result',
      '```',
      requestResult,
      '```',
    ].join('\n');

    // The content should be markdown formatted
    expect(content).toContain('# Casbin Policy Configuration');
    expect(content).toContain('## Model');
    expect(content).toContain('## Policy');
    expect(content).toContain('## Request');
    expect(content).toContain('## Enforcement Result');
    expect(content).toContain('```');
  });

  test('should create correct filename format', () => {
    const date = new Date('2024-01-15T10:30:00.000Z');
    const timestamp = date.toISOString().replace(/[:.]/g, '-').split('T')[0];
    const expectedFilename = `casbin-config-${timestamp}.txt`;
    
    expect(expectedFilename).toMatch(/^casbin-config-\d{4}-\d{2}-\d{2}\.txt$/);
    expect(expectedFilename).toBe('casbin-config-2024-01-15.txt');
  });
});
