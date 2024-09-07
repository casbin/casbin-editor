'use client';
import React, { useState, useEffect, useCallback } from 'react';
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

export const ModelEditor = ({ initialValue = '' }: { initialValue: string }) => {
  const [modelText, setModelText] = useState('');

  useEffect(() => {
    if (initialValue) {
      setModelText(initialValue);
    }
  }, [initialValue]);

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

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'getModelText') {
        window.parent.postMessage({
          type: 'modelUpdate',
          modelText: modelText
        }, '*');
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [modelText]);

  const handleModelTextChange = (value: string) => {
    setModelText(value);
  };

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
          ]}
          className={'function flex-grow h-[300px]'}
          value={modelText}
        />
      </div>
    </div>
  );
};
