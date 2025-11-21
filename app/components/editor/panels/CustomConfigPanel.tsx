import React, { useState, useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import CodeMirror from '@uiw/react-codemirror';
import { monokai } from '@uiw/codemirror-theme-monokai';
import { basicSetup } from 'codemirror';
import { indentUnit } from '@codemirror/language';
import { StreamLanguage } from '@codemirror/language';
import { go } from '@codemirror/legacy-modes/mode/go';
import { EditorView } from '@codemirror/view';
import { RoleInheritanceGraph } from '../role-inheritance-graph/RoleInheritanceGraph';

interface FunctionConfig {
  id: string;
  name: string;
  body: string;
}

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
  onHighlightPolicyLines?: (lines: number[]) => void;
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
  onHighlightPolicyLines,
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
          <div className={'pt-6 h-12 pl-3 flex items-center font-bold text-lg'}>  
            <div className={textClass}>{t('Custom Functions')}</div>  
          </div>  
  
          {/* Custom Functions Area - Restricted to the height of a function */}  
          <div className="h-32 overflow-auto min-h-0 flex-shrink-0 px-2">  
            {functions.slice(0, 1).map((func) => {  
              return (  
                <div key={func.id} className="bg-white dark:bg-slate-800 rounded-lg flex flex-col shadow-sm border border-border">  
                  <div className="flex justify-between items-center p-2">  
                    <input  
                      type="text"  
                      value={func.name}  
                      onChange={(e) => {  
                        return updateFunction(func.id, 'name', e.target.value);  
                      }}  
                      className={clsx(
                        "px-3 py-1.5 border border-border rounded-lg w-64",
                        "focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all",
                        "bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100",
                      )}
                      placeholder={t('Function name')}  
                      disabled={
                        func.name === 'matchingForGFunction' ||
                        func.name === 'matchingDomainForGFunction'
                      }
                    />  
                    <button  
                      onClick={() => {  
                        return deleteFunction(func.id);  
                      }}  
                      className={clsx(
                        "w-7 h-7 flex items-center justify-center",
                        "text-muted-foreground hover:text-destructive transition-colors",
                        "rounded-lg hover:bg-destructive/10",
                      )}
                      title={t('Delete')}  
                    >  
                      <svg viewBox="0 0 24 24" className="w-4 h-4">  
                        <path  
                          fill="currentColor"  
                          d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"  
                        />  
                      </svg>  
                    </button>  
                  </div>  
  
                  <div className="flex-1 overflow-auto">  
                    <CodeMirror  
                      value={func.body}  
                      height="100%"  
                      theme={monokai}  
                      onChange={(value) => {  
                        return updateFunction(func.id, 'body', value);  
                      }}  
                      basicSetup={{  
                        lineNumbers: true,  
                        highlightActiveLine: true,  
                        bracketMatching: true,  
                        indentOnInput: true,  
                      }}  
                      extensions={[basicSetup, StreamLanguage.define(go), indentUnit.of('    '), EditorView.lineWrapping]}  
                      className="h-full"  
                    />  
                  </div>  
                </div>  
              );  
            })}  
              
            {/* If there is no function, display the Add button */}  
            {functions.length === 0 && (  
              <div className="flex gap-2 m-1 mb-0 text-xs">  
                <button  
                  onClick={addNewFunction}  
                  className={clsx(
                    "px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm",
                    "hover:bg-primary/90 transition-all shadow-sm hover:shadow-md font-medium",
                  )}
                >  
                  {t('Add Function')}  
                </button>  
              </div>  
            )}  
          </div>  
  
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
                  onHighlightPolicyLines={onHighlightPolicyLines}
                />  
              )}  
            </div>  
          </div>  
        </div>  
      )}
    </>
  );
};
