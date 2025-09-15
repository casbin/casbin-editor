import { newEnforcer, newModel, StringAdapter } from 'casbin';
import { RemoteCasbinEngine } from '../app/components/editor/core/CasbinEngine';
import { example } from '../app/components/editor/casbin-mode/example';
import { EngineType, ENGINES } from '@/app/config/engineConfig';

interface EngineResult {
  engineType: EngineType;
  allowed: boolean;
  reason?: string[];
  nodeResult: boolean;
}

describe('Casbin Engine Tests', () => {
  describe('Cross-engine enforcement consistency', () => {
    // Get all remote engines
    const remoteEngines = Object.fromEntries(
      Object.entries(ENGINES)
        .filter(([_, config]) => config.isRemote)
        .map(([id]) => [id, new RemoteCasbinEngine(id as Exclude<EngineType, 'node'>)]),
    ) as Record<Exclude<EngineType, 'node'>, RemoteCasbinEngine>;

    // Test each engine for each test case
    Object.entries(example).forEach(([key, testCase]) => {
      Object.entries(remoteEngines).forEach(([engineType, engine]) => {
        test(`should return consistent enforcement result for ${testCase.name} with ${engineType} engine`, async () => {
          // Add delay for Python engine to avoid DLL conflicts
          if (engineType === 'python') {
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
          }
          
          const nodeEnforcer = await newEnforcer(newModel(testCase.model), new StringAdapter(testCase.policy || ' '));
          const requests = testCase.request.split('\n').filter(Boolean);

          for (const request of requests) {
            const requestParams = request.split(',').map((param) => {
              const trimmed = param.trim();
              if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
                try {
                  return JSON.parse(trimmed);
                } catch {
                  return trimmed;
                }
              }
              return trimmed;
            });

            const remoteRequest = requestParams
              .map((param) => {
                return typeof param === 'object' ? JSON.stringify(param) : param;
              })
              .join(',');

            const nodeResult = await nodeEnforcer.enforce(...requestParams);

            try {
              const remoteResult = await engine.enforce({
                model: testCase.model,
                policy: testCase.policy || '',
                request: remoteRequest,
              });

              if (remoteResult.error) {
                throw new Error(`${engineType} engine error: ${remoteResult.error}`);
              }

              const logMessage = [
                `\n=== Test Case: [${testCase.name}] (${engineType}) ===`,
                `Request params: [${requestParams.join(', ')}]`,
                `[${engineType.toUpperCase()}] Result:`,
                `  Allowed: [${remoteResult.allowed}]`,
                `  Reason: [${remoteResult.reason?.join(', ')}]`,
                `  Node Result: [${nodeResult}]`,
                `=======================================\n`,
              ].join('\n');

              console.log(logMessage);

              expect(remoteResult.allowed).toBe(nodeResult);
            } catch (engineError: any) {
              const errorMessage = [
                `\n=== Error in [${testCase.name}] ([${engineType}]) ===`,
                `Error message: [${engineError.message}]`,
                `Request: [${requestParams.join(', ')}]`,
                `Model:\n${testCase.model}`,
                `Policy: [${testCase.policy || '<empty>'}]\n`,
                `=======================================\n`,
              ].join('\n');

              console.error(errorMessage);
              throw engineError;
            }
          }
        }, engineType === 'python' ? 80000 : 40000); //  Python: 80s, Others: 40s
      });
    });
  });
});
