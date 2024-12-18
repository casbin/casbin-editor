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

import React from 'react';
import { DefaultRoleManager, newEnforcer, newModel, StringAdapter, Util } from 'casbin';
import { newEnforceContext } from '@/app/components/editor/hooks/useSetupEnforceContext';
import { setError } from '@/app/utils/errorManager';
import { remoteEnforcer } from './useRemoteEnforcer';

function parseABACRequest(line: string): any[] {
  let value: string | Record<string, any> = '';
  let objectToken = 0;
  let parseToObject = false;
  const request = [];

  for (let i = 0; i < line.length; i++) {
    if (objectToken === 0 && line[i] === ',') {
      if (parseToObject) {
        // eslint-disable-next-line
        value = eval(`(${value})`);
      }
      if (typeof value === 'string') {
        value = value.trim();
      }
      // @ts-ignore
      request.push(value);

      value = '';
      parseToObject = false;
      continue;
    }

    value += line[i];

    if (line[i] === '{') {
      parseToObject = true;
      objectToken++;
      continue;
    }

    if (line[i] === '}') {
      objectToken--;
    }
  }

  if (objectToken !== 0) {
    throw new Error(`invalid request ${line}`);
  }

  if (value) {
    if (parseToObject) {
      // eslint-disable-next-line
      value = eval(`(${value})`);
    }
    if (typeof value === 'string') {
      value = value.trim();
    }
    // @ts-ignore
    request.push(value);
  }

  return request;
}

async function enforcer(props: {
  request: string;
  onResponse: (v: (JSX.Element | any[])) => void;
  enforceContextData: Map<string, string>;
  customConfig: string;
  selectedEngine: string;
  model: string;
  modelKind: string;
  policy: string
}) {
  const startTime = performance.now();

  try {
    if (props.selectedEngine === 'java' || props.selectedEngine === 'go') {
      const requests = props.request.split('\n').filter((line) => {return line.trim()});
      const results = await Promise.all(requests.map(async (request) => {
        const result = await remoteEnforcer({
          model: props.model,
          policy: props.policy,
          request: request,
          engine: props.selectedEngine as 'java' | 'go'
        });
        return { request, ...result };
      }));

      const stopTime = performance.now();
      props.onResponse(<div className="text-green-500">{'Done in ' + (stopTime - startTime).toFixed(2) + 'ms'}</div>);

      const hasError = results.some((r) => {return r.error});
      if (hasError) {
        const errors = results.filter((r) => {return r.error}).map((r) => {return r.error});
        throw new Error(errors.join('\n'));
      }

      props.onResponse(results.map((result) => {return {
        request: result.request,
        okEx: result.allowed,
        reason: result.reason
      }}));
      return;
    }

    const result: { request: string; okEx: boolean; reason: string[]; }[] = [];
    const e = await newEnforcer(newModel(props.model), props.policy ? new StringAdapter(props.policy) : undefined);

    if (!e.getRoleManager()) {
      // Create a new RoleManager instance, 10 is the maximum role level
      const roleManager = new DefaultRoleManager(10);
      e.setRoleManager(roleManager);
    }

    const customConfigCode = props.customConfig;
    if (customConfigCode) {
      try {
        const builtinFunc = {
          keyMatch: Util.keyMatchFunc,
          keyGet: Util.keyGetFunc,
          keyMatch2: Util.keyMatch2Func,
          keyGet2: Util.keyGet2Func,
          keyMatch3: Util.keyMatch3Func,
          keyMatch4: Util.keyMatch4Func,
          regexMatch: Util.regexMatchFunc,
          ipMatch: Util.ipMatchFunc,
          globMatch: Util.globMatch,
        };

        // eslint-disable-next-line
        let config = eval(customConfigCode);
        if (config) {
          config = {
            ...config,
            functions: { ...config.functions, ...builtinFunc },
          };
          if (config?.functions) {
            Object.keys(config.functions).forEach((key) => {
              return e.addFunction(key, config.functions[key]);
            });
          }

          const rm = e.getRoleManager() as DefaultRoleManager;
          const matchingForGFunction = config.matchingForGFunction;
          if (matchingForGFunction) {
            if (typeof matchingForGFunction === 'function') {
              await rm.addMatchingFunc(matchingForGFunction);
            }
            if (typeof matchingForGFunction === 'string') {
              if (matchingForGFunction in config.functions) {
                await rm.addMatchingFunc(config.functions[matchingForGFunction]);
              } else {
                props.onResponse(<div>Must sure the {matchingForGFunction}() in config.functions</div>);
                return;
              }
            }
          }

          const matchingDomainForGFunction = config.matchingDomainForGFunction;
          if (matchingDomainForGFunction) {
            if (typeof matchingDomainForGFunction === 'function') {
              await rm.addDomainMatchingFunc(matchingDomainForGFunction);
            }
            if (typeof matchingDomainForGFunction === 'string') {
              if (matchingDomainForGFunction in config.functions) {
                await rm.addDomainMatchingFunc(config.functions[matchingDomainForGFunction]);
              } else {
                props.onResponse(<div>Must sure the {matchingDomainForGFunction}() in config.functions</div>);
                return;
              }
            }
          }
        }
      } catch (e) {
        props.onResponse(<div>Please check syntax in Custom Function Editor: {(e as any).message}</div>);
        return;
      }
    }

    const requests = props.request.split('\n');

    for (const n of requests) {
      const line = n.trim();
      if (!line) {
        // @ts-ignore
        result.push('// ignore');
        continue;
      }

      if (line[0] === '#') {
        // @ts-ignore
        result.push('// ignore');
        continue;
      }

      const rvals = parseABACRequest(n);
      const ctx = newEnforceContext(props.enforceContextData);

      const [okEx, reason] = await e.enforceEx(ctx, ...rvals);
      result.push({ request: n, okEx, reason });
    }

    const stopTime = performance.now();

    setError(null);

    props.onResponse(<div className="text-green-500">{'Done in ' + (stopTime - startTime).toFixed(2) + 'ms'}</div>);
    props.onResponse(result);
  } catch (e) {
    const errorMessage = (e as any).message;
    props.onResponse(<div className="text-red-500">{errorMessage}</div>);
    props.onResponse([]);
    setError(errorMessage);
  }
}

export default function useRunTest() {
  return {
    enforcer,
  };
}
