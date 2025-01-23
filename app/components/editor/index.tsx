'use client';
import React, { useState, useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { Toaster } from 'react-hot-toast';
import CodeMirror from '@uiw/react-codemirror';
import { monokai } from '@uiw/codemirror-theme-monokai';
import { basicSetup } from 'codemirror';
import { indentUnit } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { javascriptLanguage } from '@codemirror/lang-javascript';
import { linter, lintGutter } from '@codemirror/lint';
import { example } from '@/app/components/editor/casbin-mode/example';
import { CasbinConfSupport } from '@/app/components/editor/casbin-mode/casbin-conf';
import { CasbinPolicySupport } from '@/app/components/editor/casbin-mode/casbin-csv';
import SidePanelChat from '@/app/components/editor/panels/SidePanelChat';
import { CustomConfigPanel } from '@/app/components/editor/panels/CustomConfigPanel';
import { PolicyToolbar } from '@/app/components/editor/panels/PolicyToolbar';
import { MessageWithTooltip } from '@/app/components/editor/common/MessageWithTooltip';
import { FileUploadButton } from '@/app/components/editor/common/FileUploadButton';
import { e, m, p, r } from '@/app/components/hooks/useSetupEnforceContext';
import useRunTest from '@/app/components/hooks/useRunTest';
import useShareInfo from '@/app/components/hooks/useShareInfo';
import useSetupEnforceContext from '@/app/components/hooks/useSetupEnforceContext';
import useIndex from '@/app/components/hooks/useIndex';
import useEngineVersions from '@/app/components/hooks/useEngineVersions';
import { useEnforceCall } from '@/app/components/hooks/useEnforceCall';
import { buttonPlugin } from '@/app/components/editor/plugins/ButtonPlugin';
import { loadingOverlay } from '@/app/components/editor/plugins/LoadingOverlayExtension';
import { extractPageContent } from '@/app/utils/contentExtractor';
import { formatEngineResults, ResultsMap } from '@/app/utils/resultFormatter';
import { casbinLinter, policyLinter, requestLinter } from '@/app/utils/casbinLinter';
import { useLang } from '@/app/context/LangContext';
import LanguageMenu from '@/app/context/LanguageMenu';

export const EditorScreen = () => {
  const {
    modelKind,
    setModelKind,
    modelText,
    policy,
    request,
    echo,
    setEcho,
    requestResult,
    setRequestResult,
    customConfig,
    enforceContextData,
    setPolicyPersistent,
    setModelTextPersistent,
    setCustomConfigPersistent,
    setRequestPersistent,
    setEnforceContextDataPersistent,
    handleShare,
    selectedEngine,
    setSelectedEngine,
    comparisonEngines,
    setComparisonEngines,
  } = useIndex();
  const { enforcer } = useRunTest();
  const { shareInfo } = useShareInfo();
  const { t, lang, theme, toggleTheme } = useLang();
  const [open, setOpen] = useState(true);
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [showCustomConfig, setShowCustomConfig] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requestResults, setRequestResults] = useState<ResultsMap>({});
  const skipNextEffectRef = useRef(false);
  const sidePanelChatRef = useRef<{ openDrawer: (message: string) => void } | null>(null);
  const { setupEnforceContextData, setupHandleEnforceContextChange } = useSetupEnforceContext({
    onChange: setEnforceContextDataPersistent,
    data: enforceContextData,
  });
  const { javaVersion, goVersion, casbinVersion, engineGithubLinks } = useEngineVersions(isLoading);
  const { handleEnforcerCall } = useEnforceCall(enforcer, setEcho, setRequestResult, setRequestResults, setIsLoading, t);
  const openDrawerWithMessage = (message: string) => {
    if (sidePanelChatRef.current) {
      sidePanelChatRef.current.openDrawer(message);
    }
  };
  const extractContent = (boxType: string) => {
    const { message } = extractPageContent(boxType, t, lang);
    return message;
  };

  const runTest = () => {
    return handleEnforcerCall({
      modelKind,
      model: modelText,
      policy,
      customConfig,
      request,
      enforceContextData,
      selectedEngine,
      comparisonEngines,
      showSuccessToast: true,
    });
  };

  useEffect(() => {
    if (modelKind && modelText) {
      if (skipNextEffectRef.current) {
        skipNextEffectRef.current = false;
        return;
      }
      setIsContentLoaded(true);
      setRequestResults({});
      setRequestResult('');

      handleEnforcerCall({
        modelKind,
        model: modelText,
        policy,
        customConfig,
        request,
        enforceContextData,
        selectedEngine,
        comparisonEngines,
      });
    }
  }, [
    modelKind,
    modelText,
    policy,
    customConfig,
    request,
    enforceContextData,
    selectedEngine,
    comparisonEngines,
    handleEnforcerCall,
    setRequestResult,
  ]);

  const handleEngineChange = (newPrimary: string, newComparison: string[]) => {
    skipNextEffectRef.current = true;
    setSelectedEngine(newPrimary);
    setComparisonEngines(newComparison);
    setRequestResults({});
    handleEnforcerCall({
      modelKind,
      model: modelText,
      policy,
      customConfig,
      request,
      enforceContextData,
      selectedEngine: newPrimary,
      comparisonEngines: newComparison,
    });
  };

  const textClass = clsx(theme === 'dark' ? 'text-gray-200' : 'text-gray-800');

  return (
    <div className="flex flex-col sm:flex-row h-full">
      <Toaster position="top-center" />
      <div
        className={clsx('sm:relative border-r border-[#dddddd]', 'transition-all duration-300', {
          'hidden sm:block': !showCustomConfig,
          block: showCustomConfig,
          'sm:w-1/3': open,
          'sm:w-5': !open,
        })}
      >
        <div className="flex flex-col h-full">
          <CustomConfigPanel
            open={open}
            setOpen={setOpen}
            showCustomConfig={showCustomConfig}
            customConfig={customConfig}
            setCustomConfigPersistent={setCustomConfigPersistent}
            textClass={textClass}
            t={t}
          />
        </div>
      </div>
      <div className={clsx('flex flex-col grow h-full w-full')}>
        <div className="flex flex-col sm:flex-row gap-1 pt-4 flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className={clsx('h-10 pl-2', 'flex items-center justify-start gap-2')}>
              <div className={clsx(textClass, 'font-bold')}>{t('Model')}</div>
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
              <div className="sm:hidden ml-auto mr-2">
                <button
                  className={clsx(
                    'rounded',
                    'flex items-center justify-center',
                    'border border-[#453d7d]',
                    'text-[#453d7a]',
                    'bg-[#efefef]',
                    'hover:bg-[#453d7d] hover:text-white',
                    'transition-colors duration-500',
                  )}
                  onClick={() => {
                    return setShowCustomConfig(!showCustomConfig);
                  }}
                >
                  <svg
                    className={clsx('h-6 w-6')}
                    style={{
                      transform: showCustomConfig ? 'rotateZ(90deg)' : 'rotateZ(-90deg)',
                    }}
                    viewBox="0 0 24 24"
                  >
                    <path fill={'currentColor'} d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-grow overflow-auto h-full">
              <div className="flex flex-col h-full">
                <CodeMirror
                  height="100%"
                  theme={monokai}
                  onChange={setModelTextPersistent}
                  basicSetup={{
                    lineNumbers: true,
                    highlightActiveLine: true,
                    bracketMatching: true,
                    indentOnInput: true,
                  }}
                  extensions={[
                    basicSetup,
                    CasbinConfSupport(),
                    indentUnit.of('    '),
                    EditorView.lineWrapping,
                    buttonPlugin(openDrawerWithMessage, extractContent, 'model'),
                    linter(casbinLinter),
                    lintGutter(),
                  ]}
                  className={'function flex-grow h-[300px]'}
                  value={modelText}
                />
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="h-10 pl-2 font-bold flex items-center justify-between">
              <div className={textClass}>{t('Policy')}</div>
              <PolicyToolbar
                setPolicyPersistent={setPolicyPersistent}
                selectedEngine={selectedEngine}
                comparisonEngines={comparisonEngines}
                handleEngineChange={handleEngineChange}
                casbinVersion={casbinVersion}
                javaVersion={javaVersion}
                goVersion={goVersion}
                engineGithubLinks={engineGithubLinks}
              />
            </div>
            <div className="flex-grow overflow-auto h-full">
              <div className="flex flex-col h-full">
                <CodeMirror
                  height="100%"
                  extensions={[
                    basicSetup,
                    CasbinPolicySupport(),
                    indentUnit.of('    '),
                    EditorView.lineWrapping,
                    buttonPlugin(openDrawerWithMessage, extractContent, 'policy'),
                    linter(policyLinter),
                    lintGutter(),
                  ]}
                  basicSetup={{
                    lineNumbers: true,
                    highlightActiveLine: true,
                    bracketMatching: true,
                    indentOnInput: true,
                  }}
                  theme={monokai}
                  onChange={setPolicyPersistent}
                  className={'function flex-grow h-[300px]'}
                  value={policy}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-1 pt-2 flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className={clsx('h-10 pl-2', 'flex items-center justify-start gap-3')}>
              <div className={clsx(textClass, 'font-bold')}>{t('Request')}</div>
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
            <div className="flex-grow overflow-auto h-full">
              <div className="flex flex-col h-full">
                <CodeMirror
                  height="100%"
                  theme={monokai}
                  onChange={(value) => {
                    setRequestPersistent(value);
                  }}
                  extensions={[
                    basicSetup,
                    CasbinPolicySupport(),
                    indentUnit.of('    '),
                    EditorView.lineWrapping,
                    buttonPlugin(openDrawerWithMessage, extractContent, 'request'),
                    linter(requestLinter),
                    lintGutter(),
                  ]}
                  basicSetup={{
                    lineNumbers: true,
                    highlightActiveLine: true,
                    bracketMatching: true,
                    indentOnInput: true,
                  }}
                  className={'function flex-grow h-[300px]'}
                  value={request}
                />
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className={clsx('h-10 pl-2 font-bold', 'flex items-center justify-between')}>
              <div className={textClass}>{t('Enforcement Result')}</div>
              <div className="mr-4">
                <div className="text-red-600 flex items-center">
                  <span>{t('Why this result')}</span>
                </div>
                <SidePanelChat ref={sidePanelChatRef} />
              </div>
            </div>
            <div className="flex-grow overflow-auto h-full">
              <div className="flex flex-col h-full">
                <CodeMirror
                  height="100%"
                  onChange={() => {
                    return;
                  }}
                  theme={monokai}
                  extensions={[
                    basicSetup,
                    javascriptLanguage,
                    indentUnit.of('    '),
                    EditorView.lineWrapping,
                    EditorView.editable.of(false),
                    buttonPlugin(openDrawerWithMessage, extractContent, 'enforcementResult'),
                    loadingOverlay(isLoading),
                  ]}
                  basicSetup={{
                    lineNumbers: true,
                    highlightActiveLine: true,
                    bracketMatching: true,
                    indentOnInput: true,
                  }}
                  className={'cursor-not-allowed flex-grow h-[300px]'}
                  value={Object.keys(requestResults).length > 0 ? formatEngineResults(requestResults, selectedEngine) : requestResult}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={clsx('pt-2 px-1 flex flex-col sm:flex-row items-start sm:items-center')}>
          <div className="flex flex-row flex-wrap gap-2 mb-2 sm:mb-0 w-full sm:w-auto">
            <button
              className={clsx(
                'rounded',
                'px-2 py-1',
                'border border-[#453d7d]',
                'text-[#453d7a]',
                'bg-[#efefef]',
                'hover:bg-[#453d7d] hover:text-white',
                'transition-colors duration-500',
              )}
              onClick={runTest}
            >
              {t('RUN THE TEST')}
            </button>
            <button
              className={clsx(
                'rounded',
                'px-2 py-1',
                'border border-[#453d7d]',
                'text-[#453d7a]',
                'bg-[#efefef]',
                'hover:bg-[#453d7d] hover:text-white',
                'transition-colors duration-500',
              )}
              onClick={() => {
                shareInfo({
                  onResponse: (v) => {
                    return handleShare(v);
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
              }}
            >
              {t('SHARE')}
            </button>
          </div>

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
                  style={{
                    filter: theme === 'dark' ? 'invert(1)' : 'invert(0)',
                  }}
                />
              </button>
              <LanguageMenu />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
