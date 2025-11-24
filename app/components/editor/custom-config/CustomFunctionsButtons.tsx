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

import React, { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { Plus, UserCheck, Globe, Code } from 'lucide-react';

/**
 * Props for the CustomFunctionsButtons component
 */
interface CustomFunctionsButtonsProps {
  addNewFunction: () => void;
  addMatchingFunction: () => void;
  addMatchingDomainFunction: () => void;
  hasMatchingFunction: (name: string) => boolean;
  t: (key: string) => string;
}

export const CustomFunctionsButtons: React.FC<CustomFunctionsButtonsProps> = ({
  addNewFunction,
  addMatchingFunction,
  addMatchingDomainFunction,
  hasMatchingFunction,
  t,
}) => {
  const buttonsRef = useRef<HTMLDivElement | null>(null);
  const [iconsOnly, setIconsOnly] = useState(false);

  useEffect(() => {
    const el = buttonsRef.current;
    if (!el) return;

    const check = () => {
      const w = el.clientWidth || 0;
      const per = w / 3;
      setIconsOnly(per < 105);
    };

    const ro = new ResizeObserver(check);
    ro.observe(el);
    check();

    return () => ro.disconnect();
  }, [buttonsRef.current]);

  const ActionButton: React.FC<{
    onClick: () => void;
    disabled?: boolean;
    titleKey: string;
    Icon: React.ComponentType<any>;
  }> = ({ onClick, disabled = false, titleKey, Icon }) => {
    return (
      <button
        onClick={() => onClick()}
        disabled={disabled}
        className={clsx(
          'flex-1 min-w-0 text-center whitespace-nowrap overflow-hidden text-ellipsis',
          'px-2 py-1 rounded-md text-xs font-medium',
          'transition-all shadow-sm',
          disabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
            : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md',
        )}
        title={t(titleKey)}
      >
        {iconsOnly ? (
          <div className="flex items-center justify-center gap-1">
            <Plus className="w-3 h-3" />
            <Icon className="w-4 h-4" />
          </div>
        ) : (
          <>
            <Icon className="inline-block w-4 h-4 mr-2 align-middle" />
            <span className="truncate align-middle">{t(titleKey)}</span>
          </>
        )}
      </button>
    );
  };

  return (
    <div ref={buttonsRef} className="flex gap-2 text-xs flex-1 justify-end min-w-0 ml-4">
      <ActionButton onClick={addNewFunction} titleKey={'Add Function'} Icon={Code} />
      <ActionButton
        onClick={addMatchingFunction}
        disabled={hasMatchingFunction('matchingForGFunction')}
        titleKey={'Add Role Matching'}
        Icon={UserCheck}
      />
      <ActionButton
        onClick={addMatchingDomainFunction}
        disabled={hasMatchingFunction('matchingDomainForGFunction')}
        titleKey={'Add Domain Matching'}
        Icon={Globe}
      />
    </div>
  );
};
