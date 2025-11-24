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

import React from 'react';
import { clsx } from 'clsx';
import CodeMirror from '@uiw/react-codemirror';
import { monokai } from '@uiw/codemirror-theme-monokai';
import { basicSetup } from 'codemirror';
import { indentUnit } from '@codemirror/language';
import { StreamLanguage } from '@codemirror/language';
import { go } from '@codemirror/legacy-modes/mode/go';
import { EditorView } from '@codemirror/view';
import { X } from 'lucide-react';
import type { FunctionConfig } from './types';

/**
 * Props for the CustomFunctionsList component
 */
interface CustomFunctionsListProps {
  /** Array of function configurations to display */
  functions: FunctionConfig[];
  /** Callback to update a function's name or body */
  updateFunction: (id: string, field: keyof FunctionConfig, value: string) => void;
  /** Callback to delete a function */
  deleteFunction: (id: string) => void;
  /** Translation function for internationalization */
  t: (key: string) => string;
}

export const CustomFunctionsList: React.FC<CustomFunctionsListProps> = ({
  functions,
  updateFunction,
  deleteFunction,
  t,
}) => {
  return (
    <div className="h-32 overflow-auto min-h-0 flex-shrink-0 px-2 space-y-2">
      {/* Render all functions; container is scrollable when there are many */}
      {functions.length === 0 && (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 text-sm">
          {t('No custom functions defined. Click any button to create one.')}
        </div>
      )}

      {functions.map((func) => {
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
                <X className="w-4 h-4" />
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
    </div>
  );
};
