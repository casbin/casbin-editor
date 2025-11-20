const cleanContent = (content: string) => {
  return content
    .replace(/^\d+\s+/gm, '')
    .replace(/Ask AI/g, '')
    .replace(/Explain it/g, '')
    .trim();
};

export const extractPageContent = (boxType: string, t: (key: string) => string, lang: string) => {
  const mainContent = document.querySelector('main')?.innerText || 'No main content found';

  const customConfigMatch = mainContent.match(new RegExp(`${t('Custom Functions')}\\s+([\\s\\S]*?)\\s+${t('Role Inheritance Graph')}`));
  const modelMatch = mainContent.match(new RegExp(`(?:^|\\n)${t('Model')}(?:\\s*\\n)([\\s\\S]*?)(?=\\n${t('Policy')}|$)`));
  const policyMatch = mainContent.match(new RegExp(`(?:^|\\n)${t('Policy')}(?:\\s*\\n)([\\s\\S]*?)(?=\\n${t('Request')}|$)`));
  const requestMatch = mainContent.match(new RegExp(`${t('Request')}\\s+([\\s\\S]*?)\\s+${t('Enforcement Result')}`));
  const enforcementResultMatch = mainContent.match(new RegExp(`${t('Enforcement Result')}\\s+([\\s\\S]*?)\\s+${t('RUN THE TEST')}`));

  const customConfig = customConfigMatch ? cleanContent(customConfigMatch[1]) : 'No Custom Functions found';
  const model = modelMatch
    ? cleanContent(
        // 1) remove any "Select your model" .. "RESET" block (localized),
        // 2) remove a single leading non-section line (e.g. the model name like "ACL"),
        //    but keep lines that start with '[' (section headers) so we don't strip actual config lines.
        // 3) remove any standalone localized RESET lines that may remain.
        modelMatch[1]
          .replace(new RegExp(`${t('Select your model')}[\\s\\S]*?${t('RESET')}`, 'i'), '')
          .replace(/^\s*(?!\[)([^\r\n]+)\r?\n?/, '')
          .replace(new RegExp(`^\\s*${t('RESET')}\\s*$`, 'gim'), '')
      )
    : 'No model found';
  const policy = policyMatch
    ? cleanContent(
        // remove any implementation/version lines that mention casbin (covers Node-Casbin, jCasbin, etc.)
        policyMatch[1].replace(/.*casbin.*$/gim, '')
      )
    : 'No policy found';
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
    Custom Functions:\n${cleanContent(customConfig)}
    Model:\n${cleanContent(model)}
    Policy:\n${cleanContent(policy)}
    Request:\n${cleanContent(request)}
    Enforcement Result:\n${cleanContent(enforcementResult)}
  `);

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
