// Copyright 2024 The casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use client';
import React, { isValidElement, useState } from 'react';
import { example, ModelKind } from './casbin-mode/example';
import {
  e,
  m,
  p,
  r,
} from '@/app/components/editor/hooks/useSetupEnforceContext';

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

export const EditorScreen = () => {
  const {
    modelKind,
    setModelKind,
    modelText,
    setModelText,
    policy,
    setPolicy,
    request,
    setRequest,
    echo,
    setEcho,
    requestResult,
    setRequestResult,
    customConfig,
    setCustomConfig,
    share,
    setShare,
    enforceContextData,
    setEnforceContextData,
    setPolicyPersistent,
    setModelTextPersistent,
    setCustomConfigPersistent,
    setRequestPersistent,
    setEnforceContextDataPersistent,
    handleShare,
  } = useIndex();

  const [open, setOpen] = useState(true);
  const { enforcer } = useRunTest();
  const { shareInfo } = useShareInfo();
  const { copy } = useCopy();
  const { setupEnforceContextData, setupHandleEnforceContextChange } =
    useSetupEnforceContext({
      onChange: setEnforceContextDataPersistent,
      data: enforceContextData,
    });

  return (
    <div className={clsx('flex flex-row  gap-1')}>
      <div className={'w-64'}>
        <div>
          <div className={'h-10 flex items-center justify-center '}>
            <span>Custom config</span>
            <div
              className={'h-10 w-10'}
              onClick={() => {
                return setOpen(!open);
              }}
            >
              <svg
                style={{
                  width: '100%',
                  height: '100%',
                  transform: open ? 'rotateZ(0deg)' : 'rotateZ(180deg)',
                }}
                viewBox="0 0 24 24"
              >
                <path
                  fill={'currentColor'}
                  d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"
                />
              </svg>
            </div>
          </div>
          <div>
            {open && (
              <div>
                <div style={{ height: '100%' }}>
                  <CodeMirror
                    onChange={setCustomConfigPersistent}
                    theme={monokai}
                    basicSetup={{
                      lineNumbers: true,
                      highlightActiveLine: true,
                      bracketMatching: true,
                      indentOnInput: true,
                    }}
                    extensions={[
                      basicSetup,
                      StreamLanguage.define(go),
                      indentUnit.of('    '),
                      EditorView.lineWrapping,
                    ]}
                    className={'function'}
                    value={customConfig}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={clsx('flex flex-col grow')}>
        <div className={clsx('flex flex-row  gap-1')}>
          <div className={'flex-1'}>
            <div>
              <div className={'flex flex-row items-center justify-center'}>
                <div className={'h-10 flex items-center justify-center '}>
                  Model
                </div>
                <select
                  defaultValue={'basic'}
                  onChange={(e) => {
                    const model = e.target.value;
                    setModelKind(model);
                  }}
                >
                  <option value="" disabled>
                    Select your model
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
                  onClick={() => {
                    const ok = window.confirm('Confirm Reset?');
                    if (ok) {
                      window.location.reload();
                    }
                  }}
                >
                  Reset
                </button>
              </div>
              <div style={{ height: '100%' }}>
                <CodeMirror
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
                  ]}
                  className={'function'}
                  value={modelText}
                />
              </div>
            </div>
          </div>
          <div className={'flex-1'}>
            <div>
              <div className={'h-10 flex items-center justify-center '}>
                Policy
              </div>
              <div style={{ height: '100%' }}>
                <CodeMirror
                  extensions={[
                    basicSetup,
                    CasbinPolicySupport(),
                    indentUnit.of('    '),
                    EditorView.lineWrapping,
                  ]}
                  basicSetup={{
                    lineNumbers: true,
                    highlightActiveLine: true,
                    bracketMatching: true,
                    indentOnInput: true,
                  }}
                  theme={monokai}
                  onChange={setPolicyPersistent}
                  className={'function'}
                  value={policy}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={'flex flex-row gap-1'}>
          <div className={'flex-1'}>
            <div>
              <div className={'h-10 flex items-center justify-center '}>
                <div>Request</div>
                <div className={''}>
                  <input
                    className={'w-10'}
                    value={setupEnforceContextData.get(r)}
                    placeholder={r}
                    onChange={(event) => {
                      return setupHandleEnforceContextChange(
                        r,
                        event.target.value,
                      );
                    }}
                  />
                  <input
                    className={'w-10'}
                    value={setupEnforceContextData.get(p)}
                    placeholder={p}
                    onChange={(event) => {
                      return setupHandleEnforceContextChange(
                        p,
                        event.target.value,
                      );
                    }}
                  />
                  <input
                    className={'w-10'}
                    value={setupEnforceContextData.get(e)}
                    placeholder={e}
                    onChange={(event) => {
                      return setupHandleEnforceContextChange(
                        e,
                        event.target.value,
                      );
                    }}
                  />
                  <input
                    className={'w-10'}
                    value={setupEnforceContextData.get(m)}
                    placeholder={m}
                    onChange={(event) => {
                      return setupHandleEnforceContextChange(
                        m,
                        event.target.value,
                      );
                    }}
                  />
                </div>
              </div>
              <div style={{ height: '100%' }}>
                <CodeMirror
                  theme={monokai}
                  onChange={(value) => {
                    setRequestPersistent(value);
                  }}
                  extensions={[
                    basicSetup,
                    CasbinPolicySupport(),
                    indentUnit.of('    '),
                    EditorView.lineWrapping,
                  ]}
                  basicSetup={{
                    lineNumbers: true,
                    highlightActiveLine: true,
                    bracketMatching: true,
                    indentOnInput: true,
                  }}
                  className={'function'}
                  value={request}
                />
              </div>
            </div>
          </div>
          <div className={'flex-1'}>
            <div>
              <div className={'h-10 flex items-center justify-center '}>
                Enforcement Result
              </div>
              <div>
                <CodeMirror
                  onChange={() => {
                    return;
                  }}
                  theme={monokai}
                  extensions={[
                    basicSetup,
                    javascriptLanguage,
                    indentUnit.of('    '),
                    EditorView.lineWrapping,
                  ]}
                  basicSetup={{
                    lineNumbers: true,
                    highlightActiveLine: true,
                    bracketMatching: true,
                    indentOnInput: true,
                  }}
                  value={requestResult}
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <button
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
            SYNTAX VALIDATE
          </button>
          <button
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
                    setRequestResult(v.join('\n'));
                  }
                },
              });
            }}
          >
            RUN THE TEST
          </button>
          {!share ? (
            <span>
              <button
                style={{ marginRight: 8 }}
                onClick={() => {
                  return shareInfo({
                    onResponse: (v) => {
                      return handleShare(v);
                    },
                    model: modelText,
                    policy,
                    customConfig,
                    request,
                    enforceContext: Object.entries(enforceContextData),
                  });
                }}
              >
                SHARE
              </button>
            </span>
          ) : (
            <button
              style={{ marginRight: 8 }}
              onClick={() => {
                return copy(
                  () => {
                    setShare('');
                    setEcho(<div>Copied.</div>);
                  },
                  `${window.location.origin + window.location.pathname}#${share}`,
                );
              }}
            >
              COPY
            </button>
          )}
          <div style={{ display: 'inline-block' }}>{echo}</div>
        </div>
      </div>
    </div>
  );
};
