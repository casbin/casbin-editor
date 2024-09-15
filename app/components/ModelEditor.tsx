'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { monokai } from '@uiw/codemirror-theme-monokai';
import { basicSetup } from 'codemirror';
import { indentUnit } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { CasbinConfSupport } from '@/app/components/editor/casbin-mode/casbin-conf';
import { linter } from '@codemirror/lint';
import { casbinLinter } from '@/app/utils/casbinLinter';
import { newModel } from 'casbin';
import { setError } from '@/app/utils/errorManager';

export const ModelEditor = () => {
  const [modelText, setModelText] = useState('');
  const editorRef = useRef<EditorView | null>(null);
  const cursorPosRef = useRef<{ from: number; to: number } | null>(null);

  const validateModel = useCallback(async (text: string) => {
    try {
      await newModel(text);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    validateModel(modelText);
  }, [modelText, validateModel]);

  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.data.type === 'initializeModel') {
      setModelText(event.data.modelText);
    } else if (event.data.type === 'getModelText') {
      window.parent.postMessage({
        type: 'modelUpdate',
        modelText: modelText
      }, '*');
    } else if (event.data.type === 'updateModelText') {
      setModelText(event.data.modelText);
    }
  }, [modelText]);

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
    window.parent.postMessage({
      type: 'modelUpdate',
      modelText: value
    }, '*');
  }, []);

  useEffect(() => {
    if (editorRef.current && cursorPosRef.current) {
      const { from, to } = cursorPosRef.current;
      const docLength = editorRef.current.state.doc.length;
      editorRef.current.dispatch({
        selection: { 
          anchor: Math.min(from, docLength), 
          head: Math.min(to, docLength) 
        }
      });
    }
  }, [modelText]);

  return (
    <div className="flex-grow overflow-auto h-full">
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
            linter(casbinLinter),
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
  );
};
