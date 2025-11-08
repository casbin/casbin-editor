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
import { ModelToolbar } from '@/app/components/editor/panels/ModelToolbar';
import { buttonPlugin } from '@/app/components/editor/plugins/ButtonPlugin';
import { extractPageContent } from '@/app/utils/contentExtractor';
import { casbinLinter } from '@/app/utils/casbinLinter';
import { parseError, setError } from '@/app/utils/errorManager';
import { useLang } from '@/app/context/LangContext';

interface ModelEditorPanelProps {
  isIframeMode?: boolean;
  modelText?: string;
  onModelTextChange?: (text: string) => void;
}

export const ModelEditorPanel = ({ 
  isIframeMode = false,
  modelText: externalModelText,
  onModelTextChange
}: ModelEditorPanelProps) => {
  const [modelText, setModelText] = useState(externalModelText || '');
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

  // Iframe communication handling
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      if (!isIframeMode) return;

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
    [modelText, setLang, isIframeMode],
  );

  useEffect(() => {
    if (isIframeMode) {
      window.addEventListener('message', handleMessage);
      window.parent.postMessage({ type: 'iframeReady' }, '*');

      return () => {
        window.removeEventListener('message', handleMessage);
      };
    }
  }, [handleMessage, isIframeMode]);

  const handleModelTextChange = useCallback((value: string, viewUpdate: any) => {
    setModelText(value);
    cursorPosRef.current = viewUpdate.state.selection.main;
    
    if (onModelTextChange) {
      onModelTextChange(value);
    }

    if (isIframeMode) {
      window.parent.postMessage(
        {
          type: 'modelUpdate',
          modelText: value,
        },
        '*',
      );
    }
  }, [onModelTextChange, isIframeMode]);

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
      const newModelText = example[modelKind].model;
      setModelText(newModelText);
      
      if (isIframeMode) {
        window.parent.postMessage(
          {
            type: 'modelUpdate',
            modelText: newModelText,
          },
          '*',
        );
      }
    }
  }, [modelKind, isIframeMode]);

  // Sync external changes
  useEffect(() => {
    if (externalModelText !== undefined && externalModelText !== modelText) {
      setModelText(externalModelText);
    }
  }, [externalModelText, modelText]);

  const setModelTextPersistent = (value: string) => {
    setModelText(value);
    if (onModelTextChange) {
      onModelTextChange(value);
    }
    if (isIframeMode) {
      window.parent.postMessage(
        {
          type: 'modelUpdate',
          modelText: value,
        },
        '*',
      );
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className={clsx('h-10 pl-2', 'flex items-center justify-start gap-2')}>
        <div className={clsx(textClass, 'font-bold text-lg')}>{t('Model')}</div>
        <ModelToolbar
          modelKind={modelKind}
          setModelKind={setModelKind}
          setRequestResults={() => {}}
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
              buttonPlugin(openDrawerWithMessage, extractContent, 'model'),
              linter(casbinLinter),
              lintGutter(),
              EditorView.updateListener.of((update) => {
                if (update.docChanged) {
                  editorRef.current = update.view;
                }
              }),
            ]}
            className={'function flex-grow h-[300px]'}
            value={modelText}
          />
        </div>
      </div>
      {isIframeMode && (
        <div className="mr-4">
          <SidePanelChat ref={sidePanelChatRef} />
        </div>
      )}
    </div>
  );
};
