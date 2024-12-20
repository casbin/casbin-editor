import { newEnforcer, newModel, StringAdapter } from 'casbin';
import { remoteEnforcer } from './hooks/useRemoteEnforcer';
import { setupRoleManager, setupCustomConfig, processRequests } from '@/app/utils/casbinEnforcer';

interface EnforceResult {
  allowed: boolean;
  reason: string[];
  error: string | null;
}

export interface ICasbinEngine {
  enforce(params: {
    model: string;
    policy: string;
    request: string;
    customConfig?: string;
    enforceContextData?: Map<string, string>;
  }): Promise<EnforceResult>;

  getVersion(): string;
  getType(): 'node' | 'java' | 'go';
}

// Node.js
export class NodeCasbinEngine implements ICasbinEngine {
  async enforce(params) {
    try {
      const e = await newEnforcer(
        newModel(params.model),
        params.policy ? new StringAdapter(params.policy) : undefined
      );

      setupRoleManager(e);

      if (params.customConfig) {
        await setupCustomConfig(e, params.customConfig);
      }

      const results = await processRequests(params.request, e, params.enforceContextData);

      return {
        allowed: results[0].okEx,
        reason: results[0].reason,
        error: null,
      };
    } catch (error) {
      throw error;
    }
  }

  getVersion(): string {
    return process.env.CASBIN_VERSION || '';
  }

  getType(): 'node' {
    return 'node';
  }
}

// RemoteCasbinEngine
export class RemoteCasbinEngine implements ICasbinEngine {
  constructor(private engine: 'java' | 'go') {}

  async enforce(params) {
    try {
      const result = await remoteEnforcer({
        model: params.model,
        policy: params.policy,
        request: params.request,
        engine: this.engine,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      return {
        allowed: result.allowed,
        reason: result.reason,
        error: null,
      };
    } catch (error) {
      throw error;
    }
  }

  getVersion(): string {
    return '';
  }

  getType(): 'java' | 'go' {
    return this.engine;
  }
}

export function createCasbinEngine(type: 'node' | 'java' | 'go'): ICasbinEngine {
  switch (type) {
    case 'node':
      return new NodeCasbinEngine();
    case 'java':
    case 'go':
      return new RemoteCasbinEngine(type);
    default:
      throw new Error(`Unsupported engine type: ${type}`);
  }
}
