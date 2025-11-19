const cleanContent = (content: string) => {
  return content
    .replace(/^\d+\s+/gm, '')
    .replace(/Ask AI/g, '')
    .trim();
};

// Remove UI legend-like runs: consecutive short lines (3+ in a row)
const filterUiLegend = (text: string) => {
  const isSimpleLine = (l: string) => {
    if (!l) return false;
    if (/[[\]{}=<>:\"]/.test(l)) return false;
    const words = l.trim().split(/\s+/);
    return words.length <= 3 && words.every((w) => {
      return w.length <= 20;
    });
  };

  const lines = text.split('\n');
  const out: string[] = [];
  for (let i = 0; i < lines.length; ) {
    if (isSimpleLine(lines[i])) {
      let j = i + 1;
      while (j < lines.length && isSimpleLine(lines[j])) j++;
      if (j - i >= 3) {
        i = j; // skip the whole run
        continue;
      }
    }
    out.push(lines[i].trim());
    i += 1;
  }
  return out.filter(Boolean).join('\n').trim();
};

export const extractPageContent = (boxType: string, t: (key: string) => string, lang: string) => {
  const mainContent = document.querySelector('main')?.innerText || 'No main content found';

  const escapeRegex = (s: string) => {
    return s.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
  };

  // Match a titled section where the title appears on its own line, then
  // capture following lines until the next titled section (also on its own line).
  const sectionRe = (title: string, nextTitle?: string) => {
    const t1 = escapeRegex(title);
    if (nextTitle) {
      const t2 = escapeRegex(nextTitle);
      return new RegExp(`(?:\\n|^)${t1}(?:\\s*:)?\\s*\\n([\\s\\S]*?)(?=\\n${t2}(?:\\s*:)?\\s*\\n|$)`, 'i');
    }
    return new RegExp(`(?:\\n|^)${t1}(?:\\s*:)?\\s*\\n([\\s\\S]*?)$`, 'i');
  };

  const customConfigMatch = mainContent.match(sectionRe(t('Custom Functions'), t('Model')));
  const modelMatch = mainContent.match(sectionRe(t('Model'), t('Policy')));
  const policyMatch = mainContent.match(sectionRe(t('Policy'), t('Request')));
  const requestMatch = mainContent.match(sectionRe(t('Request'), t('Enforcement Result')));
  const enforcementResultMatch = mainContent.match(sectionRe(t('Enforcement Result'), t('RUN THE TEST')));

  const customConfig = customConfigMatch ? cleanContent(customConfigMatch[1]) : 'No Custom Functions found';
  const model = modelMatch
    ? cleanContent(modelMatch[1].replace(new RegExp(`${t('Select your model')}[\\s\\S]*?${t('RESET')}`, 'i'), ''))
    : 'No model found';
  const policy = policyMatch ? cleanContent(policyMatch[1].replace(/Node-Casbin v[\d.]+/, '')) : 'No policy found';
  const request = requestMatch ? cleanContent(requestMatch[1]) : 'No request found';
  const enforcementResult = enforcementResultMatch
    ? cleanContent(enforcementResultMatch[1].replace(new RegExp(`${t('Why this result')}[\\s\\S]*?AI Assistant`, 'i'), ''))
    : 'No enforcement result found';

  const removeEmptyLines = (content: string) => {
    return content
      .split('\n')
      .filter((line) => {
        return line.trim() !== '';
      })
      .join('\n');
  };
  const extractedContent = removeEmptyLines(`
    Custom Functions: ${cleanContent(customConfig)}
    Model: ${cleanContent(model)}
    Policy: ${cleanContent(policy)}
    Request: ${cleanContent(request)}
    Enforcement Result: ${cleanContent(enforcementResult)}
  `);

  // Filter out UI legend/noise before composing the final prompt
  const filteredExtractedContent = filterUiLegend(extractedContent);

  // Remove localized button labels (best-effort), e.g. t('Explain it') and t('RESET')
  const tokens = [t('Explain it'), t('RESET')].filter(Boolean);
  let cleanedContent = filteredExtractedContent;
  for (const token of tokens) {
    // Avoid using \b (word boundary) because it doesn't work for CJK (e.g. Chinese).
    // Use a simple global, case-insensitive replace for Latin scripts and plain
    const re = new RegExp(escapeRegex(token), 'gi');
    cleanedContent = cleanedContent.replace(re, '').replace(/\n{2,}/g, '\n');
  }
  console.log('Cleaned Content:', cleanedContent); 

  cleanedContent = cleanedContent.replace(/\n{2,}/g, '\n').trim();
  let message = `Please explain in ${lang} language.\n`;
  switch (boxType) {
    case 'model':
      message += `Briefly explain the Model content. \n      no need to repeat the content of the question.\n${cleanedContent}`;
      break;
    case 'policy':
      message += `Briefly explain the Policy content.\n      no need to repeat the content of the question.\n${cleanedContent}`;
      break;
    case 'request':
      message += `Briefly explain the Request content. \n      no need to repeat the content of the question.\n${cleanedContent}`;
      break;
    case 'enforcementResult':
      message += `Why this result? please provide a brief summary. \n      no need to repeat the content of the question.\n${cleanedContent}`;
      break;
    default:
      message += cleanedContent;
  }

  return {
    extractedContent: cleanedContent,
    message,
  };
};
