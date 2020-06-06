import React from 'react';
import { Button, Echo } from '../ui';
import { newEnforcer, newModel, StringAdapter } from 'casbin';

interface RunTestProps {
  model: string;
  modelKind: string;
  policy: string;
  fn: string;
  request: string;
  onResponse: (com: JSX.Element | any[]) => void;
}

const needsAbacParsing = new Set(['abac','abac_with_policy_rule']);

function parseABACRequest(line: string): any[] {
  let value = '';
  let objectToken = 0;
  let parseToObject = false;
  const request = [];

  for (let i = 0; i < line.length; i++) {
    if (line[i] === ' ') {
      continue;
    }

    if (objectToken === 0 && line[i] === ',') {
      if (parseToObject) {
        // eslint-disable-next-line
        eval(`value = ${value}`);
      }
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
      eval(`value = ${value}`);
    }
    request.push(value);
  }

  return request;
}

const RunTest = (props: RunTestProps) => {
  return (
    <Button
      style={{ marginRight: 8 }}
      onClick={async () => {
        const startTime = performance.now();
        const result = [];
        try {
          const e = await newEnforcer(newModel(props.model), props.policy ? new StringAdapter(props.policy) : undefined);

          const fnString = props.fn;
          if (fnString) {
            try {
              const fns: any = {};
              // eslint-disable-next-line
              eval(`${fnString}`);
              if (fns) {
                Object.keys(fns).forEach(key => e.addFunction(key, fns[key]));
              }
            } catch (e) {
              props.onResponse(<Echo>Please check syntax in Custom Function Editor.</Echo>);
              return;
            }
          }

          const requests = props.request.split('\n');

          for (const n of requests) {
            const line = n.trim();
            if (!line) {
              result.push('# ignore');
              continue;
            }

            if (line[0] === '#') {
              result.push('# ignore');
              continue;
            }

            const rvals = needsAbacParsing.has( props.modelKind) ? parseABACRequest(n) : n.split(',').map(n => n.trim());
            result.push(await e.enforce(...rvals));
          }

          const stopTime = performance.now();

          props.onResponse(<Echo>{'Done in ' + ((stopTime - startTime) / 1000.0).toFixed(2) + 's'}</Echo>);
          props.onResponse(result);
        } catch (e) {
          props.onResponse(<Echo type={'error'}>{e.message}</Echo>);
          props.onResponse([]);
        }
      }}
    >
      RUN THE TEST
    </Button>
  );
};

export default RunTest;
