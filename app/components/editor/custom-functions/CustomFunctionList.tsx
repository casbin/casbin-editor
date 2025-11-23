import React from 'react';
import { clsx } from 'clsx';
import CodeMirror from '@uiw/react-codemirror';
import { monokai } from '@uiw/codemirror-theme-monokai';
import { basicSetup } from 'codemirror';
import { indentUnit } from '@codemirror/language';
import { StreamLanguage } from '@codemirror/language';
import { go } from '@codemirror/legacy-modes/mode/go';
import { EditorView } from '@codemirror/view';
import { FunctionConfig } from './types';

interface CustomFunctionListProps {
  functions: FunctionConfig[];
  onUpdateFunction: (id: string, field: keyof FunctionConfig, value: string) => void;
  onDeleteFunction: (id: string) => void;
  t: (key: string) => string;
}

export const CustomFunctionList: React.FC<CustomFunctionListProps> = ({
  functions,
  onUpdateFunction,
  onDeleteFunction,
  t,
}) => {
  return (
    <div className="h-32 overflow-auto min-h-0 flex-shrink-0 px-2">
      {/* Display only the first function to maintain a fixed height for the custom functions area */}
      {functions.slice(0, 1).map((func) => {
        return (
          <div key={func.id} className="bg-white dark:bg-slate-800 rounded-lg flex flex-col shadow-sm border border-border">
            <div className="flex justify-between items-center p-2">
              <input
                type="text"
                value={func.name}
                onChange={(e) => {
                  return onUpdateFunction(func.id, 'name', e.target.value);
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
                  return onDeleteFunction(func.id);
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
                  return onUpdateFunction(func.id, 'body', value);
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
    </div>
  );
};
