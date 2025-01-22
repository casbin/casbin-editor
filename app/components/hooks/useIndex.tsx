import React, { isValidElement, ReactNode, useEffect, useRef, useState } from 'react';
import { defaultCustomConfig, defaultEnforceContext, example } from '@/app/components/editor/casbin-mode/example';
import { ShareFormat } from '@/app/components/hooks/useShareInfo';
import { defaultEnforceContextData } from '@/app/components/hooks/useSetupEnforceContext';

export default function useIndex() {
  const [modelKind, setModelKind] = useState('basic');
  const [modelText, setModelText] = useState('');
  const [policy, setPolicy] = useState('');
  const [request, setRequest] = useState('');
  const [echo, setEcho] = useState<ReactNode>(<></>);
  const [requestResult, setRequestResult] = useState('');
  const [customConfig, setCustomConfig] = useState('');
  const [share, setShare] = useState('');
  const [enforceContextData, setEnforceContextData] = useState(new Map(defaultEnforceContextData));
  const [selectedEngine, setSelectedEngine] = useState('node');
  const [comparisonEngines, setComparisonEngines] = useState<string[]>([]);
  const loadState = useRef<{
    loadedHash?: string;
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

  const updateAllStates = (newModelKind: string, shared?: ShareFormat) => {
    const modelKindToUse = shared?.modelKind && shared.modelKind in example ? shared.modelKind : newModelKind;

    setModelKind(modelKindToUse);
    setPolicy(shared?.policy ?? example[modelKindToUse].policy);
    setModelText(shared?.model ?? example[modelKindToUse].model);
    setRequest(shared?.request ?? example[modelKindToUse].request);
    setCustomConfig(shared?.customConfig ?? defaultCustomConfig);
    setEnforceContextData(
      new Map(Object.entries(JSON.parse(shared?.enforceContext || example[modelKindToUse].enforceContext || defaultEnforceContext))),
    );

    if (shared?.selectedEngine) {
      setSelectedEngine(shared.selectedEngine);
    }
    if (shared?.comparisonEngines) {
      setComparisonEngines(shared.comparisonEngines);
    }
  };

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
          updateAllStates('basic', JSON.parse(content) as ShareFormat);
          setEcho(<div className="text-green-500">Shared Content Loaded.</div>);
        })
        .catch((error) => {
          return setEcho(<div className="text-red-500">Failed to load: {error}</div>);
        });
    }
  }, []);

  useEffect(() => {
    if (!modelText && !policy && !request) {
      updateAllStates(modelKind);
    }
  }, [modelKind, modelText, policy, request]);

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
    modelKind,
    setModelKind: (newModelKind: string) => {
      return updateAllStates(newModelKind);
    },
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
    selectedEngine,
    setSelectedEngine,
    comparisonEngines,
    setComparisonEngines,
  };
}
