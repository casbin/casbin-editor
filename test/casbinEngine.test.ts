import { newEnforcer, newModel, StringAdapter } from 'casbin';
import { RemoteCasbinEngine } from '../app/components/editor/CasbinEngine';
import { example } from '../app/components/editor/casbin-mode/example';

interface EngineResult {
  engineType: string;
  allowed: boolean;
  reason?: string[];
  nodeResult: boolean;
}

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
          const requestParams = request.split(',').map((param) => {return param.trim()});
          const nodeResult = await nodeEnforcer.enforce(...requestParams);

          const engineResults: EngineResult[] = [];

          for (const [engineType, engine] of Object.entries(remoteEngines)) {
            try {
              const remoteResult = await engine.enforce({
                model: testCase.model,
                policy: testCase.policy || ' ',
                request: requestParams.join(','),
              });

              if (remoteResult.error) {
                throw new Error(`${engineType} engine error: ${remoteResult.error}`);
              }

              engineResults.push({
                engineType,
                allowed: remoteResult.allowed,
                reason: remoteResult.reason,
                nodeResult
              });

              expect(remoteResult.allowed).toBe(nodeResult);
            } catch (engineError: any) {
              const errorMessage = [
                `\n=== Error in [${testCase.name}] ([${engineType}]) ===`,
                `Error message: [${engineError.message}]`,
                `Request: [${requestParams.join(', ')}]`,
                `Model:\n${testCase.model}`,
                `Policy: [${testCase.policy || '<empty>'}]\n`,
                `=======================================\n`
              ].join('\n');

              console.error(errorMessage);
              throw engineError;
            }
          }

          const logMessage = [
            `\n=== Test Case: [${testCase.name}] ===`,
            `Request params: [${requestParams.join(', ')}]`,
            ...engineResults.map((result) =>
              {return `[${result.engineType.toUpperCase()}] Result:\n` +
              `  Allowed: [${result.allowed}]\n` +
              `  Reason: [${result.reason?.join(', ')}]\n` +
              `  Node Result: [${result.nodeResult}]`}
            ),
            `=======================================\n`
          ].join('\n');

          console.log(logMessage);
        }
      }, 10000);
    });
  });
});
