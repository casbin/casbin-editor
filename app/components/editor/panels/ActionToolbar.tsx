import { clsx } from 'clsx';
import { useLang } from '@/app/context/LangContext';
import type { EngineType } from '@/app/config/engineConfig';
import type { ShareProps } from '@/app/components/hooks/useShareInfo';

interface ActionToolbarProps {
  runTest: () => void;
  shareInfo: (props: ShareProps) => void;
  handleShare: (v: string) => void;
  modelKind: string;
  modelText: string;
  policy: string;
  customConfig: string;
  request: string;
  enforceContextData: Map<string, string>;
  selectedEngine: EngineType;
  comparisonEngines: EngineType[];
}

export const ActionToolbar = ({
  runTest,
  shareInfo,
  handleShare,
  modelKind,
  modelText,
  policy,
  customConfig,
  request,
  enforceContextData,
  selectedEngine,
  comparisonEngines,
}: ActionToolbarProps) => {
  const { t } = useLang();

  const handleRefreshEngines = () => {
    console.log('Refresh engines clicked');
  };

  const handleShareClick = () => {
    shareInfo({
      onResponse: (v: string | JSX.Element) => {
        return handleShare(v as string);
      },
      modelKind,
      model: modelText,
      policy,
      customConfig,
      request,
      requestResult: Array.from(enforceContextData.entries()),
      selectedEngine,
      comparisonEngines,
    });
  };

  const buttonClassName = clsx(
    'rounded',
    'px-2 py-1',
    'border border-[#453d7d]',
    'text-[#453d7a]',
    'bg-[#efefef]',
    'hover:bg-[#453d7d] hover:text-white',
    'transition-colors duration-500',
  );

  return (
    <div className="flex flex-row flex-wrap gap-2 mb-2 sm:mb-0 w-full sm:w-auto">
      <button className={buttonClassName} onClick={runTest}>
        {t('RUN THE TEST')}
      </button>
      <button className={buttonClassName} onClick={handleRefreshEngines}>
        {t('Refresh Engines')}
      </button>
      <button className={buttonClassName} onClick={handleShareClick}>
        {t('SHARE')}
      </button>
    </div>
  );
};
