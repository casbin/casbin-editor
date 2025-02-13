import { clsx } from 'clsx';
import { FileUploadButton } from '@/app/components/editor/common/FileUploadButton';
import { e, m, p, r } from '@/app/components/hooks/useSetupEnforceContext';

interface RequestToolbarProps {
  setupEnforceContextData: Map<string, string>;
  setupHandleEnforceContextChange: (key: string, value: string) => void;
  setRequestPersistent: (content: string) => void;
}

export const RequestToolbar = ({ setupEnforceContextData, setupHandleEnforceContextChange, setRequestPersistent }: RequestToolbarProps) => {
  return (
    <div className="flex-1 overflow-x-auto">
      <div className="flex items-center gap-2 min-w-max">
        <div className={'space-x-2'}>
          <input
            className={clsx('w-7 pl-1', 'border border-black rounded')}
            value={setupEnforceContextData.get(r)}
            placeholder={r}
            onChange={(event) => {
              return setupHandleEnforceContextChange(r, event.target.value);
            }}
          />
          <input
            className={clsx('w-7 pl-1', 'border border-black rounded')}
            value={setupEnforceContextData.get(p)}
            placeholder={p}
            onChange={(event) => {
              return setupHandleEnforceContextChange(p, event.target.value);
            }}
          />
          <input
            className={clsx('w-7 pl-1', 'border border-black rounded')}
            value={setupEnforceContextData.get(e)}
            placeholder={e}
            onChange={(event) => {
              return setupHandleEnforceContextChange(e, event.target.value);
            }}
          />
          <input
            className={clsx('w-7 pl-1', 'border border-black rounded')}
            value={setupEnforceContextData.get(m)}
            placeholder={m}
            onChange={(event) => {
              return setupHandleEnforceContextChange(m, event.target.value);
            }}
          />
        </div>
        <FileUploadButton onFileContent={setRequestPersistent} accept=".txt" />
      </div>
    </div>
  );
};
