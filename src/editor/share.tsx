import { Button, Echo } from '../ui';
import React from 'react';

interface ShareProps extends ShareFormat {
  onResponse: (info: JSX.Element | string) => void;
}

export interface ShareFormat {
  model: string;
  policy: string;
  customConfig: string;
  request: string;
  // enableABAC: boolean;
}

async function dpaste(content: string) {
  const response = await fetch('https://dpaste.com/api/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `content=${encodeURIComponent(content)}&syntax=json&title=${encodeURIComponent('Casbin Shared Content')}&expiry_days=200`
  });
  return response.text();
}

const Share = (props: ShareProps) => {
  function shareInfo(props: ShareProps) {
    props.onResponse(<Echo>Sharing...</Echo>);
    const shareContent: ShareFormat = {
      model: props.model,
      policy: props.policy,
      customConfig: props.customConfig,
      request: props.request
    };
    dpaste(JSON.stringify(shareContent)).then((url: string) => {
      const hash = url.split('/')[3];
      props.onResponse(hash);
    });
  }

  return (
    <Button style={{ marginRight: 8 }} onClick={() => shareInfo(props)}>
      SHARE
    </Button>
  );
};

export default Share;
