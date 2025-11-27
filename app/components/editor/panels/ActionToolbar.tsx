import { clsx } from 'clsx';
import { useLang } from '@/app/context/LangContext';
import { toast } from 'react-hot-toast';
import type { EngineType } from '@/app/config/engineConfig';
import type { ShareProps } from '@/app/components/hooks/useShareInfo';
import { refreshEngines } from '@/app/components/hooks/useRemoteEnforcer';
import { useState, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/app/components/ui/tooltip';

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
  requestResult?: string;
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
  requestResult,
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
          setKeyPressCount((prev) => {return prev + 1});
        }
        setLastKeyPressTime(currentTime);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {return document.removeEventListener('keydown', handleKeyPress)};
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

  const formatConfigurationContent = () => {
    return [
      '# Casbin Policy Configuration',
      '',
      '## Model',
      '```',
      modelText,
      '```',
      '',
      '## Policy',
      '```',
      policy || '(empty)',
      '```',
      '',
      '## Request',
      '```',
      request || '(empty)',
      '```',
      '',
      '## Enforcement Result',
      '```',
      requestResult || '(empty)',
      '```',
    ].join('\n');
  };

  const handleCopyClick = () => {
    const content = formatConfigurationContent();

    navigator.clipboard
      .writeText(content)
      .then(() => {
        toast.success(t('Content copied to clipboard'), {
          duration: 3000,
        });
      })
      .catch(() => {
        toast.error(t('Failed to copy content'));
      });
  };

  const handleDownloadClick = () => {
    try {
      const content = formatConfigurationContent();

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
      link.download = `casbin-config-${timestamp}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(t('Configuration downloaded successfully'), {
        duration: 3000,
      });
    } catch (error) {
      toast.error(t('Failed to download configuration'));
    }
  };

  const buttonClassName = clsx(
    'rounded-lg',
    'px-4 py-2',
    'border border-primary',
    'text-primary',
    'bg-secondary',
    'hover:bg-primary hover:text-primary-foreground',
    'transition-all duration-200',
    'shadow-sm hover:shadow-md',
    'font-medium text-sm',
  );

  return (
    <TooltipProvider>
      <div className="flex flex-row flex-wrap gap-4 mb-2 sm:mb-0 w-full sm:w-auto">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className={buttonClassName} onClick={runTest}>
              {t('RUN THE TEST')}
            </button>
          </TooltipTrigger>
          <TooltipContent
            className="bg-white dark:bg-gray-800 text-primary border border-primary"
          >
            <p>{t('Run test tooltip')}</p>
          </TooltipContent>
        </Tooltip>
        {showRefreshButton && (
          <button className={buttonClassName} onClick={handleRefreshEngines}>
            {t('Refresh Engines')}
          </button>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <button className={buttonClassName} onClick={handleCopyClick}>
              {t('COPY')}
            </button>
          </TooltipTrigger>
          <TooltipContent
            className="bg-white dark:bg-gray-800 text-primary border border-primary"
          >
            <p>{t('Copy tooltip')}</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className={buttonClassName} onClick={handleDownloadClick}>
              {t('DOWNLOAD')}
            </button>
          </TooltipTrigger>
          <TooltipContent
            className="bg-white dark:bg-gray-800 text-primary border border-primary"
          >
            <p>{t('Download tooltip')}</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className={buttonClassName} onClick={handleShareClick}>
              {t('SHARE')}
            </button>
          </TooltipTrigger>
          <TooltipContent
            className="bg-white dark:bg-gray-800 text-primary border border-primary"
          >
            <p>{t('Share tooltip')}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
