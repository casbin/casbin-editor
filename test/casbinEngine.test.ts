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
    Object.entries(example).forEach(([key, testCase]) => {
      test(`should return consistent enforcement result for ${testCase.name}`, async () => {
        const nodeEnforcer = await newEnforcer(newModel(testCase.model), new StringAdapter(testCase.policy || ' '));

        const remoteEngines = Object.fromEntries(
          Object.entries(ENGINES)
            .filter(([_, config]) => config.isRemote)
            .map(([id]) => [id, new RemoteCasbinEngine(id as Exclude<EngineType, 'node'>)]),
        ) as Record<Exclude<EngineType, 'node'>, RemoteCasbinEngine>;

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

          const engineResults: EngineResult[] = [];

          // Set timeout for each engine individually
          const enginePromises = Object.entries(remoteEngines).map(async ([engineType, engine]) => {
            try {
              // 15 second timeout for each engine
              const remoteResult = await Promise.race([
                engine.enforce({
                  model: testCase.model,
                  policy: testCase.policy || '',
                  request: remoteRequest,
                }),
                new Promise<never>((_, reject) => 
                  setTimeout(() => reject(new Error(`${engineType} engine timeout after 15s`)), 15000)
                )
              ]);

              if (remoteResult.error) {
                throw new Error(`${engineType} engine error: ${remoteResult.error}`);
              }

              return {
                engineType: engineType as EngineType,
                allowed: remoteResult.allowed,
                reason: remoteResult.reason,
                nodeResult,
              };
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
              throw engineError; // Re-throw to maintain original behavior
            }
          });

          // Wait for all engines to complete
          const results = await Promise.allSettled(enginePromises);
          
          // Process results
          for (const result of results) {
            if (result.status === 'fulfilled') {
              engineResults.push({
                engineType: result.value.engineType,
                allowed: result.value.allowed,
                reason: result.value.reason,
                nodeResult: result.value.nodeResult,
              });
              expect(result.value.allowed).toBe(result.value.nodeResult);
            } else {
              throw result.reason; // Re-throw the original error
            }
          }

          const logMessage = [
            `\n=== Test Case: [${testCase.name}] ===`,
            `Request params: [${requestParams.join(', ')}]`,
            ...engineResults.map((result) => {
              return (
                `[${result.engineType.toUpperCase()}] Result:\n` +
                `  Allowed: [${result.allowed}]\n` +
                `  Reason: [${result.reason?.join(', ')}]\n` +
                `  Node Result: [${result.nodeResult}]`
              );
            }),
            `=======================================\n`,
          ].join('\n');

          console.log(logMessage);
        }
      }, 60000);
    });
  });
});
