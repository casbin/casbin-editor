const cleanContent = (content: string) => {
  return content
    .replace(/^\d+\s+/gm, '')
    .replace(/Ask AI/g, '')
    .trim();
};

export const extractPageContent = (boxType: string, t: (key: string) => string, lang: string) => {
  const mainContent = document.querySelector('main')?.innerText || 'No main content found';

  const customConfigMatch = mainContent.match(new RegExp(`${t('Custom Functions')}\\s+([\\s\\S]*?)\\s+${t('Model')}`));
  const modelMatch = mainContent.match(new RegExp(`${t('Model')}\\s+([\\s\\S]*?)\\s+${t('Policy')}`));
  const policyMatch = mainContent.match(new RegExp(`${t('Policy')}\\s+([\\s\\S]*?)\\s+${t('Request')}`));
  const requestMatch = mainContent.match(new RegExp(`${t('Request')}\\s+([\\s\\S]*?)\\s+${t('Enforcement Result')}`));
  const enforcementResultMatch = mainContent.match(new RegExp(`${t('Enforcement Result')}\\s+([\\s\\S]*?)\\s+${t('RUN THE TEST')}`));

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

  let message = `Please explain in ${lang} language.：\n`;
  switch (boxType) {
    case 'model':
      message += `Briefly explain the Model content. 
      no need to repeat the content of the question.\n${extractedContent}`;
      break;
    case 'policy':
      message += `Briefly explain the Policy content.
      no need to repeat the content of the question.\n${extractedContent}`;
      break;
    case 'request':
      message += `Briefly explain the Request content. 
      no need to repeat the content of the question.\n${extractedContent}`;
      break;
    case 'enforcementResult':
      message += `Why this result? please provide a brief summary. 
      no need to repeat the content of the question.\n${extractedContent}`;
      break;
    default:
      message += extractedContent;
  }

  return {
    extractedContent,
    message,
  };
};
