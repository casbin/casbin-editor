import { clsx } from 'clsx';
import { useLang } from '@/app/context/LangContext';
import { toast } from 'react-hot-toast';
import type { EngineType } from '@/app/config/engineConfig';
import type { ShareProps } from '@/app/components/hooks/useShareInfo';
import { refreshEngines } from '@/app/components/hooks/useRemoteEnforcer';
import { useState, useEffect } from 'react';

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
  const [showRefreshButton, setShowRefreshButton] = useState(false);
  const [keyPressCount, setKeyPressCount] = useState(0);
  const [lastKeyPressTime, setLastKeyPressTime] = useState(0);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === '1') {
        const currentTime = Date.now();
        if (currentTime - lastKeyPressTime > 1000) {
          setKeyPressCount(1);
        } else {
          setKeyPressCount(prev => prev + 1);
        }
        setLastKeyPressTime(currentTime);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [lastKeyPressTime]);

  useEffect(() => {
    if (keyPressCount === 3) {
      setShowRefreshButton(true);
      setKeyPressCount(0);
    }
  }, [keyPressCount]);

  const handleRefreshEngines = async () => {
    const toastId = toast.loading(t('Refreshing engines...'));
    try {
      await refreshEngines();
      toast.success(t('Engines refreshed successfully'), { id: toastId });
      setShowRefreshButton(false);
    } catch (error) {
      toast.error(t('Failed to refresh engines'), { id: toastId });
    }
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
      {showRefreshButton && (
        <button className={buttonClassName} onClick={handleRefreshEngines}>
          {t('Refresh Engines')}
        </button>
      )}
      <button className={buttonClassName} onClick={handleShareClick}>
        {t('SHARE')}
      </button>
    </div>
  );
};
