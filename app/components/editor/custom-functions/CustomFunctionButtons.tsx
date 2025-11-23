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

interface CustomFunctionButtonsProps {
  onAddFunction: () => void;
  onAddRoleMatching: () => void;
  onAddDomainMatching: () => void;
  hasRoleMatching: boolean;
  hasDomainMatching: boolean;
  showAddFunctionOnly: boolean;
  t: (key: string) => string;
}

export const CustomFunctionButtons: React.FC<CustomFunctionButtonsProps> = ({
  onAddFunction,
  onAddRoleMatching,
  onAddDomainMatching,
  hasRoleMatching,
  hasDomainMatching,
  showAddFunctionOnly,
  t,
}) => {
  if (showAddFunctionOnly) {
    // Show only Add Function button when no functions exist
    return (
      <div className="flex gap-2 m-1 mb-0 text-xs">
        <button
          onClick={onAddFunction}
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

  // Show all three buttons when functions exist
  return (
    <div className="flex gap-2 m-1 mb-0 text-xs px-2">
      <button
        onClick={onAddFunction}
        className={clsx(
          "px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm",
          "hover:bg-primary/90 transition-all shadow-sm hover:shadow-md font-medium",
        )}
      >
        {t('Add Function')}
      </button>
      <button
        onClick={onAddRoleMatching}
        disabled={hasRoleMatching}
        className={clsx(
          "px-3 py-1.5 rounded-lg text-sm transition-all shadow-sm font-medium",
          hasRoleMatching
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md",
        )}
      >
        {t('Add Role Matching')}
      </button>
      <button
        onClick={onAddDomainMatching}
        disabled={hasDomainMatching}
        className={clsx(
          "px-3 py-1.5 rounded-lg text-sm transition-all shadow-sm font-medium",
          hasDomainMatching
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md",
        )}
      >
        {t('Add Domain Matching')}
      </button>
    </div>
  );
};
