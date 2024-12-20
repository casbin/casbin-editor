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

interface RemoteEnforcerProps {
  model: string;
  policy: string;
  request: string;
  engine: 'java' | 'go';
}

export async function remoteEnforcer(props: RemoteEnforcerProps) {
  try {
    const baseUrl = 'https://door.casdoor.com/api/run-casbin-command';
    const args = [
      'enforce',
      '-m',
      props.model,
      '-p',
      props.policy,
      ...props.request.split(',').map((item) => {
        return item.trim();
      }),
    ];

    const url = new URL(baseUrl);
    url.searchParams.set('language', props.engine);
    url.searchParams.set('args', JSON.stringify(args));

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.status !== 'ok') {
      throw new Error(result.msg || 'API request failed');
    }

    let enforceResult;
    const data = result.data.trim();

    try {
      enforceResult = JSON.parse(data);
    } catch {
      if (data.toLowerCase() === 'allowed') {
        enforceResult = {
          allow: true,
          explain: 'Allowed by policy',
        };
      } else if (data.toLowerCase() === 'denied') {
        enforceResult = {
          allow: false,
          explain: 'Denied by policy',
        };
      } else {
        throw new Error(`Unexpected response format: ${data}`);
      }
    }

    return {
      allowed: enforceResult.allow,
      reason: enforceResult.explain ? [enforceResult.explain] : [],
      error: null,
    };
  } catch (error) {
    return {
      allowed: false,
      reason: ['Error occurred during enforcement'],
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
