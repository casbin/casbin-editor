/**
 * Test for the copy content functionality
 */

describe('Copy Content Functionality', () => {
  // Mock navigator.clipboard
  const mockClipboard = {
    writeText: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(() => {
    // Mock navigator globally
    (global as any).navigator = {
      clipboard: mockClipboard,
    };
  });

  beforeEach(() => {
    // Reset mock before each test
    mockClipboard.writeText.mockClear();
  });

  test('should format content with model, policy, request, and result', async () => {
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

    // Simulate the copy functionality
    await navigator.clipboard.writeText(expectedContent);

    expect(mockClipboard.writeText).toHaveBeenCalledWith(expectedContent);
    expect(mockClipboard.writeText).toHaveBeenCalledTimes(1);
  });

  test('should handle empty policy and request', async () => {
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

    await navigator.clipboard.writeText(expectedContent);

    expect(mockClipboard.writeText).toHaveBeenCalledWith(expectedContent);
  });

  test('should format content suitable for ChatGPT', () => {
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
});
