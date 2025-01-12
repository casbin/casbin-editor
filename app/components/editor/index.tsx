'use client';
import React, { isValidElement, useState, useEffect, useRef } from 'react';
import { example } from './casbin-mode/example';
import { e, m, p, r } from '@/app/components/editor/hooks/useSetupEnforceContext';
import { clsx } from 'clsx';
import CodeMirror from '@uiw/react-codemirror';
import { monokai } from '@uiw/codemirror-theme-monokai';
import { basicSetup } from 'codemirror';
import { indentUnit } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { CasbinConfSupport } from '@/app/components/editor/casbin-mode/casbin-conf';
import { CasbinPolicySupport } from '@/app/components/editor/casbin-mode/casbin-csv';
import { javascriptLanguage } from '@codemirror/lang-javascript';
import useRunTest from '@/app/components/editor/hooks/useRunTest';
import useShareInfo from '@/app/components/editor/hooks/useShareInfo';
import useSetupEnforceContext from '@/app/components/editor/hooks/useSetupEnforceContext';
import useIndex from '@/app/components/editor/hooks/useIndex';
import SidePanelChat from '@/app/components/SidePanelChat';
import { extractPageContent } from '../../utils/contentExtractor';
import { buttonPlugin } from './ButtonPlugin';
import { useLang } from '@/app/context/LangContext';
import LanguageMenu from '@/app/components/LanguageMenu';
import { linter, lintGutter } from '@codemirror/lint';
import { casbinLinter } from '@/app/utils/casbinLinter';
import { toast, Toaster } from 'react-hot-toast';
import { CustomConfigPanel } from './CustomConfigPanel';
import { loadingOverlay } from './LoadingOverlayExtension';
import useEngineVersions from './hooks/useEngineVersions';

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
  } = useIndex();
  const [open, setOpen] = useState(true);
  const { enforcer } = useRunTest();
  const { shareInfo } = useShareInfo();
  const { setupEnforceContextData, setupHandleEnforceContextChange } = useSetupEnforceContext({
    onChange: setEnforceContextDataPersistent,
    data: enforceContextData,
  });
  const [showCustomConfig, setShowCustomConfig] = useState(false);
  const sidePanelChatRef = useRef<{ openDrawer: (message: string) => void } | null>(null);
  const openDrawerWithMessage = (message: string) => {
    if (sidePanelChatRef.current) {
      sidePanelChatRef.current.openDrawer(message);
    }
  };
  const extractContent = (boxType: string) => {
    const { message } = extractPageContent(boxType, t, lang);
    return message;
  };
  const { t, lang, theme, toggleTheme } = useLang();
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [isEngineLoading, setIsEngineLoading] = useState(false);
  const skipNextEffectRef = useRef(false);
  const { javaVersion, goVersion, casbinVersion, engineGithubLinks } = useEngineVersions(isEngineLoading);

  useEffect(() => {
    if (modelKind && modelText) {
      if (skipNextEffectRef.current) {
        skipNextEffectRef.current = false;
        return;
      }
      setIsContentLoaded(true);
      enforcer({
        modelKind,
        model: modelText,
        policy,
        customConfig,
        request,
        enforceContextData,
        selectedEngine,
        onResponse: (v) => {
          if (isValidElement(v)) {
            setEcho(v);
          } else if (Array.isArray(v)) {
            const formattedResults = v.map((res) => {
              if (typeof res === 'object') {
                const reasonString = Array.isArray(res.reason) && res.reason.length > 0 ? ` Reason: ${JSON.stringify(res.reason)}` : '';
                return `${res.okEx}${reasonString}`;
              }
              return res;
            });
            setRequestResult(formattedResults.join('\n'));
          }
        },
      });
    }
  }, [modelKind, modelText, policy, customConfig, request, enforceContextData, enforcer, setEcho, setRequestResult, selectedEngine]);
  const textClass = clsx(theme === 'dark' ? 'text-gray-200' : 'text-gray-800');

  const runTest = async () => {
    await enforcer({
      model: modelText,
      modelKind,
      policy,
      customConfig,
      request,
      enforceContextData,
      selectedEngine,
      onResponse: (v: JSX.Element | any[]) => {
        if (isValidElement(v)) {
          setEcho(v);
          const props = (v as any).props;
          if (props.className?.includes('text-red-500')) {
            const errorMessage = props.children;
            toast.error(errorMessage);
            setRequestResult(errorMessage);
          }
        } else if (Array.isArray(v)) {
          const formattedResults = v.map((res) => {
            if (typeof res === 'object') {
              const reasonString = Array.isArray(res.reason) && res.reason.length > 0 ? ` Reason: ${JSON.stringify(res.reason)}` : '';
              return `${res.okEx}${reasonString}`;
            }
            return res;
          });
          const result = formattedResults.join('\n');
          setRequestResult(result);
          if (result && !result.includes('error')) {
            toast.success(t('Test completed successfully'));
          }
        }
      },
    });
  };

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
                }}
                className={'border-[#767676] border rounded'}
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
              <div className="text-right font-bold mr-4 text-sm flex items-center justify-end gap-2">
                <select
                  className="bg-transparent border border-[#e13c3c] rounded px-2 py-1 text-[#e13c3c] focus:outline-none"
                  value={selectedEngine}
                  onChange={(e) => {
                    setIsEngineLoading(true);
                    skipNextEffectRef.current = true;
                    setSelectedEngine(e.target.value);
                    enforcer({
                      modelKind,
                      model: modelText,
                      policy,
                      customConfig,
                      request,
                      enforceContextData,
                      selectedEngine: e.target.value,
                      onResponse: (v) => {
                        setIsEngineLoading(false);

                        if (isValidElement(v)) {
                          setEcho(v);
                        } else if (Array.isArray(v)) {
                          const formattedResults = v.map((res) => {
                            if (typeof res === 'object') {
                              const reasonString = Array.isArray(res.reason) && res.reason.length > 0 ? ` Reason: ${JSON.stringify(res.reason)}` : '';
                              return `${res.okEx}${reasonString}`;
                            }
                            return res;
                          });
                          setRequestResult(formattedResults.join('\n'));
                        }
                      },
                    });
                  }}
                >
                  <option value="node">Node-Casbin(NodeJs) v{casbinVersion}</option>
                  <option value="java">jCasbin(Java) v{javaVersion}</option>
                  <option value="go">Casbin(Go) v{goVersion}</option>
                </select>
                <a href={engineGithubLinks[selectedEngine]} target="_blank" rel="noopener noreferrer" className="text-[#e13c3c] hover:text-[#ff4d4d]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    {/* eslint-disable-next-line max-len */}
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
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
                    loadingOverlay(isEngineLoading),
                  ]}
                  basicSetup={{
                    lineNumbers: true,
                    highlightActiveLine: true,
                    bracketMatching: true,
                    indentOnInput: true,
                  }}
                  className={'cursor-not-allowed flex-grow h-[300px]'}
                  value={requestResult}
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
                });
              }}
            >
              {t('SHARE')}
            </button>
          </div>

          <div className="flex flex-row justify-between items-center w-full sm:w-auto sm:ml-auto mt-2 sm:mt-0">
            <div className={clsx(textClass)}>{echo}</div>

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
