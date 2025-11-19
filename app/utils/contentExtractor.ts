const escapeRegExp = (s: string) => {
  return s.replace(/[.*+?^${}()|[\\]\\]/g, '\\\\$&');
}

// Remove common UI noise and unnecessary labels, keep meaningful lines
const cleanContent = (content: string) => {
  if (!content) return '';
  const blacklist = [
    /Ask AI/i,
    /\\bRESET\\b/i,
    /Explain it/i,
    /Role Inheritance Graph/i,
    /casbin-editor/i,
    /Model Gallery/i,
  ];

  return content
    .replace(/^\\d+\\s+/gm, '')
    .split('\\n')
    .map((l) => {
      return l.trim();
    })
    .filter((l) => {
      return l !== '' && !blacklist.some((r) => {
        return r.test(l);
      });
    })
    .join('\\n')
    .trim();
};

const removeEmptyLines = (content: string) => {
  return content
    .split('\\n')
    .filter((line) => {
      return line.trim() !== '';
    })
    .join('\\n');
};

export const extractPageContent = (
  boxType: string,
  t: (key: string) => string,
  lang: string,
  overrides?: { model?: string; policy?: string; request?: string; enforcementResult?: string },
) => {
  const mainContent = document.querySelector('main')?.innerText || 'No main content found';

  const section = (title: string | string[], nextTitle?: string | string[]) => {
    const titles = Array.isArray(title) ? title : [title];
    const nextTitles = nextTitle ? (Array.isArray(nextTitle) ? nextTitle : [nextTitle]) : [];

    for (const tt of titles) {
      const tTitle = escapeRegExp(tt);
      if (nextTitles.length) {
        const tNext = nextTitles.map(escapeRegExp).join('|');
        const re = new RegExp(`${tTitle}\\\\s+([\\\\s\\\\S]*?)(?:${tNext}|$)`, 'i');
        const m = mainContent.match(re);
        if (m) return m[1].trim();
      } else {
        const re = new RegExp(`${tTitle}\\\\s+([\\\\s\\\\S]*?)$`, 'i');
        const m = mainContent.match(re);
        if (m) return m[1].trim();
      }
    }
    return '';
  };

  // Candidate keys (localized first, fallback to English)
  const modelKeys = [t('Model'), 'Model'];
  const policyKeys = [t('Policy'), 'Policy'];
  const requestKeys = [t('Request'), 'Request'];
  const enforcementKeys = [t('Enforcement Result'), 'Enforcement Result'];

  const rawModel = overrides?.model ?? (section(modelKeys, policyKeys) || section(modelKeys));
  const rawPolicy = overrides?.policy ?? (section(policyKeys, requestKeys) || section(policyKeys));
  const rawRequest = overrides?.request ?? (section(requestKeys, enforcementKeys) || section(requestKeys));
  const rawEnforcement = overrides?.enforcementResult ?? (section(enforcementKeys) || '');

  // Clean each block and remove UI noise lines
  const model = cleanContent(rawModel) || 'No model found';
  const policy = cleanContent(rawPolicy) || 'No policy found';
  const request = cleanContent(rawRequest) || 'No request found';
  const enforcementResult = cleanContent(rawEnforcement) || 'No enforcement result found';

  // Build extracted content with four main blocks
  const extractedContent = removeEmptyLines([
    `Model:\n ${model}`,
    `Policy:\n ${policy}`,
    `Request:\n ${request}`,
    `Enforcement Result:\n ${enforcementResult}`,
  ].join('\n'));

  // Generate the message based on the boxType (keep wording you requested)
  let message = `Please explain in ${lang} language.\n`;
  switch (boxType) {
    case 'model':
      message += `Briefly explain the Model content.\nno need to repeat the content of the question.\n${extractedContent}`;
      break;
    case 'policy':
      message += `Briefly explain the Policy content.\nno need to repeat the content of the question.\n${extractedContent}`;
      break;
    case 'request':
      message += `Briefly explain the Request content.\nno need to repeat the content of the question.\n${extractedContent}`;
      break;
    case 'enforcementResult':
      message += `Why this result? please provide a brief summary.\nno need to repeat the content of the question.\n${extractedContent}`;
      break;
    default:
      message += extractedContent;
  }

  return {
    extractedContent,
    message,
  };
};
