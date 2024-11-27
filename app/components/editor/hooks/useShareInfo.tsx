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
  modelKind?: string;
  model?: string;
  policy?: string;
  customConfig?: string;
  request?: string;
  requestResult?: object;
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
    props.onResponse(<div className="text-orange-500">Sharing...</div>);

    // Create an object that contains only non-null values
    const shareContent: ShareFormat = {
      ...Object.entries(props).reduce((acc, [key, value]) => {
        if (key !== 'onResponse' && value != null && value !== '') {
          acc[key as keyof ShareFormat] = value;
        }
        return acc;
      }, {} as ShareFormat),
      modelKind: props.modelKind,
    };

    // Check if there are any non-null values to share
    if (Object.keys(shareContent).length === 0) {
      setSharing(false);
      props.onResponse(<div className="text-red-500">No content to share</div>);
      return;
    }

    dpaste(JSON.stringify(shareContent))
      .then((url: string) => {
        setSharing(false);
        const hash = url.split('/')[3];
        props.onResponse(hash);
      })
      .catch((error) => {
        setSharing(false);
        props.onResponse(<div className="text-red-500">Error sharing content: {error.message}</div>);
      });
  }

  return {
    shareInfo,
  };
}
