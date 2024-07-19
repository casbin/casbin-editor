'use client';
import React, { isValidElement, useState, useEffect, useRef } from 'react';
import { example, ModelKind } from './casbin-mode/example';
import { e, m, p, r } from '@/app/components/editor/hooks/useSetupEnforceContext';
import { clsx } from 'clsx';
import CodeMirror from '@uiw/react-codemirror';
import { monokai } from '@uiw/codemirror-theme-monokai';
import { basicSetup } from 'codemirror';
import { indentUnit, StreamLanguage } from '@codemirror/language';
import { go } from '@codemirror/legacy-modes/mode/go';
import { EditorView } from '@codemirror/view';
import { CasbinConfSupport } from '@/app/components/editor/casbin-mode/casbin-conf';
import { CasbinPolicySupport } from '@/app/components/editor/casbin-mode/casbin-csv';
import { Config } from 'casbin';
import { javascriptLanguage } from '@codemirror/lang-javascript';
import useRunTest from '@/app/components/editor/hooks/useRunTest';
import useShareInfo from '@/app/components/editor/hooks/useShareInfo';
import useCopy from '@/app/components/editor/hooks/useCopy';
import useSetupEnforceContext from '@/app/components/editor/hooks/useSetupEnforceContext';
import useIndex from '@/app/components/editor/hooks/useIndex';
import SidePanelChat from '@/app/components/SidePanelChat';
import { extractPageContent } from '../../utils/contentExtractor';
import { buttonPlugin } from './ButtonPlugin';
import { useLang } from '@/app/context/LangContext';
import LanguageMenu from '@/app/components/LanguageMenu';

export const EditorScreen = () => {
  const {
    modelKind, setModelKind, modelText, setModelText, policy, setPolicy, request,
    setRequest, echo, setEcho, requestResult, setRequestResult, customConfig, setCustomConfig, share, setShare,
    enforceContextData, setEnforceContextData, setPolicyPersistent, setModelTextPersistent,
    setCustomConfigPersistent, setRequestPersistent, setEnforceContextDataPersistent, handleShare,
  } = useIndex();  
  const [open, setOpen] = useState(true);
  const { enforcer } = useRunTest();
  const { shareInfo } = useShareInfo();
  const { copy } = useCopy();
  const { setupEnforceContextData, setupHandleEnforceContextChange } = useSetupEnforceContext({
    onChange: setEnforceContextDataPersistent,
    data: enforceContextData,
  });
  const [casbinVersion, setCasbinVersion] = useState('');
  const sidePanelChatRef = useRef<{ openDrawer: (message: string) => void } | null>(null);
  const openDrawerWithMessage = (message: string) => {
    if (sidePanelChatRef.current) {
      sidePanelChatRef.current.openDrawer(message);
    }
  };
  const extractContent = (boxType: string) => {
    const { message } = extractPageContent(boxType, t);
    return message;
  };
  const { t } = useLang();

  useEffect(() => {
    const fetchCasbinVersion = async () => {
      const response = await fetch('casbin-version.json');
      const data = await response.json();
      setCasbinVersion(data.casbinVersion);
    };
    fetchCasbinVersion();
  }, []);

  useEffect(() => {
    if (modelKind) {
      enforcer({
        modelKind,
        model: modelText,
        policy,
        customConfig,
        request,
        enforceContextData,
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
  }, [modelKind, modelText, policy, customConfig, request, enforceContextData, enforcer, setEcho, setRequestResult]);

  return (
    <div className="flex flex-row h-full">
      <div className={clsx(open ? 'w-72' : 'w-5', 'relative', 'pl-2 pr-2 border-r border-[#dddddd]')}>
        <div className="flex flex-col h-full">
          <button
            className={clsx(
              'absolute top-.5 right-0 translate-x-1/2',
              'h-7 w-7',
              'bg-[#ffffff]',
              'border-[1.5px] rounded-full',
              'flex items-center justify-center',
            )}
            onClick={() => {
              return setOpen(!open);
            }}
          >
            <svg
              className={clsx('h-8 w-8', '')}
              style={{
                transform: open ? 'rotateZ(0deg)' : 'rotateZ(180deg)',
              }}
              viewBox="0 0 24 24"
            >
              <path fill={'currentColor'} d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
            </svg>
          </button>

          <div className={'pt-6 h-12 flex items-center font-bold'}>{open && <div>{t('Custom config')}</div>}</div>
          <div className="flex-grow overflow-auto h-full">
            {open && (
              <div className="flex flex-col h-full">
                <CodeMirror
                  height="100%"
                  onChange={setCustomConfigPersistent}
                  theme={monokai}
                  basicSetup={{
                    lineNumbers: true,
                    highlightActiveLine: true,
                    bracketMatching: true,
                    indentOnInput: true,
                  }}
                  extensions={[basicSetup, StreamLanguage.define(go), indentUnit.of('    '), EditorView.lineWrapping]}
                  className="function flex-grow"
                  value={customConfig}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={clsx('flex flex-col grow h-full')}>
        <div className="flex flex-row gap-1 pt-4 flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className={clsx('h-10 pl-2', 'flex items-center justify-start gap-2')}>
              <div className={'font-bold'}>{t('Model')}</div>
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
                      {example[n as ModelKind].name}
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
                  ]}
                  className={'function flex-grow'}
                  value={modelText}
                />
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="h-10 font-bold flex items-center justify-between">
              <div>{t('Policy')}</div>
              <div className="text-right font-bold mr-4 text-sm text-[#e13c3c]">
                <a href={`https://github.com/casbin/node-casbin/releases/tag/v${casbinVersion}`} target="_blank" rel="noopener noreferrer">
                  Node-Casbin v{casbinVersion}
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
                  className={'function flex-grow '}
                  value={policy}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-1 pt-2 flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className={clsx('h-10 pl-2', 'flex items-center justify-start gap-3')}>
              <div className={'font-bold'}>{t('Request')}</div>
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
                  className={'function flex-grow '}
                  value={request}
                />
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className={clsx('h-10 font-bold', 'flex items-center justify-between')}>
              <div>{t('Enforcement Result')}</div>
              <div className="mr-4">
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
                  ]}
                  basicSetup={{
                    lineNumbers: true,
                    highlightActiveLine: true,
                    bracketMatching: true,
                    indentOnInput: true,
                  }}
                  className={'cursor-not-allowed flex-grow'}
                  value={requestResult}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={clsx('pt-2 px-1 flex items-center')}>
          <button
            className={clsx(
              'rounded',
              'px-2 py-1',
              'border border-[#453d7d]',
              'bg-[#efefef]',
              'text-[#453d7a]',
              'hover:bg-[#453d7d] hover:text-white',
              'transition-colors duration-500',
            )}
            style={{ marginRight: 8 }}
            onClick={() => {
              try {
                Config.newConfigFromText(modelText);
                setEcho(<div>Passed</div>);
              } catch (e) {
                setEcho(<div>{(e as any).message}</div>);
              }
            }}
          >
            {t('SYNTAX VALIDATE')}
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
            style={{ marginRight: 8 }}
            onClick={() => {
              return enforcer({
                modelKind,
                model: modelText,
                policy,
                customConfig,
                request,
                enforceContextData,
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
            }}
          >
            {t('RUN THE TEST')}
          </button>
          {!share ? (
            <span>
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
                style={{ marginRight: 8 }}
                onClick={() => {
                  return shareInfo({
                    onResponse: (v) => {
                      return handleShare(v);
                    },
                    modelKind,
                    model: modelText,
                    policy,
                    customConfig,
                    request,
                    requestResult: Array.from(enforceContextData.entries()),
                  });
                }}
              >
                {t('SHARE')}
              </button>
            </span>
          ) : (
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
              style={{ marginRight: 8 }}
              onClick={() => {
                return copy(
                  () => {
                    setShare('');
                    setEcho(<div>{t('Copied')}</div>);
                  },
                  `${window.location.origin + window.location.pathname}#${share}`,
                );
              }}
            >
              {t('COPY')}
            </button>
          )}
          <div style={{ display: 'inline-block', marginRight: 'auto' }}>{echo}</div>
          <div className="mr-3">
            <LanguageMenu />
          </div>
        </div>
      </div>
    </div>
  );
};
