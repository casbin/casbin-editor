'use client';
import { useState, useEffect, useCallback } from 'react';
import { newModel } from 'casbin';
import { Toaster } from 'react-hot-toast';
import { ModelEditorSection } from '@/app/components/editor/ModelEditorSection';
import { example } from '@/app/components/editor/casbin-mode/example';
import { parseError, setError } from '@/app/utils/errorManager';
import { useLang } from '@/app/context/LangContext';

export const ModelEditor = () => {
  const [modelText, setModelText] = useState('');
  const [modelKind, setModelKind] = useState('');
  const { setLang } = useLang();

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

  const handleModelTextChange = useCallback((value: string) => {
    setModelText(value);
    window.parent.postMessage(
      {
        type: 'modelUpdate',
        modelText: value,
      },
      '*',
    );
  }, []);

  useEffect(() => {
    if (modelKind && example[modelKind]) {
      setModelText(example[modelKind].model);
    }
  }, [modelKind]);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <Toaster position="top-center" />
      <ModelEditorSection
        modelText={modelText}
        modelKind={modelKind}
        setModelKind={setModelKind}
        onModelTextChange={handleModelTextChange}
        showHeader={true}
        showSidePanel={true}
      />
    </div>
  );
};
