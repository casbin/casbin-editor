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

import { createCasbinEngine } from '../editor/core/CasbinEngine';
import { setError, parseError } from '@/app/utils/errorManager';

interface RunTestProps {
  model: string;
  modelKind: string;
  policy: string;
  customConfig: string;
  request: string;
  enforceContextData: Map<string, string>;
  selectedEngine: string;
  onResponse: (com: JSX.Element | any[]) => void;
}

async function enforcer(props: RunTestProps) {
  const startTime = performance.now();

  try {
    const engine = createCasbinEngine(props.selectedEngine as 'node' | 'java' | 'go');

    const requests = props.request.split('\n').filter((line) => {
      return line.trim();
    });

    const results = await Promise.all(
      requests.map(async (request) => {
        if (!request || request[0] === '#') {
          return { request, okEx: false, reason: ['ignored'] };
        }

        const result = await engine.enforce({
          model: props.model,
          policy: props.policy,
          request,
          customConfig: props.customConfig,
          enforceContextData: props.enforceContextData,
        });

        return {
          request,
          okEx: result.allowed,
          reason: result.reason,
        };
      }),
    );

    const stopTime = performance.now();
    props.onResponse(<div className="text-green-500">{'Done in ' + (stopTime - startTime).toFixed(2) + 'ms'}</div>);

    const hasError = results.some((r) => {
      return r.reason.some((reason) => {
        return reason.includes('Error');
      });
    });
    if (hasError) {
      const errors = results
        .filter((r) => {
          return r.reason.some((reason) => {
            return reason.includes('Error');
          });
        })
        .map((r) => {
          return `${r.request}: ${r.reason.join(', ')}`;
        });
      throw new Error(errors.join('\n'));
    }

    setError(null);
    props.onResponse(results);
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    props.onResponse(<div className="text-red-500">{errorMessage}</div>);
    props.onResponse([]);
    setError(parseError(errorMessage));
  }
}

export default function useRunTest() {
  return {
    enforcer,
  };
}
