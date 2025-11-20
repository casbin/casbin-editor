/**
 * Test for the content extractor functionality
 */

import { extractPageContent } from '@/app/utils/contentExtractor';

// Mock the DOM
const mockMainContent = `
Model
[request_definition]
r = sub, obj, act

Policy
p, alice, data1, read
p, bob, data2, write

Request
alice, data1, read

Enforcement Result
true

RUN THE TEST
`;

describe('Content Extractor', () => {
  beforeEach(() => {
    // Mock document.querySelector
    (global as any).document = {
      querySelector: jest.fn((selector: string) => {
        if (selector === 'main') {
          return {
            innerText: mockMainContent,
          };
        }
        return null;
      }),
    };
  });

  const mockT = (key: string) => key;

  test('should extract content without custom config', () => {
    const { extractedContent, message } = extractPageContent('model', mockT, 'en');

    expect(extractedContent).toContain('Custom Functions:');
    expect(extractedContent).toContain('No Custom Functions found');
    expect(message).toContain('Please explain in en language');
    expect(message).toContain('Briefly explain the Model content');
  });

  test('should include function name when custom config is provided', () => {
    const customConfig = `(function() {
      return {
        functions: {
          my_func1: (arg1, arg2) => {
            return arg1.endsWith(arg2);
          }
        },
        matchingForGFunction: undefined,
        matchingDomainForGFunction: undefined
      };
    })();`;

    const { extractedContent, message } = extractPageContent('model', mockT, 'en', customConfig);

    expect(extractedContent).toContain('Custom Functions:');
    expect(extractedContent).toContain('my_func1');
    expect(extractedContent).toContain('arg1.endsWith(arg2)');
    expect(message).toContain('my_func1');
  });

  test('should include multiple function names when multiple functions are provided', () => {
    const customConfig = `(function() {
      return {
        functions: {
          my_func1: (arg1, arg2) => {
            return arg1.endsWith(arg2);
          },
          my_func2: (str, prefix) => {
            return str.startsWith(prefix);
          }
        },
        matchingForGFunction: undefined,
        matchingDomainForGFunction: undefined
      };
    })();`;

    const { extractedContent, message } = extractPageContent('model', mockT, 'en', customConfig);

    expect(extractedContent).toContain('my_func1');
    expect(extractedContent).toContain('my_func2');
    expect(extractedContent).toContain('arg1.endsWith(arg2)');
    expect(extractedContent).toContain('str.startsWith(prefix)');
  });

  test('should include special matching functions with names', () => {
    const customConfig = `(function() {
      return {
        functions: {},
        matchingForGFunction: (user, role) => {
          return user.department === role.department;
        },
        matchingDomainForGFunction: (domain1, domain2) => {
          return domain1.startsWith(domain2);
        }
      };
    })();`;

    const { extractedContent, message } = extractPageContent('model', mockT, 'en', customConfig);

    expect(extractedContent).toContain('matchingForGFunction');
    expect(extractedContent).toContain('matchingDomainForGFunction');
    expect(extractedContent).toContain('user.department === role.department');
    expect(extractedContent).toContain('domain1.startsWith(domain2)');
  });

  test('should handle empty custom config string', () => {
    const { extractedContent } = extractPageContent('model', mockT, 'en', '');

    expect(extractedContent).toContain('No Custom Functions found');
  });

  test('should handle invalid custom config', () => {
    const { extractedContent } = extractPageContent('model', mockT, 'en', 'invalid javascript');

    expect(extractedContent).toContain('No Custom Functions found');
  });

  test('should generate different messages for different box types', () => {
    const customConfig = `(function() {
      return {
        functions: {
          my_func1: (arg1, arg2) => {
            return arg1.endsWith(arg2);
          }
        },
        matchingForGFunction: undefined,
        matchingDomainForGFunction: undefined
      };
    })();`;

    const modelResult = extractPageContent('model', mockT, 'en', customConfig);
    expect(modelResult.message).toContain('Briefly explain the Model content');

    const policyResult = extractPageContent('policy', mockT, 'en', customConfig);
    expect(policyResult.message).toContain('Briefly explain the Policy content');

    const requestResult = extractPageContent('request', mockT, 'en', customConfig);
    expect(requestResult.message).toContain('Briefly explain the Request content');

    const enforcementResult = extractPageContent('enforcementResult', mockT, 'en', customConfig);
    expect(enforcementResult.message).toContain('Why this result');
  });
});
