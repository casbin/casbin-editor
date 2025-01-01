import { newEnforcer, newModel, StringAdapter } from 'casbin';
import { RemoteCasbinEngine } from '../app/components/editor/CasbinEngine';
import { example } from '../app/components/editor/casbin-mode/example';

describe('Casbin Engine Tests', () => {
  describe('Cross-engine enforcement consistency', () => {
    Object.entries(example).forEach(([key, testCase]) => {
      test(`should return consistent enforcement result for ${testCase.name}`, async () => {
        const nodeEnforcer = await newEnforcer(newModel(testCase.model), new StringAdapter(testCase.policy || ' '));

        const remoteEngines = {
          java: new RemoteCasbinEngine('java'),
          go: new RemoteCasbinEngine('go'),
        };

        const requests = testCase.request.split('\n').filter(Boolean);

        for (const request of requests) {
          try {
            const requestParams = request.split(',').map((param) => {
              return param.trim();
            });
            const nodeResult = await nodeEnforcer.enforce(...requestParams);

            for (const [engineType, engine] of Object.entries(remoteEngines)) {
              try {
                const adjustedRequestParams = [...requestParams];
                if (engineType === 'go' && adjustedRequestParams.length < 3) {
                  adjustedRequestParams.push('');
                }

                const remoteResult = await engine.enforce({
                  model: testCase.model,
                  policy: testCase.policy || ' ',
                  request: adjustedRequestParams.join(','),
                });

                if (remoteResult.error) {
                  throw new Error(`${engineType} engine error: ${remoteResult.error}`);
                }

                console.log(`${testCase.name} - ${engineType} complete response:`, {
                  request: adjustedRequestParams,
                  response: remoteResult,
                  nodeResult: nodeResult,
                });

                expect(remoteResult.allowed).toBe(nodeResult);
              } catch (engineError: any) {
                console.error(`${testCase.name} - ${engineType} engine error:`, {
                  error: engineError.message,
                  request: requestParams,
                  model: testCase.model,
                  policy: testCase.policy,
                });
                throw engineError;
              }
            }
          } catch (error: any) {
            console.error(`Error in ${testCase.name}:`, {
              error: error.message,
              stack: error.stack,
              request: request,
              model: testCase.model,
              policy: testCase.policy,
            });
            throw error;
          }
        }
      }, 10000);
    });
  });
});
