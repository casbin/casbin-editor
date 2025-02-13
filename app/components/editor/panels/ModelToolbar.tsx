import { clsx } from 'clsx';
import { FileUploadButton } from '@/app/components/editor/common/FileUploadButton';
import { example } from '@/app/components/editor/casbin-mode/example';
import { useLang } from '@/app/context/LangContext';

interface ModelSelectorProps {
  modelKind: string;
  setModelKind: (value: string) => void;
  setRequestResults: (value: {}) => void;
  setModelTextPersistent: (value: string) => void;
}

export const ModelToolbar = ({ modelKind, setModelKind, setRequestResults, setModelTextPersistent }: ModelSelectorProps) => {
  const { t } = useLang();

  return (
    <div className="flex-1 overflow-x-auto">
      <div className="flex items-center gap-2 min-w-max">
        <select
          value={modelKind}
          onChange={(e) => {
            setModelKind(e.target.value);
            setRequestResults({});
          }}
          className={'border-[#767676] border rounded w-[200px] sm:w-[300px]'}
        >
          <option value="" disabled>
            {t('Select your model')}
          </option>
          {Object.keys(example).map((n) => {
            return (
              <option key={n} value={n}>
                {example[n].name}
              </option>
            );
          })}
        </select>
        <button
          className={clsx(
            'rounded',
            'text-[#453d7d]',
            'px-1',
            'border border-[#453d7d]',
            'bg-[#efefef]',
            'hover:bg-[#453d7d] hover:text-white',
            'transition-colors duration-500',
          )}
          onClick={() => {
            const ok = window.confirm('Confirm Reset?');
            if (ok) {
              window.location.reload();
            }
          }}
        >
          {t('RESET')}
        </button>
        <FileUploadButton onFileContent={setModelTextPersistent} accept=".conf" />
      </div>
    </div>
  );
};
