'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { clsx } from 'clsx';
import { Toaster } from 'react-hot-toast';
import CodeMirror from '@uiw/react-codemirror';
import { monokai } from '@uiw/codemirror-theme-monokai';
import { basicSetup } from 'codemirror';
import { indentUnit } from '@codemirror/language';
import { EditorView, Decoration } from '@codemirror/view';
import { StateEffect, StateField } from '@codemirror/state';
import { javascriptLanguage } from '@codemirror/lang-javascript';
import { linter, lintGutter } from '@codemirror/lint';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { HelpCircle, ChevronLeft } from 'lucide-react';
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
import { useAutoCarousel } from '@/app/context/AutoCarouselContext';
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
  const { disableAutoCarousel } = useAutoCarousel();
  const [showCustomConfig, setShowCustomConfig] = useState(false);
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [requestResults, setRequestResults] = useState<ResultsMap>({});
  const skipNextEffectRef = useRef(false);
  const sidePanelChatRef = useRef<{ openDrawer: (message: string) => void } | null>(null);
  const policyViewRef = useRef<any | null>(null);
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
    const { message } = extractPageContent(boxType, t, lang, customConfig);
    return message;
  };

  // Wrapper functions that disable auto carousel before updating editor content
  const handleModelTextChange = useCallback((value: string) => {
    disableAutoCarousel();
    setModelTextPersistent(value);
  }, [disableAutoCarousel, setModelTextPersistent]);

  const handlePolicyChange = useCallback((value: string) => {
    disableAutoCarousel();
    setPolicyPersistent(value);
  }, [disableAutoCarousel, setPolicyPersistent]);

  const handleRequestChange = useCallback((value: string) => {
    disableAutoCarousel();
    setRequestPersistent(value);
  }, [disableAutoCarousel, setRequestPersistent]);

  const handleCustomConfigChange = useCallback((value: string) => {
    disableAutoCarousel();
    setCustomConfigPersistent(value);
  }, [disableAutoCarousel, setCustomConfigPersistent]);

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
  const iconFilterClass = theme === 'dark' ? '' : 'filter invert';

  useEffect(() => {
    // Define a StateEffect and StateField to manage line decorations
    const setPolicyHighlights = StateEffect.define<any>();
    const policyHighlightsField = StateField.define<any>({
      create() {
        return Decoration.none;
      },
      update(value, tr) {
        for (const effect of tr.effects) {
          if (effect.is(setPolicyHighlights)) return effect.value;
        }
        if (tr.docChanged) return value.map(tr.changes);
        return value;
      },
      provide: (f) => {
        return EditorView.decorations.from(f);
      },
    });

    const handler = (e: any) => {
      const detail = e?.detail || { nodes: [], links: [] };
      const links = Array.isArray(detail.links) ? detail.links : [];
      if (!policyViewRef.current) return;
      try {
        const view = policyViewRef.current;

        // Ensure the field is installed on the editor (append once)
        let hasField = true;
        try {
          view.state.field(policyHighlightsField);
        } catch (err) {
          hasField = false;
        }
        if (!hasField) {
          view.dispatch({ effects: StateEffect.appendConfig.of([policyHighlightsField]) });
        }

        // Clear previous decorations if no links
        if (!links || links.length === 0) {
          view.dispatch({ effects: setPolicyHighlights.of(Decoration.none) });
          return;
        }

        const doc = view.state.doc;
        const decos: any[] = [];
        links.forEach((idx: number) => {
          if (typeof idx !== 'number') return;
          const lineNumber = idx + 1; // parser uses 0-based index
          if (lineNumber < 1 || lineNumber > doc.lines) return;
          const line = doc.line(lineNumber);
          decos.push(Decoration.line({ class: 'policy-highlight-line' }).range(line.from));
        });

        const set = Decoration.set(decos, true);
        view.dispatch({ effects: setPolicyHighlights.of(set) });
      } catch (err) {
        // ignore DOM errors
      }
    };

    document.addEventListener('role-graph-selection', handler as EventListener);
    return () => {
      document.removeEventListener('role-graph-selection', handler as EventListener);
    };
  }, []);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <Toaster position="top-center" />
      {/* Header with Casbin logo and Policy Editor text */}
      <div
        className={clsx(
          'flex items-center gap-3 px-4 py-2 border-b border-border',
          theme === 'dark' ? 'bg-slate-900' : 'bg-white',
        )}
      >
        <img
          src="https://cdn.casbin.org/img/casbin_logo_1024x256.png"
          alt="Casbin Logo"
          className="h-8 w-auto"
        />
        <span className={clsx('text-xl font-semibold', textClass)}>{t('Policy Editor')}</span>
        <a
          href="/gallery"
          className={clsx(
            'ml-auto px-4 py-2 rounded-lg font-medium transition-all duration-200',
            'bg-primary text-primary-foreground',
            'hover:bg-primary/90 shadow-sm hover:shadow-md',
            'flex items-center gap-2',
          )}
        >
          <img src="/modelGallery.svg" alt="Model Gallery" className={clsx('w-5 h-5', iconFilterClass)} />
          <span>{t('Model Gallery')}</span>
        </a>
      </div>
      {/* Main content area */}
      <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
        {/* Mobile sidebar toggle - shown only on mobile when showCustomConfig is true */}
        {showCustomConfig && (
          <div className="sm:hidden border-r border-border shadow-sm">
            <div className="flex flex-col h-full w-full">
              <CustomConfigPanel
                showCustomConfig={showCustomConfig}
                customConfig={customConfig}
                setCustomConfigPersistent={handleCustomConfigChange}
                textClass={textClass}
                t={t}
                policy={policy}
                modelKind={modelKind}
              />
            </div>
          </div>
        )}
        
        {/* Desktop layout with resizable panels */}
        <div className="hidden sm:flex flex-1 overflow-hidden">
          <PanelGroup direction="horizontal" className="flex-1">
            {/* Sidebar Panel */}
            <Panel 
              defaultSize={25} 
              minSize={15} 
              maxSize={50}
              className="border-r border-border shadow-sm"
            >
              <div className="relative flex flex-col h-full w-full">
                <CustomConfigPanel
                  showCustomConfig={true}
                  customConfig={customConfig}
                  setCustomConfigPersistent={handleCustomConfigChange}
                  textClass={textClass}
                  t={t}
                  policy={policy}
                  modelKind={modelKind}
                />
              </div>
            </Panel>
            <PanelResizeHandle className="w-2 flex items-center justify-center cursor-col-resize hover:bg-primary/10 transition-colors group">
              <div className="h-16 w-1 rounded-full bg-border group-hover:bg-primary/50 transition-colors" />
            </PanelResizeHandle>
            
            {/* Main Editor Panel */}
            <Panel defaultSize={75} minSize={50}>
              <div className="flex flex-col h-full min-w-0">
                <div className="flex flex-col sm:flex-row gap-2 pt-4 px-2 flex-1 overflow-hidden min-w-0">
                  <div className="flex-1 flex flex-col h-full overflow-hidden">
                    <div className={clsx('h-10 pl-2', 'flex items-center justify-start gap-2')}>
                      <div className={clsx(textClass, 'font-bold text-lg')}>{t('Model')}</div>
                      <ModelToolbar
                        modelKind={modelKind}
                        setModelKind={setModelKind}
                        setRequestResults={setRequestResults}
                        setModelTextPersistent={setModelTextPersistent}
                      />
                    </div>

                    <div className="flex-grow overflow-auto h-full rounded-lg border border-border shadow-sm bg-white dark:bg-slate-800">
                      <div className="flex flex-col h-full">
                        <CodeMirror
                          height="100%"
                          theme={monokai}
                          onChange={handleModelTextChange}
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
                            buttonPlugin(openDrawerWithMessage, extractContent, 'model', t),
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
                    <div className="h-10 pl-2 font-bold text-lg flex items-center justify-between">
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
                    <div className="flex-grow overflow-auto h-full rounded-lg border border-border shadow-sm bg-white dark:bg-slate-800">
                      <div className="flex flex-col h-full">
                        <CodeMirror
                          height="100%"
                          extensions={[
                            basicSetup,
                            CasbinPolicySupport(),
                            indentUnit.of('    '),
                            EditorView.lineWrapping,
                            buttonPlugin(openDrawerWithMessage, extractContent, 'policy', t),
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
                          onChange={handlePolicyChange}
                          onCreateEditor={(view) => {
                            policyViewRef.current = view;
                          }}
                          className={'function flex-grow h-[300px]'}
                          value={policy}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 pt-2 px-2 flex-1 overflow-hidden min-w-0">
                  <div className="flex-1 flex flex-col h-full overflow-hidden">
                    <div className={clsx('h-10 pl-2', 'flex items-center justify-start gap-3')}>
                      <div className={clsx(textClass, 'font-bold text-lg')}>{t('Request')}</div>
                      <RequestToolbar
                        setupEnforceContextData={setupEnforceContextData}
                        setupHandleEnforceContextChange={setupHandleEnforceContextChange}
                        setRequestPersistent={setRequestPersistent}
                      />
                    </div>
                    <div className="flex-grow overflow-auto h-full rounded-lg border border-border shadow-sm bg-white dark:bg-slate-800">
                      <div className="flex flex-col h-full">
                        <CodeMirror
                          height="100%"
                          theme={monokai}
                          onChange={handleRequestChange}
                          extensions={[
                            basicSetup,
                            CasbinPolicySupport(),
                            indentUnit.of('    '),
                            EditorView.lineWrapping,
                            buttonPlugin(openDrawerWithMessage, extractContent, 'request', t),
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
                    <div className={clsx('h-10 pl-2 font-bold text-lg', 'flex items-center justify-between')}>
                      <div className={textClass}>{t('Enforcement Result')}</div>
                      <div className="mr-4">
                        <button
                          className={clsx(
                            'px-3 py-1.5 rounded-lg',
                            'text-primary border border-primary',
                            'bg-secondary hover:bg-primary hover:text-primary-foreground',
                            'transition-all duration-200',
                            'shadow-sm hover:shadow-md',
                            'font-medium text-sm',
                            'flex items-center gap-2',
                          )}
                          onClick={() => {
                            if (sidePanelChatRef.current) {
                              sidePanelChatRef.current.openDrawer('');
                            }
                          }}
                        >
                          <HelpCircle className="w-4 h-4" />
                          <span>{t('Explain it')}</span>
                        </button>
                      </div>
                    </div>
                    <div className="flex-grow overflow-auto h-full rounded-lg border border-border shadow-sm bg-white dark:bg-slate-800">
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
                            buttonPlugin(openDrawerWithMessage, extractContent, 'enforcementResult', t),
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
                  requestResult={requestResult}
                />
              </div>
            </Panel>
          </PanelGroup>
        </div>
        
        {/* Mobile main editor - shown when sidebar is not visible on mobile */}
        {!showCustomConfig && (
          <div className="sm:hidden flex flex-col h-full min-w-0 w-full">
            <div className="flex flex-col sm:flex-row gap-2 pt-4 px-2 flex-1 overflow-hidden min-w-0">
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                <div className={clsx('h-10 pl-2', 'flex items-center justify-start gap-2')}>
                  <div className={clsx(textClass, 'font-bold text-lg')}>{t('Model')}</div>
                  <ModelToolbar
                    modelKind={modelKind}
                    setModelKind={setModelKind}
                    setRequestResults={setRequestResults}
                    setModelTextPersistent={setModelTextPersistent}
                  />
                  <div className="ml-auto mr-2">
                    <button
                      className={clsx(
                        'rounded-lg',
                        'flex items-center justify-center',
                        'border border-primary',
                        'text-primary',
                        'bg-secondary',
                        'hover:bg-primary hover:text-primary-foreground',
                        'transition-all duration-200',
                        'shadow-sm hover:shadow-md',
                        'p-2',
                      )}
                      onClick={() => {
                        return setShowCustomConfig(!showCustomConfig);
                      }}
                    >
                      <ChevronLeft
                        className={clsx('h-5 w-5')}
                        style={{
                          transform: showCustomConfig ? 'rotateZ(90deg)' : 'rotateZ(-90deg)',
                        }}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex-grow overflow-auto h-full rounded-lg border border-border shadow-sm bg-white dark:bg-slate-800">
                  <div className="flex flex-col h-full">
                    <CodeMirror
                      height="100%"
                      theme={monokai}
                      onChange={handleModelTextChange}
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
                        buttonPlugin(openDrawerWithMessage, extractContent, 'model', t),
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
                <div className="h-10 pl-2 font-bold text-lg flex items-center justify-between">
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
                <div className="flex-grow overflow-auto h-full rounded-lg border border-border shadow-sm bg-white dark:bg-slate-800">
                  <div className="flex flex-col h-full">
                    <CodeMirror
                      height="100%"
                      extensions={[
                        basicSetup,
                        CasbinPolicySupport(),
                        indentUnit.of('    '),
                        EditorView.lineWrapping,
                        buttonPlugin(openDrawerWithMessage, extractContent, 'policy', t),
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
                      onChange={handlePolicyChange}
                      className={'function flex-grow h-[300px]'}
                      value={policy}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-2 px-2 flex-1 overflow-hidden min-w-0">
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                <div className={clsx('h-10 pl-2', 'flex items-center justify-start gap-3')}>
                  <div className={clsx(textClass, 'font-bold text-lg')}>{t('Request')}</div>
                  <RequestToolbar
                    setupEnforceContextData={setupEnforceContextData}
                    setupHandleEnforceContextChange={setupHandleEnforceContextChange}
                    setRequestPersistent={setRequestPersistent}
                  />
                </div>
                <div className="flex-grow overflow-auto h-full rounded-lg border border-border shadow-sm bg-white dark:bg-slate-800">
                  <div className="flex flex-col h-full">
                    <CodeMirror
                      height="100%"
                      theme={monokai}
                      onChange={handleRequestChange}
                      extensions={[
                        basicSetup,
                        CasbinPolicySupport(),
                        indentUnit.of('    '),
                        EditorView.lineWrapping,
                        buttonPlugin(openDrawerWithMessage, extractContent, 'request', t),
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
                <div className={clsx('h-10 pl-2 font-bold text-lg', 'flex items-center justify-between')}>
                  <div className={textClass}>{t('Enforcement Result')}</div>
                  <div className="mr-4">
                    <button
                      className={clsx(
                        'px-3 py-1.5 rounded-lg',
                        'text-primary border border-primary',
                        'bg-secondary hover:bg-primary hover:text-primary-foreground',
                        'transition-all duration-200',
                        'shadow-sm hover:shadow-md',
                        'font-medium text-sm',
                        'flex items-center gap-2',
                      )}
                      onClick={() => {
                        if (sidePanelChatRef.current) {
                          sidePanelChatRef.current.openDrawer('');
                        }
                      }}
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>{t('Explain it')}</span>
                    </button>
                  </div>
                </div>
                <div className="flex-grow overflow-auto h-full rounded-lg border border-border shadow-sm bg-white dark:bg-slate-800">
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
                        buttonPlugin(openDrawerWithMessage, extractContent, 'enforcementResult', t),
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
              requestResult={requestResult}
            />
          </div>
        )}
        
        <SidePanelChat
          ref={sidePanelChatRef}
          customConfig={customConfig}
        />
      </div>
    </div>
  );
};
