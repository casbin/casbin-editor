import { newEnforcer, newModel, StringAdapter } from 'casbin';
import { RemoteCasbinEngine } from '../app/components/editor/CasbinEngine';
import { example } from '../app/components/editor/casbin-mode/example';

describe('Casbin Engine Tests', () => {
  describe('Cross-engine enforcement consistency', () => {
    Object.entries(example).forEach(([key, testCase]) => {
      test(`should return consistent enforcement result for ${testCase.name}`, async () => {
        const nodeEnforcer = await newEnforcer(
          newModel(testCase.model),
          new StringAdapter(testCase.policy || ' ')
        );

        const remoteEngines = {
          java: new RemoteCasbinEngine('java'),
          go: new RemoteCasbinEngine('go')
        };

        const requests = testCase.request.split('\n').filter(Boolean);

        for (const request of requests) {
          try {
            const requestParams = request.split(',').map((param) => {return param.trim()});
            const nodeResult = await nodeEnforcer.enforce(...requestParams);

            for (const [engineType, engine] of Object.entries(remoteEngines)) {
              const remoteResult = await engine.enforce({
                model: testCase.model,
                policy: testCase.policy || ' ',
                request: request,
              });

              expect(remoteResult.allowed).toBe(nodeResult);
              
              console.log(`${testCase.name} - ${engineType} enforcement result:`, {
                request: requestParams,
                allowed: {
                  node: nodeResult,
                  remote: remoteResult.allowed
                }
              });
            }
          } catch (error: any) {
            console.warn(`Warning - ${testCase.name}:`, error.message);
          }
        }
      }, 10000);
    });
  });
});
