import React, { useState, useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { RoleInheritanceGraph } from '../role-inheritance-graph/RoleInheritanceGraph';
import { CustomFunctionTitle, CustomFunctionList, CustomFunctionButtons } from '../custom-functions';
import { FunctionConfig } from '../custom-functions/types';

interface CustomConfigPanelProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  showCustomConfig: boolean;
  customConfig: string;
  setCustomConfigPersistent: (value: string) => void;
  textClass: string;
  t: (key: string) => string;
  policy: string;  
  modelKind: string;
}

export const CustomConfigPanel: React.FC<CustomConfigPanelProps> = ({
  open,
  setOpen,
  showCustomConfig,
  customConfig,
  setCustomConfigPersistent,
  textClass,
  t,
  policy,  
  modelKind, 
}) => {
  const [functions, setFunctions] = useState<FunctionConfig[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const previousConfig = useRef(customConfig);

  const parseConfig = (configStr: string) => {
    try {
      const config = eval(configStr) as {
        functions?: Record<string, Function | string>;
        matchingForGFunction?: Function | string;
        matchingDomainForGFunction?: Function | string;
      };

      const newFunctions: FunctionConfig[] = [];

      if (config?.functions) {
        Object.entries(config.functions).forEach(([name, body]) => {
          newFunctions.push({
            id: `${Date.now()}-${Math.random()}`,
            name,
            body: body.toString(),
          });
        });
      }

      ['matchingForGFunction', 'matchingDomainForGFunction'].forEach((fnName) => {
        if (config?.[fnName as keyof typeof config]) {
          newFunctions.push({
            id: `${Date.now()}-${Math.random()}`,
            name: fnName,
            body: config[fnName as keyof typeof config]!.toString(),
          });
        }
      });

      return newFunctions;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    if (!isEditing && customConfig !== previousConfig.current) {
      const parsedFunctions = parseConfig(customConfig);
      if (parsedFunctions) {
        setFunctions(parsedFunctions);
        previousConfig.current = customConfig;
      }
    }
  }, [customConfig, isEditing]);

  // Add new function
  const addNewFunction = () => {
    const regularFunctionCount = functions.filter((f) => {
      return !['matchingForGFunction', 'matchingDomainForGFunction'].includes(f.name);
    }).length;

    const newFunction = {
      id: Date.now().toString(),
      name: `my_func${regularFunctionCount + 1}`,
      body: '(arg1, arg2) => {\n  return arg1.endsWith(arg2);\n}',
    };
    setFunctions([...functions, newFunction]);
    updateCustomConfig([...functions, newFunction]);
  };

  // Delete function
  const deleteFunction = (id: string) => {
    const updatedFunctions = functions.filter((f) => {
      return f.id !== id;
    });
    setFunctions(updatedFunctions);
    updateCustomConfig(updatedFunctions);
  };

  // Update function content
  const updateFunction = (id: string, field: keyof FunctionConfig, value: string) => {
    const updatedFunctions = functions.map((f) => {
      if (f.id === id) {
        return { ...f, [field]: value };
      }
      return f;
    });
    setFunctions(updatedFunctions);
    updateCustomConfig(updatedFunctions);
  };

  // Add new matching function
  const addMatchingFunction = () => {
    if (
      functions.some((f) => {
        return f.name === 'matchingForGFunction';
      })
    ) {
      return;
    }

    const template = {
      id: Date.now().toString(),
      name: 'matchingForGFunction',
      body: `(user, role) => {
  return user.department === role.department;
}`,
    };
    setFunctions([...functions, template]);
    updateCustomConfig([...functions, template]);
  };

  // Add new matching domain function
  const addMatchingDomainFunction = () => {
    if (
      functions.some((f) => {
        return f.name === 'matchingDomainForGFunction';
      })
    ) {
      return;
    }

    const template = {
      id: Date.now().toString(),
      name: 'matchingDomainForGFunction',
      body: `(domain1, domain2) => {
  return domain1.startsWith(domain2);
}`,
    };
    setFunctions([...functions, template]);
    updateCustomConfig([...functions, template]);
  };

  // Generate a complete configuration string.
  const updateCustomConfig = (updatedFunctions: FunctionConfig[]) => {
    setIsEditing(true);

    const regularFunctions = updatedFunctions.filter((f) => {
      return !['matchingForGFunction', 'matchingDomainForGFunction'].includes(f.name);
    });

    const specialFunctions = {
      matchingForGFunction:
        updatedFunctions.find((f) => {
          return f.name === 'matchingForGFunction';
        })?.body || 'undefined',
      matchingDomainForGFunction:
        updatedFunctions.find((f) => {
          return f.name === 'matchingDomainForGFunction';
        })?.body || 'undefined',
    };

    const functionsString = regularFunctions
      .map((f) => {
        return `${f.name}: ${f.body}`;
      })
      .join(',\n        ');

    const configString = `(function() {
      return {
        functions: {
          ${functionsString}
        },
        matchingForGFunction: ${specialFunctions.matchingForGFunction},
        matchingDomainForGFunction: ${specialFunctions.matchingDomainForGFunction}
      };
    })();`;

    setCustomConfigPersistent(configString);
    previousConfig.current = configString;

    setTimeout(() => {
      return setIsEditing(false);
    }, 0);
  };

  const hasMatchingFunction = (name: string) => {
    return functions.some((f) => {
      return f.name === name;
    });
  };

  return (
    <>
      <button
        className={clsx(
          'absolute top-.5 right-0 translate-x-1/2',
          'h-8 w-8',
          'bg-white',
          'border border-border rounded-full',
          'items-center justify-center',
          'hidden sm:flex',
          'shadow-md hover:shadow-lg',
          'transition-all duration-200',
          'hover:bg-secondary',
        )}
        onClick={() => {
          return setOpen(!open);
        }}
      >
        <svg
          className={clsx('h-5 w-5 text-primary')}
          style={{
            transform: open ? 'rotateZ(0deg)' : 'rotateZ(180deg)',
            transition: 'transform 0.2s',
          }}
          viewBox="0 0 24 24"
        >
          <path fill={'currentColor'} d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
        </svg>
      </button>

      {(showCustomConfig || open) && (  
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">  
          {/* Title Section */}
          <CustomFunctionTitle title={t('Custom Functions')} textClass={textClass} />
  
          {/* Function List Section */}
          {functions.length > 0 && (
            <CustomFunctionList
              functions={functions}
              onUpdateFunction={updateFunction}
              onDeleteFunction={deleteFunction}
              t={t}
            />
          )}
  
          {/* Button Section */}
          <CustomFunctionButtons
            onAddFunction={addNewFunction}
            onAddRoleMatching={addMatchingFunction}
            onAddDomainMatching={addMatchingDomainFunction}
            hasRoleMatching={hasMatchingFunction('matchingForGFunction')}
            hasDomainMatching={hasMatchingFunction('matchingDomainForGFunction')}
            showAddFunctionOnly={functions.length === 0}
            t={t}
          />
  
          {/* Role inheritance diagram area - Occupies all remaining space */}  
          <div className="border-t border-border mt-2 pt-4 flex-1 min-h-0 px-2 flex flex-col">  
            <div className="h-8 pl-2 flex items-center font-bold text-lg mb-2 flex-shrink-0">  
              <div className={textClass}>{t('Role Inheritance Graph')}</div>  
            </div>  
            <div
              className={clsx(
                "flex-1 min-h-0 overflow-auto bg-white dark:bg-slate-800",
                "rounded-lg border border-border shadow-sm",
              )}
            >  
              {modelKind && policy && (  
                <RoleInheritanceGraph   
                  policy={policy}   
                  className="h-full"  
                />  
              )}  
            </div>  
          </div>  
        </div>  
      )}
    </>
  );
};
