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
