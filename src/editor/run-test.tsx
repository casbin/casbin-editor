import React from 'react';
import { Button, Echo } from '../ui';
import { newEnforcer, newModel, StringAdapter } from 'casbin';

interface RunTestProps {
  model: string;
  policy: string;
  fn: string;
  request: string;
  onResponse: (com: JSX.Element | boolean[]) => void;
}

const RunTest = (props: RunTestProps) => {
  return (
    <Button
      style={{ marginRight: 8 }}
      onClick={async () => {
        const startTime = performance.now();
        const result = [];
        try {
          const e = await newEnforcer(newModel(props.model), new StringAdapter(props.policy));

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

          for (const n of props.request.split('\n')) {
            const p = n
              .split(',')
              .map(n => n.trim())
              .filter(n => n);

            if (!p || p.length === 0) {
              return;
            }

            result.push(await e.enforce(...p));
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
