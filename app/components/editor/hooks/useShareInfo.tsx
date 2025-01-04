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

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useLang } from '@/app/context/LangContext';

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
  enforceContext?: string;
  selectedEngine?: string;
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
  const { t } = useLang();

  function shareInfo(props: ShareProps) {
    if (sharing) return;
    setSharing(true);

    const loadingToast = toast.loading(t('Sharing'));

    const shareContent: ShareFormat = {
      ...Object.entries(props).reduce((acc, [key, value]) => {
        if (key !== 'onResponse' && value != null && value !== '') {
          acc[key as keyof ShareFormat] = value;
        }
        return acc;
      }, {} as ShareFormat),
      modelKind: props.modelKind,
      selectedEngine: props.selectedEngine,
    };

    if (Object.keys(shareContent).length === 0) {
      setSharing(false);
      toast.error(t('No content to share'));
      toast.dismiss(loadingToast);
      return;
    }

    dpaste(JSON.stringify(shareContent))
      .then((url: string) => {
        setSharing(false);
        const hash = url.split('/')[3];
        const shareUrl = `${window.location.origin}${window.location.pathname}#${hash}`;

        navigator.clipboard
          .writeText(shareUrl)
          .then(() => {
            toast.success(t('Link copied to clipboard'), {
              duration: 3000,
            });
          })
          .catch(() => {
            toast.error(t('Failed to copy link, please copy manually'));
          });

        props.onResponse(hash);
      })
      .catch((error) => {
        setSharing(false);
        toast.error(`${t('Share failed')}: ${error.message}`);
      })
      .finally(() => {
        toast.dismiss(loadingToast);
      });
  }

  return {
    shareInfo,
  };
}
