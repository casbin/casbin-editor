const cleanContent = (content: string) => {
  return content
    .replace(/^\d+\s+/gm, '')
    .replace(/Ask AI/g, '')
    .replace(/AI Assistant/g, '')
    .trim();
};

export const extractPageContent = (boxType: string, t: (key: string) => string) => {
  const mainContent = document.querySelector('main')?.innerText || 'No main content found';

  const customConfigMatch = mainContent.match(new RegExp(`${t('Custom config')}\\s+([\\s\\S]*?)\\s+${t('Model')}`));
  const modelMatch = mainContent.match(new RegExp(`${t('Model')}\\s+([\\s\\S]*?)\\s+${t('Policy')}`));
  const policyMatch = mainContent.match(new RegExp(`${t('Policy')}\\s+([\\s\\S]*?)\\s+${t('Request')}`));
  const requestMatch = mainContent.match(new RegExp(`${t('Request')}\\s+([\\s\\S]*?)\\s+${t('Enforcement Result')}`));
  const enforcementResultMatch = mainContent.match(new RegExp(`${t('Enforcement Result')}\\s+([\\s\\S]*?)\\s+${t('SYNTAX VALIDATE')}`));

  const customConfig = customConfigMatch ? cleanContent(customConfigMatch[1]) : 'No custom config found';
  const model = modelMatch
    ? cleanContent(modelMatch[1].replace(new RegExp(`${t('Select your model')}[\\s\\S]*?${t('RESET')}`, 'i'), ''))
    : 'No model found';
  const policy = policyMatch ? cleanContent(policyMatch[1].replace(/Node-Casbin v[\d.]+/, '')) : 'No policy found';
  const request = requestMatch ? cleanContent(requestMatch[1]) : 'No request found';
  const enforcementResult = enforcementResultMatch
    ? cleanContent(enforcementResultMatch[1].replace(/Why this result\?[\s\S]*?AI Assistant/, ''))
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
    ${t('Custom config')}: ${cleanContent(customConfig)}
    ${t('Model')}: ${cleanContent(model)}
    ${t('Policy')}: ${cleanContent(policy)}
    ${t('Request')}: ${cleanContent(request)}
    ${t('Enforcement Result')}: ${cleanContent(enforcementResult)}
  `);

  let message = '';
  switch (boxType) {
    case 'model':
      message = `${t('explainModel')}${t('noRepeatContent')}\n${extractedContent}`;
      break;
    case 'policy':
      message = `${t('explainPolicy')}${t('noRepeatContent')}\n${extractedContent}`;
      break;
    case 'request':
      message = `${t('explainRequest')}${t('noRepeatContent')}\n${extractedContent}`;
      break;
    case 'enforcementResult':
      message = `${t('whyThisResult')}${t('provideBriefSummary')}${t('noRepeatContent')}\n${extractedContent}`;
      break;
    default:
      message = extractedContent;
  }

  return {
    extractedContent,
    message,
  };
};
