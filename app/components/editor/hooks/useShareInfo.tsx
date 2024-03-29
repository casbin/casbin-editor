// Copyright 2024 The casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React, { useState } from 'react';

interface ShareProps extends ShareFormat {
  onResponse: (info: JSX.Element | string) => void;
}

export interface ShareFormat {
  model: string;
  policy: string;
  customConfig: string;
  request: string;
  enforceContext: object;
}

async function dpaste(content: string) {
  const response = await fetch('https://dpaste.com/api/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `content=${encodeURIComponent(content)}&syntax=json&title=${encodeURIComponent('Casbin Shared Content')}&expiry_days=200`,
  });
  return response.text();
}

export default function useShareInfo() {
  const [sharing, setSharing] = useState(false);

  function shareInfo(props: ShareProps) {
    if (sharing) return;
    setSharing(true);
    props.onResponse(<div>Sharing...</div>);
    const shareContent: ShareFormat = {
      model: props.model,
      policy: props.policy,
      customConfig: props.customConfig,
      request: props.request,
      enforceContext: props.enforceContext,
    };
    dpaste(JSON.stringify(shareContent)).then((url: string) => {
      setSharing(false);
      const hash = url.split('/')[3];
      props.onResponse(hash);
    });
  }

  return {
    shareInfo,
  };
}
