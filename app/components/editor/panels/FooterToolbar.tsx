import { clsx } from 'clsx';
import { ActionToolbar } from '@/app/components/editor/panels/ActionToolbar';
import { MessageWithTooltip } from '@/app/components/editor/common/MessageWithTooltip';
import LanguageMenu from '@/app/context/LanguageMenu';

const FooterToolbar = ({
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
  echo,
  textClass,
  toggleTheme,
  theme,
}) => {
  return (
    <div className={clsx('pt-2 px-1 flex flex-col sm:flex-row items-start sm:items-center')}>
      <ActionToolbar
        runTest={runTest}
        shareInfo={shareInfo}
        handleShare={handleShare}
        modelKind={modelKind}
        modelText={modelText}
        policy={policy}
        customConfig={customConfig}
        request={request}
        enforceContextData={enforceContextData}
        selectedEngine={selectedEngine}
        comparisonEngines={comparisonEngines}
      />
      <div className="flex flex-row justify-between items-center w-full sm:w-auto sm:ml-auto mt-2 sm:mt-0">
        <MessageWithTooltip message={echo} className={textClass} />
        <div className="flex flex-row items-center ml-auto sm:ml-3">
          <button
            onClick={toggleTheme}
            aria-label={theme !== 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="theme-toggle-button mr-2"
          >
            <img
              src={theme !== 'dark' ? 'sun.svg' : 'moon.svg'}
              alt={theme !== 'dark' ? 'Light mode' : 'Dark mode'}
              className="w-6 h-6 transition-opacity duration-300"
              style={{ filter: theme === 'dark' ? 'invert(1)' : 'invert(0)' }}
            />
          </button>
          <LanguageMenu />
        </div>
      </div>
    </div>
  );
};
export default FooterToolbar;
