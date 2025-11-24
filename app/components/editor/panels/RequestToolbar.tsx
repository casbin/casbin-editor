import { clsx } from 'clsx';
import { FileUploadButton } from '@/app/components/editor/common/FileUploadButton';
import { useUserInteraction } from '@/app/context/UserInteractionContext';
import { e, m, p, r } from '@/app/components/hooks/useSetupEnforceContext';

interface RequestToolbarProps {
  setupEnforceContextData: Map<string, string>;
  setupHandleEnforceContextChange: (key: string, value: string) => void;
  setRequestPersistent: (content: string) => void;
}

export const RequestToolbar = ({ setupEnforceContextData, setupHandleEnforceContextChange, setRequestPersistent }: RequestToolbarProps) => {
  const { incrementInteractionCount, decrementInteractionCount } = useUserInteraction();
  const inputClassName = clsx(
    'w-8 px-1.5 py-0.5',
    'border border-border rounded-md',
    'text-sm',
    'focus:outline-none focus:ring-2 focus:ring-primary/50',
    'transition-all',
    'bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100',
  );

  return (
    <div className="flex-1 overflow-x-auto">
      <div className="flex items-center gap-2 min-w-max">
        <div className={'space-x-2'}>
          <input
            className={inputClassName}
            value={setupEnforceContextData.get(r)}
            placeholder={r}
            onChange={(event) => {
              return setupHandleEnforceContextChange(r, event.target.value);
            }}
            onFocus={incrementInteractionCount}
            onBlur={decrementInteractionCount}
          />
          <input
            className={inputClassName}
            value={setupEnforceContextData.get(p)}
            placeholder={p}
            onChange={(event) => {
              return setupHandleEnforceContextChange(p, event.target.value);
            }}
            onFocus={incrementInteractionCount}
            onBlur={decrementInteractionCount}
          />
          <input
            className={inputClassName}
            value={setupEnforceContextData.get(e)}
            placeholder={e}
            onChange={(event) => {
              return setupHandleEnforceContextChange(e, event.target.value);
            }}
            onFocus={incrementInteractionCount}
            onBlur={decrementInteractionCount}
          />
          <input
            className={inputClassName}
            value={setupEnforceContextData.get(m)}
            placeholder={m}
            onChange={(event) => {
              return setupHandleEnforceContextChange(m, event.target.value);
            }}
            onFocus={incrementInteractionCount}
            onBlur={decrementInteractionCount}
          />
        </div>
        <FileUploadButton onFileContent={setRequestPersistent} accept=".txt" />
      </div>
    </div>
  );
};
