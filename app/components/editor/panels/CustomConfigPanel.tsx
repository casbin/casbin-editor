// Copyright 2025 The casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React, { useState, useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { RoleInheritanceGraph } from '../role-inheritance-graph/RoleInheritanceGraph';
import { CustomFunctionsTitle } from '../custom-config/CustomFunctionsTitle';
import { CustomFunctionsList } from '../custom-config/CustomFunctionsList';
import { CustomFunctionsButtons } from '../custom-config/CustomFunctionsButtons';
import type { FunctionConfig } from '../custom-config/types';

interface CustomConfigPanelProps {
  showCustomConfig: boolean;
  customConfig: string;
  setCustomConfigPersistent: (value: string) => void;
  textClass: string;
  t: (key: string) => string;
  policy: string;  
  modelKind: string;
}

export const CustomConfigPanel: React.FC<CustomConfigPanelProps> = ({
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
      {showCustomConfig && (  
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">  
          <PanelGroup direction="vertical" className="flex-1 min-h-0">
            {/* Custom Function Panel */}
            <Panel defaultSize={40} minSize={20} maxSize={80}>
              <div className="flex flex-col h-full">
                {/* Header: title + action buttons */}
                <div className={'pt-6 h-12 pl-3 pr-3 flex items-center justify-between font-bold text-lg flex-shrink-0'}>
                  <CustomFunctionsTitle textClass={textClass} t={t} />
                  <CustomFunctionsButtons
                    addNewFunction={addNewFunction}
                    addMatchingFunction={addMatchingFunction}
                    addMatchingDomainFunction={addMatchingDomainFunction}
                    hasMatchingFunction={hasMatchingFunction}
                    t={t}
                  />
                </div>

                {/* Function Section */}
                <div className="flex-1 min-h-0 overflow-auto">
                  <CustomFunctionsList
                    functions={functions}
                    updateFunction={updateFunction}
                    deleteFunction={deleteFunction}
                    t={t}
                  />
                </div>
              </div>
            </Panel>
            
            {/* Resize Handle */}
            <PanelResizeHandle className="h-2 flex items-center justify-center cursor-row-resize hover:bg-primary/10 transition-colors group">
              <div className="w-16 h-1 rounded-full bg-border group-hover:bg-primary/50 transition-colors" />
            </PanelResizeHandle>

            {/* Role Inheritance Graph Panel */}
            <Panel defaultSize={60} minSize={20} maxSize={80}>
              <div className="h-full px-2 py-2 flex flex-col">  
                <div className="h-8 pl-2 flex items-center font-bold text-lg mb-2 flex-shrink-0">  
                  <div className={textClass}>{t('Role Inheritance Graph')}</div>  
                </div>  
                <div
                  className={clsx(
                    "flex-1 min-h-0 overflow-auto bg-white dark:bg-slate-800",
                    "rounded-lg border border-border shadow-sm",
                  )}
                >  
                  {modelKind && (  
                    <RoleInheritanceGraph   
                      policy={policy}   
                      className="h-full"  
                    />  
                  )}  
                </div>  
              </div>
            </Panel>
          </PanelGroup>
        </div>  
      )}
    </>
  );
};
