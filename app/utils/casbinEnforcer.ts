import { Enforcer, DefaultRoleManager, Util as CasbinUtil } from 'casbin';
import { newEnforceContext } from '@/app/components/hooks/useSetupEnforceContext';
import { parseABACRequest } from '@/app/utils/casbinRequestParser';

/**
 * Configure custom functions and RoleManager
 * @param enforcer Casbin's Enforcer instance
 * @param customConfig Custom configuration string, including function and matcher configurations.
 */

export async function setupCustomConfig(enforcer: Enforcer, customConfig: string): Promise<void> {
  try {
    // Define built-in functions.
    const builtinFunc = {
      keyMatch: CasbinUtil.keyMatchFunc,
      keyGet: CasbinUtil.keyGetFunc,
      keyMatch2: CasbinUtil.keyMatch2Func,
      keyGet2: CasbinUtil.keyGet2Func,
      keyMatch3: CasbinUtil.keyMatch3Func,
      keyMatch4: CasbinUtil.keyMatch4Func,
      regexMatch: CasbinUtil.regexMatchFunc,
      ipMatch: CasbinUtil.ipMatchFunc,
      globMatch: CasbinUtil.globMatch,
    };

    // Use eval to parse custom configuration (assuming the format is a JavaScript object).
    let config = eval(customConfig);
    if (config) {
      config = {
        ...config,
        functions: { ...config.functions, ...builtinFunc },
      };

      // Add custom functions to Enforcer
      if (config?.functions) {
        Object.keys(config.functions).forEach((key) => {
          enforcer.addFunction(key, config.functions[key]);
        });
      }

      // Get RoleManager instance
      const rm = enforcer.getRoleManager() as DefaultRoleManager;

      // Configure role matching function
      if (config.matchingForGFunction) {
        if (typeof config.matchingForGFunction === 'function') {
          await rm.addMatchingFunc(config.matchingForGFunction);
        } else if (typeof config.matchingForGFunction === 'string' && config.matchingForGFunction in config.functions) {
          await rm.addMatchingFunc(config.functions[config.matchingForGFunction]);
        }
      }

      // Configure domain matching function
      if (config.matchingDomainForGFunction) {
        if (typeof config.matchingDomainForGFunction === 'function') {
          await rm.addDomainMatchingFunc(config.matchingDomainForGFunction);
        } else if (typeof config.matchingDomainForGFunction === 'string' && config.matchingDomainForGFunction in config.functions) {
          await rm.addDomainMatchingFunc(config.functions[config.matchingDomainForGFunction]);
        }
      }
    }
  } catch (error) {
    // Throw an error with detailed information
    throw new Error(`Error in custom configuration: ${error as any}`);
  }
}

/**
 * Initialize RoleManager
 * If RoleManager is not set, initialize it
 * @param enforcer Casbin's Enforcer instance
 */
export function setupRoleManager(enforcer: Enforcer): void {
  if (!enforcer.getRoleManager()) {
    // Create default RoleManager, supporting 10 levels of role inheritance
    const roleManager = new DefaultRoleManager(10);
    enforcer.setRoleManager(roleManager);
  }
}

/**
 * @param request Request string, one request per line.
 * @param enforcer Casbin Enforcer instance
 * @param enforceContextData Context data
 * @returns Request result array
 */
export async function processRequests(
  request: string,
  enforcer: any,
  enforceContextData: Map<string, string> = new Map<string, string>(),
): Promise<{ request: string; okEx: boolean; reason: string[] }[]> {
  const requests = request.split('\n').filter((line) => {
    return line.trim();
  });

  const results = await Promise.all(
    requests.map(async (line) => {
      if (!line || line[0] === '#') {
        return { request: line, okEx: false, reason: ['ignored'] };
      }

      const rvals = parseABACRequest(line);
      const ctx = newEnforceContext(enforceContextData);
      const [okEx, reason] = await enforcer.enforceEx(ctx, ...rvals);
      return { request: line, okEx, reason };
    }),
  );

  return results;
}
