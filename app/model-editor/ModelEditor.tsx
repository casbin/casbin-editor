'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { clsx } from 'clsx';
import { newModel } from 'casbin';
import CodeMirror from '@uiw/react-codemirror';
import { monokai } from '@uiw/codemirror-theme-monokai';
import { basicSetup } from 'codemirror';
import { indentUnit } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { linter, lintGutter } from '@codemirror/lint';
import { CasbinConfSupport } from '@/app/components/editor/casbin-mode/casbin-conf';
import { example } from '@/app/components/editor/casbin-mode/example';
import SidePanelChat from '@/app/components/editor/panels/SidePanelChat';
import { buttonPlugin } from '@/app/components/editor/plugins/ButtonPlugin';
import { extractPageContent } from '@/app/utils/contentExtractor';
import { casbinLinter } from '@/app/utils/casbinLinter';
import { parseError, setError } from '@/app/utils/errorManager';
import { useLang } from '@/app/context/LangContext';

export const ModelEditor = () => {
  const [modelText, setModelText] = useState('');
  const [modelKind, setModelKind] = useState('');
  const [initialText, setInitialText] = useState('');
  const editorRef = useRef<EditorView | null>(null);
  const cursorPosRef = useRef<{ from: number; to: number } | null>(null);
  const sidePanelChatRef = useRef<{ openDrawer: (message: string) => void } | null>(null);
  const { t, lang, theme, setLang } = useLang();
  const textClass = clsx(theme === 'dark' ? 'text-gray-200' : 'text-gray-800');

  const openDrawerWithMessage = (message: string) => {
    if (sidePanelChatRef.current) {
      sidePanelChatRef.current.openDrawer(message);
    }
  };

  const extractContent = (boxType: string) => {
    const { message } = extractPageContent(boxType, t, lang);
    return message;
  };

  const validateModel = useCallback(async (text: string) => {
    try {
      await newModel(text);
      setError(null);
    } catch (e) {
      setError(parseError((e as Error).message));
    }
  }, []);

  useEffect(() => {
    validateModel(modelText);
  }, [modelText, validateModel]);

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      if (event.data.type === 'initializeModel') {
        if (event.data.modelText) {
          setModelText(event.data.modelText);
          setInitialText(event.data.modelText);
        }
        if (event.data.lang) {
          setLang(event.data.lang);
        }
      } else if (event.data.type === 'getModelText') {
        window.parent.postMessage(
          {
            type: 'modelUpdate',
            modelText: modelText,
          },
          '*',
        );
      } else if (event.data.type === 'updateModelText') {
        if (event.data.modelText) {
          setModelText(event.data.modelText);
        }
      } else if (event.data.type === 'updateLanguage') {
        if (event.data.language) {
          setLang(event.data.language);
        }
      }
    },
    [modelText, setLang],
  );

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    window.parent.postMessage({ type: 'iframeReady' }, '*');

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage]);

  const handleModelTextChange = useCallback((value: string, viewUpdate: any) => {
    setModelText(value);
    cursorPosRef.current = viewUpdate.state.selection.main;
    window.parent.postMessage(
      {
        type: 'modelUpdate',
        modelText: value,
      },
      '*',
    );
  }, []);

  useEffect(() => {
    if (editorRef.current && cursorPosRef.current) {
      const { from, to } = cursorPosRef.current;
      const docLength = editorRef.current.state.doc.length;
      editorRef.current.dispatch({
        selection: {
          anchor: Math.min(from, docLength),
          head: Math.min(to, docLength),
        },
      });
    }
  }, [modelText]);

  useEffect(() => {
    if (modelKind && example[modelKind]) {
      setModelText(example[modelKind].model);
    }
  }, [modelKind]);

  return (
    <div className="flex-grow overflow-auto h-full">
      <div className="flex flex-col h-full">
        <div className={clsx('h-10 pl-2', 'flex items-center justify-start gap-2')}>
          <div className={clsx(textClass, 'font-bold')}>{t('Model')}</div>
          <select
            value={modelKind}
            onChange={(e) => {
              const selectedKind = e.target.value;
              if (selectedKind && example[selectedKind]) {
                setModelText(example[selectedKind].model);
                setModelKind('');
                window.parent.postMessage(
                  {
                    type: 'modelUpdate',
                    modelText: example[selectedKind].model,
                  },
                  '*',
                );
              }
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
                const rbacModel = example['rbac'].model;
                setModelText(rbacModel);
                setModelKind('');
                window.parent.postMessage(
                  {
                    type: 'modelUpdate',
                    modelText: rbacModel,
                  },
                  '*',
                );
              }
            }}
          >
            {t('RESET')}
          </button>
        </div>
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
            linter(casbinLinter),
            lintGutter(),
            buttonPlugin(openDrawerWithMessage, extractContent, 'model'),
            EditorView.updateListener.of((update) => {
              if (update.docChanged) {
                editorRef.current = update.view;
              }
            }),
          ]}
          className={'function flex-grow h-[300px]'}
          value={modelText}
        />
        <div className="mr-4">
          <SidePanelChat ref={sidePanelChatRef} />
        </div>
      </div>
    </div>
  );
};
