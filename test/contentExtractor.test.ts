/**
 * Test for the content extraction functionality with AI filtering
 * @jest-environment jsdom
 */

// Mock the contentExtractor module since it uses DOM APIs
describe('Content Extractor with AI Filtering', () => {
  beforeEach(() => {
    // Clear the document body before each test
    document.body.innerHTML = '';
  });

  const createMockTranslation = (key: string) => key;

  test('should exclude elements with data-exclude-from-ai attribute', () => {
    // Create a main element with mixed content
    const main = document.createElement('main');
    main.innerHTML = `
      <div>
        <div>Model</div>
        <div>ACL Model Content</div>
      </div>
      <div data-exclude-from-ai="true">
        <div>Node Types</div>
        <div>User</div>
        <div>Role</div>
        <div>Resource</div>
      </div>
      <div>
        <div>Policy</div>
        <div>p, alice, data1, read</div>
      </div>
    `;
    document.body.appendChild(main);

    // Get filtered text using TreeWalker (same approach as contentExtractor)
    let text = '';
    const walker = document.createTreeWalker(
      main,
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: (node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as Element;
            if (el.hasAttribute('data-exclude-from-ai')) {
              return NodeFilter.FILTER_REJECT;
            }
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let currentNode: Node | null;
    while ((currentNode = walker.nextNode())) {
      if (currentNode.nodeType === Node.TEXT_NODE) {
        const textContent = currentNode.textContent || '';
        if (textContent.trim()) {
          text += textContent.trim() + ' ';
        }
      }
    }

    // Should include Model and Policy sections
    expect(text).toContain('Model');
    expect(text).toContain('ACL Model Content');
    expect(text).toContain('Policy');
    expect(text).toContain('p, alice, data1, read');

    // Should NOT include content from data-exclude-from-ai section
    expect(text).not.toContain('Node Types');
    expect(text).not.toContain('User');
    expect(text).not.toContain('Role');
    expect(text).not.toContain('Resource');
  });

  test('should exclude nested elements when parent has data-exclude-from-ai', () => {
    const main = document.createElement('main');
    main.innerHTML = `
      <div>Policy: p, alice, data1, read</div>
      <div data-exclude-from-ai="true">
        <div>
          <span>Connection Types</span>
          <div>P (Policy)</div>
          <div>G (Role)</div>
        </div>
      </div>
      <div>Request: alice, data1, read</div>
    `;
    document.body.appendChild(main);

    let text = '';
    const walker = document.createTreeWalker(
      main,
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: (node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as Element;
            if (el.hasAttribute('data-exclude-from-ai')) {
              return NodeFilter.FILTER_REJECT;
            }
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let currentNode: Node | null;
    while ((currentNode = walker.nextNode())) {
      if (currentNode.nodeType === Node.TEXT_NODE) {
        const textContent = currentNode.textContent || '';
        if (textContent.trim()) {
          text += textContent.trim() + ' ';
        }
      }
    }

    // Should include Policy and Request
    expect(text).toContain('Policy');
    expect(text).toContain('p, alice, data1, read');
    expect(text).toContain('Request');

    // Should NOT include any nested content from excluded section
    expect(text).not.toContain('Connection Types');
    expect(text).not.toContain('P (Policy)');
    expect(text).not.toContain('G (Role)');
  });

  test('should include content when no data-exclude-from-ai attributes are present', () => {
    const main = document.createElement('main');
    main.innerHTML = `
      <div>Model: ACL</div>
      <div>Policy: p, alice, data1, read</div>
      <div>Request: alice, data1, read</div>
    `;
    document.body.appendChild(main);

    let text = '';
    const walker = document.createTreeWalker(
      main,
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: (node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as Element;
            if (el.hasAttribute('data-exclude-from-ai')) {
              return NodeFilter.FILTER_REJECT;
            }
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let currentNode: Node | null;
    while ((currentNode = walker.nextNode())) {
      if (currentNode.nodeType === Node.TEXT_NODE) {
        const textContent = currentNode.textContent || '';
        if (textContent.trim()) {
          text += textContent.trim() + ' ';
        }
      }
    }

    // Should include all content
    expect(text).toContain('Model');
    expect(text).toContain('ACL');
    expect(text).toContain('Policy');
    expect(text).toContain('Request');
  });
});
