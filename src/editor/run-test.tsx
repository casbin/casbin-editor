import React from 'react';
import { Button, Echo } from '../ui';
import { DefaultRoleManager, newEnforcer, newModel, StringAdapter, Util } from 'casbin';

interface RunTestProps {
  model: string;
  modelKind: string;
  policy: string;
  customConfig: string;
  request: string;
  onResponse: (com: JSX.Element | any[]) => void;
  // parseABAC: boolean;
}

function parseABACRequest(line: string): any[] {
  let value = '';
  let objectToken = 0;
  let parseToObject = false;
  const request = [];

  for (let i = 0; i < line.length; i++) {
    if (objectToken === 0 && line[i] === ',') {
      if (parseToObject) {
        // eslint-disable-next-line
        value = eval(`(${value})`);
      }
      request.push(value.trim());

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
    request.push(value);
  }

  return request;
}

async function enforcer(props: RunTestProps) {
  const startTime = performance.now();
  const result = [];
  try {
    const e = await newEnforcer(newModel(props.model), props.policy ? new StringAdapter(props.policy) : undefined);

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
          globMatch: Util.globMatch
        };

        // eslint-disable-next-line
        let config = eval(customConfigCode);
        if (config) {
          config = { ...config, functions: { ...config.functions, ...builtinFunc } };
          if (config?.functions) {
            Object.keys(config.functions).forEach(key => e.addFunction(key, config.functions[key]));
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
                props.onResponse(<Echo type={'error'}>Must sure the {matchingForGFunction}() in config.functions</Echo>);
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
                props.onResponse(<Echo type={'error'}>Must sure the {matchingDomainForGFunction}() in config.functions</Echo>);
                return;
              }
            }
          }
        }
      } catch (e) {
        props.onResponse(<Echo type={'error'}>Please check syntax in Custom Function Editor: {e.message}</Echo>);
        return;
      }
    }

    const requests = props.request.split('\n');

    for (const n of requests) {
      const line = n.trim();
      if (!line) {
        result.push('// ignore');
        continue;
      }

      if (line[0] === '#') {
        result.push('// ignore');
        continue;
      }

      const rvals = parseABACRequest(n);
      result.push(await e.enforce(...rvals));
    }

    const stopTime = performance.now();

    props.onResponse(<Echo>{'Done in ' + (stopTime - startTime).toFixed(2) + 'ms'}</Echo>);
    props.onResponse(result);
  } catch (e) {
    props.onResponse(<Echo type={'error'}>{e.message}</Echo>);
    props.onResponse([]);
  }
}

const RunTest = (props: RunTestProps) => {
  return (
    <Button style={{ marginRight: 8 }} onClick={() => enforcer(props)}>
      RUN THE TEST
    </Button>
  );
};

export default RunTest;
