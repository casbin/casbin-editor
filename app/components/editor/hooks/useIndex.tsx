import React, { isValidElement, ReactNode, useEffect, useRef, useState } from 'react';
import { defaultCustomConfig, defaultEnforceContext, example, ModelKind } from '@/app/components/editor/casbin-mode/example';
import { ShareFormat } from '@/app/components/editor/hooks/useShareInfo';
import { defaultEnforceContextData } from '@/app/components/editor/hooks/useSetupEnforceContext';

export default function useIndex() {
  const [modelKind, setModelKind] = useState<ModelKind>('basic');
  const [modelText, setModelText] = useState('');
  const [policy, setPolicy] = useState('');
  const [request, setRequest] = useState('');
  const [echo, setEcho] = useState<ReactNode>(<></>);
  const [requestResult, setRequestResult] = useState('');
  const [customConfig, setCustomConfig] = useState('');
  const [share, setShare] = useState('');
  const [enforceContextData, setEnforceContextData] = useState(new Map(defaultEnforceContextData));
  const loadState = useRef<{
    loadedHash?: string;
    content?: ShareFormat;
  }>({});

  function setPolicyPersistent(text: string): void {
    setPolicy(text);
  }

  function setModelTextPersistent(text: string): void {
    setModelText(text);
  }

  function setCustomConfigPersistent(text: string): void {
    setCustomConfig(text);
  }

  function setRequestPersistent(text: string): void {
    setRequest(text);
  }

  function setEnforceContextDataPersistent(map: Map<string, string>): void {
    const text = JSON.stringify(Object.fromEntries(map));
    setEnforceContextData(new Map(map));
  }

  // Load shared content from dpaste.com
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && hash !== loadState.current.loadedHash) {
      loadState.current.loadedHash = hash;
      setEcho(<div className="text-orange-500">Loading Shared Content...</div>);
      fetch(`https://dpaste.com/${hash}.txt`)
        .then((resp) => {
          return resp.ok ? resp.text() : Promise.reject(`HTTP error: ${resp.status}`);
        })
        .then((content) => {
          const parsed = JSON.parse(content) as ShareFormat;
          loadState.current.content = parsed;
          const newModelKind = parsed?.modelKind && parsed.modelKind in example ? (parsed.modelKind as ModelKind) : 'basic';
          setModelKind(newModelKind);
          setEcho(<div className="text-green-500">Shared Content Loaded.</div>);
        })
        .catch((error) => {
          return setEcho(<div className="text-red-500">Failed to load: {error}</div>);
        });
    }
  }, []);

  // Set the editor content based on the shared content
  useEffect(() => {
    const shared = loadState.current.content;
    setPolicy(shared?.policy ?? example[modelKind].policy);
    setModelText(shared?.model ?? example[modelKind].model);
    setRequest(shared?.request ?? example[modelKind].request);
    setCustomConfig(shared?.customConfig ?? defaultCustomConfig);
    setEnforceContextData(new Map(Object.entries(JSON.parse(example[modelKind].enforceContext || defaultEnforceContext))));
    loadState.current.content = undefined;
  }, [modelKind]);

  function handleShare(v: ReactNode | string) {
    if (isValidElement(v)) {
      setEcho(v);
    } else {
      const currentPath = window.location.origin + window.location.pathname;
      setShare(v as string);
      setEcho(<div className="text-green-500">{`Shared at ${currentPath}#${v}`}</div>);
    }
  }

  return {
    modelKind, setModelKind, modelText, setModelText, policy, setPolicy, request,
    setRequest, echo, setEcho, requestResult, setRequestResult, customConfig, setCustomConfig, share, setShare,
    enforceContextData, setEnforceContextData, setPolicyPersistent, setModelTextPersistent,
    setCustomConfigPersistent, setRequestPersistent, setEnforceContextDataPersistent, handleShare,
  } ;
}
