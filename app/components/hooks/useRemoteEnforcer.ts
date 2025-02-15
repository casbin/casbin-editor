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

import type { EngineType } from '@/app/config/engineConfig';

interface RemoteEnforcerProps {
  model: string;
  policy: string;
  request: string;
  engine: Exclude<EngineType, 'node'>;
}

export interface VersionInfo {
  engineVersion: string;
  libVersion: string;
}

export const DEFAULT_ENDPOINT = 'door.casdoor.com';

export const getEndpoint = () => {
  try {
    return window?.localStorage?.getItem('casbinEndpoint') || DEFAULT_ENDPOINT;
  } catch {
    return DEFAULT_ENDPOINT;
  }
};

async function generateIdentifierParam(params: Record<string, string> = {}): Promise<{ hash: string; timestamp: string }> {
  const timestamp = new Date().toISOString();
  const version = 'casbin-editor-v1';

  let rawString = `${version}|${timestamp}`;

  if (Object.keys(params).length > 0) {
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => {
        return `${key}=${params[key]}`;
      })
      .join('&');
    rawString = `${rawString}|${sortedParams}`;
  }

  const msgBuffer = new TextEncoder().encode(rawString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hash = Array.from(new Uint8Array(hashBuffer))
    .map((b) => {
      return b.toString(16).padStart(2, '0');
    })
    .join('');

  return {
    hash,
    timestamp,
  };
}

export async function remoteEnforcer(props: RemoteEnforcerProps) {
  try {
    const baseUrl = `https://${getEndpoint()}/api/run-casbin-command`;
    const args = [
      'enforceEx',
      '-m',
      props.model,
      '-p',
      props.policy,
      ...props.request.split(',').map((item) => {
        return item.trim();
      }),
    ];

    const params = {
      language: props.engine,
      args: JSON.stringify(args),
    };

    const url = new URL(baseUrl);
    const { hash, timestamp } = await generateIdentifierParam(params);
    url.searchParams.set('language', params.language);
    url.searchParams.set('args', params.args);
    url.searchParams.set('m', hash);
    url.searchParams.set('t', timestamp);

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
      throw new Error(`Unexpected response format: ${data}`);
    }

    return {
      allowed: enforceResult.allow,
      reason: enforceResult.explain ? enforceResult.explain : [],
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

export async function getRemoteVersion(language: Exclude<EngineType, 'node'>): Promise<VersionInfo> {
  try {
    const baseUrl = `https://${getEndpoint()}/api/run-casbin-command`;

    const params = {
      language,
      args: JSON.stringify(['--version']),
    };

    const url = new URL(baseUrl);
    const { hash, timestamp } = await generateIdentifierParam(params);
    url.searchParams.set('language', params.language);
    url.searchParams.set('args', params.args);
    url.searchParams.set('m', hash);
    url.searchParams.set('t', timestamp);

    const response = await fetch(url.toString());
    const result = await response.json();
    const versionInfo = result.data as string;
    const [cliLine, libLine] = versionInfo.trim().split('\n');

    const getVersionNumber = (line: string) => {
      const match = line.match(/(?:v|[\s])([\d.]+)/);
      return match ? `v${match[1]}` : 'unknown';
    };

    return {
      engineVersion: getVersionNumber(cliLine),
      libVersion: getVersionNumber(libLine),
    };
  } catch (error) {
    console.error(`Error getting ${language} version:`, error);
    return {
      engineVersion: 'unknown',
      libVersion: 'unknown',
    };
  }
}

export async function refreshEngines(): Promise<void> {
  try {
    const baseUrl = `https://${getEndpoint()}/api/refresh-engines`;
    const url = new URL(baseUrl);

    const { hash, timestamp } = await generateIdentifierParam();

    url.searchParams.set('m', hash);
    url.searchParams.set('t', timestamp);

    const response = await fetch(url.toString(), {
      method: 'POST',
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

    return result.data;
  } catch (error) {
    console.error('Error refreshing engines:', error);
    throw error;
  }
}
