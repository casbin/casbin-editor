'use client';
import { useState, useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { Toaster } from 'react-hot-toast';
import CodeMirror from '@uiw/react-codemirror';
import { monokai } from '@uiw/codemirror-theme-monokai';
import { basicSetup } from 'codemirror';
import { indentUnit } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { javascriptLanguage } from '@codemirror/lang-javascript';
import { linter, lintGutter } from '@codemirror/lint';
import { CasbinConfSupport } from '@/app/components/editor/casbin-mode/casbin-conf';
import { CasbinPolicySupport } from '@/app/components/editor/casbin-mode/casbin-csv';
import SidePanelChat from '@/app/components/editor/panels/SidePanelChat';
import { CustomConfigPanel } from '@/app/components/editor/panels/CustomConfigPanel';
import { ModelToolbar } from '@/app/components/editor/panels/ModelToolbar';
import { PolicyToolbar } from '@/app/components/editor/panels/PolicyToolbar';
import { RequestToolbar } from '@/app/components/editor/panels/RequestToolbar';
import FooterToolbar from '@/app/components/editor/panels/FooterToolbar';
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
import type { EngineType } from '@/app/config/engineConfig';

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
  const [showCustomConfig, setShowCustomConfig] = useState(false);
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [requestResults, setRequestResults] = useState<ResultsMap>({});
  const [isChatOpen, setIsChatOpen] = useState(false);
  const skipNextEffectRef = useRef(false);
  const sidePanelChatRef = useRef<{ openDrawer: (message: string) => void } | null>(null);
  const { setupEnforceContextData, setupHandleEnforceContextChange } = useSetupEnforceContext({
    onChange: setEnforceContextDataPersistent,
    data: enforceContextData,
  });
  const { versions, engineGithubLinks } = useEngineVersions();
  const { handleEnforcerCall, isLoading } = useEnforceCall(enforcer, setEcho, setRequestResult, setRequestResults, t);
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

  const handleEngineChange = (newPrimary: EngineType, newComparison: EngineType[]) => {
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
    <div className="flex flex-col sm:flex-row h-full w-full overflow-hidden">
      <Toaster position="top-center" />
      <div
        className={clsx('sm:relative border-r border-[#dddddd]', 'transition-all duration-300', {
          'hidden sm:block': !showCustomConfig,
          block: showCustomConfig,
          'sm:w-[25%]': open,
          'sm:w-5': !open,
        })}
      >
        <div className="flex flex-col h-full w-full">
          <CustomConfigPanel
            open={open}
            setOpen={setOpen}
            showCustomConfig={showCustomConfig}
            customConfig={customConfig}
            setCustomConfigPersistent={setCustomConfigPersistent}
            textClass={textClass}
            t={t}
            policy={policy}  
            modelKind={modelKind}
          />
        </div>
      </div>
      <div
        className={clsx('flex flex-col h-full min-w-0', 'transition-all duration-300', {
          'sm:w-[60%]': open && isChatOpen,
          'sm:w-[75%]': open && !isChatOpen,
          'sm:w-[70%]': !open && isChatOpen,
          'w-full': !open && !isChatOpen,
        })}
      >
        <div className="flex flex-col sm:flex-row gap-1 pt-4 flex-1 overflow-hidden min-w-0">
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className={clsx('h-10 pl-2', 'flex items-center justify-start gap-2')}>
              <div className={clsx(textClass, 'font-bold')}>{t('Model')}</div>
              <ModelToolbar
                modelKind={modelKind}
                setModelKind={setModelKind}
                setRequestResults={setRequestResults}
                setModelTextPersistent={setModelTextPersistent}
              />
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
                versions={versions}
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
        <div className="flex flex-col sm:flex-row gap-1 pt-2 flex-1 overflow-hidden min-w-0">
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className={clsx('h-10 pl-2', 'flex items-center justify-start gap-3')}>
              <div className={clsx(textClass, 'font-bold')}>{t('Request')}</div>
              <RequestToolbar
                setupEnforceContextData={setupEnforceContextData}
                setupHandleEnforceContextChange={setupHandleEnforceContextChange}
                setRequestPersistent={setRequestPersistent}
              />
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
                <div
                  className="text-red-600 flex items-center cursor-pointer hover:text-red-700"
                  onClick={() => {
                    if (sidePanelChatRef.current) {
                      sidePanelChatRef.current.openDrawer('');
                    }
                  }}
                >
                  <span>{t('Why this result')}</span>
                </div>
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
        <FooterToolbar
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
          echo={echo}
          textClass={textClass}
          toggleTheme={toggleTheme}
          theme={theme}
        />
      </div>
      <SidePanelChat
        ref={sidePanelChatRef}
        onOpenChange={(open: boolean) => {
          setIsChatOpen(open);
        }}
      />
    </div>
  );
};
