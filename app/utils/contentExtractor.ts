const cleanContent = (content: string) => {
  return content.replace(/^\d+\s+/gm, '').trim();
};

export const extractPageContent = (boxType: string) => {
  const mainContent = document.querySelector('main')?.innerText || 'No main content found';

  const customConfigMatch = mainContent.match(/Custom config\s+([\s\S]*?)\s+Model/);
  const modelMatch = mainContent.match(/Model\s+([\s\S]*?)\s+Policy/);
  const policyMatch = mainContent.match(/Policy\s+([\s\S]*?)\s+Request/);
  const requestMatch = mainContent.match(/Request\s+([\s\S]*?)\s+Enforcement Result/);
  const enforcementResultMatch = mainContent.match(/Enforcement Result\s+([\s\S]*?)\s+SYNTAX VALIDATE/);

  const customConfig = customConfigMatch ? cleanContent(customConfigMatch[1]) : 'No custom config found';
  const model = modelMatch ? cleanContent(modelMatch[1].replace(/Select your model[\s\S]*?RESET/, '')) : 'No model found';
  const policy = policyMatch ? cleanContent(policyMatch[1].replace(/Node-Casbin v[\d.]+/, '')) : 'No policy found';
  const request = requestMatch ? cleanContent(requestMatch[1]) : 'No request found';
  const enforcementResult = enforcementResultMatch
    ? cleanContent(enforcementResultMatch[1].replace(/Why this result\?[\s\S]*?AI Assistant/, ''))
    : 'No enforcement result found';

  const extractedContent = `
    Custom Config: ${customConfig}
    Model: ${model}
    Policy: ${policy}
    Request: ${request}
    Enforcement Result: ${enforcementResult}
  `;

  let message = '';
  switch (boxType) {
    case 'model':
      message = `Briefly explain the Model content. 
      no need to repeat the content of the question.\n${extractedContent}`;
      break;
    case 'policy':
      message = `Briefly explain the Policy content.
      no need to repeat the content of the question.\n${extractedContent}`;
      break;
    case 'request':
      message = `Briefly explain the Request content. 
      no need to repeat the content of the question.\n${extractedContent}`;
      break;
    case 'enforcementResult':
      message = `Why this result? please provide a brief summary. 
      no need to repeat the content of the question.\n${extractedContent}`;
      break;
    default:
      message = extractedContent;
  }

  return {
    extractedContent,
    message,
  };
};
