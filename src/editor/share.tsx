import { Button, Echo } from '../ui';
import React from 'react';

interface ShareProps extends ShareFormat {
  onResponse: (echo: JSX.Element) => void;
}

export interface ShareFormat {
  model: string;
  policy: string;
  customConfig: string;
  request: string;
}

async function dpaste(content: string) {
  const response = await fetch('https://dpaste.com/api/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `content=${encodeURIComponent(content)}&syntax=json&title=${encodeURIComponent('Casbin Shared Content')}&expiry_days=200`
  });
  return response.text();
}

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
    props.onResponse(<Echo>{`Shared at ${window.location.href}#${hash}`}</Echo>);
  });
}

const Share = (props: ShareProps) => {
  return (
    <Button style={{ marginRight: 8 }} onClick={() => shareInfo(props)}>
      SHARE
    </Button>
  );
};

export default Share;
