// Test for custom function naming logic to avoid duplicates

describe('Custom Function Naming', () => {
  /**
   * Test the function naming logic that extracts numbers from function names
   * and finds the next available number to avoid duplicates.
   */
  test('should generate unique function names after deletion', () => {
    // Simulate the naming logic from CustomConfigPanel
    const generateNextFunctionName = (existingFunctions: { name: string }[]): string => {
      // Find the highest function number in existing my_func names to avoid duplicates
      const existingNumbers = existingFunctions
        .filter((f) => {
          return !['matchingForGFunction', 'matchingDomainForGFunction'].includes(f.name);
        })
        .map((f) => {
          const match = f.name.match(/^my_func(\d+)$/);
          return match ? parseInt(match[1], 10) : 0;
        })
        .filter((num) => num > 0);

      const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
      return `my_func${nextNumber}`;
    };

    // Test case 1: Starting with no functions
    expect(generateNextFunctionName([])).toBe('my_func1');

    // Test case 2: Adding to existing functions
    expect(generateNextFunctionName([{ name: 'my_func1' }])).toBe('my_func2');
    expect(generateNextFunctionName([{ name: 'my_func1' }, { name: 'my_func2' }])).toBe('my_func3');

    // Test case 3: After deleting my_func1, new function should be my_func4, not my_func2
    const functionsAfterDeletion = [{ name: 'my_func2' }, { name: 'my_func3' }];
    expect(generateNextFunctionName(functionsAfterDeletion)).toBe('my_func4');

    // Test case 4: With special functions mixed in
    const functionsWithSpecial = [
      { name: 'my_func1' },
      { name: 'matchingForGFunction' },
      { name: 'my_func2' },
      { name: 'matchingDomainForGFunction' },
    ];
    expect(generateNextFunctionName(functionsWithSpecial)).toBe('my_func3');

    // Test case 5: After deleting middle function
    const functionsWithGap = [{ name: 'my_func1' }, { name: 'my_func3' }];
    expect(generateNextFunctionName(functionsWithGap)).toBe('my_func4');

    // Test case 6: Non-standard function names should be ignored
    const functionsWithNonStandard = [
      { name: 'my_func1' },
      { name: 'customFunc' },
      { name: 'my_func2' },
    ];
    expect(generateNextFunctionName(functionsWithNonStandard)).toBe('my_func3');

    // Test case 7: Only special functions exist
    const onlySpecialFunctions = [
      { name: 'matchingForGFunction' },
      { name: 'matchingDomainForGFunction' },
    ];
    expect(generateNextFunctionName(onlySpecialFunctions)).toBe('my_func1');
  });
});
