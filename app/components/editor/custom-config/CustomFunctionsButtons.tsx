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

/**
 * Props for the CustomFunctionsButtons component
 */
interface CustomFunctionsButtonsProps {
  /** Number of functions currently configured */
  functionsLength: number;
  /** Callback to add a new custom function */
  addNewFunction: () => void;
  /** Translation function for internationalization */
  t: (key: string) => string;
}

export const CustomFunctionsButtons: React.FC<CustomFunctionsButtonsProps> = ({
  functionsLength,
  addNewFunction,
  t,
}) => {
  // If there is no function, display the Add button
  if (functionsLength === 0) {
    return (
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
    );
  }

  return null;
};
