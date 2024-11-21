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
  const lastHash = useRef<string>();

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

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && lastHash.current != hash) {
      lastHash.current = hash;
      setEcho(<div>Loading Shared Content...</div>);
      fetch(`https://dpaste.com/${hash}.txt`)
        .then((resp) => {
          if (!resp.ok) {
            throw new Error(`HTTP error! status: ${resp.status}`);
          }
          return resp.text();
        })
        .then((content) => {
          const sharedContent = JSON.parse(content) as ShareFormat;
          // Use empty string as default value with type checking
          setPolicyPersistent(sharedContent.policy ?? '');
          setModelTextPersistent(sharedContent.model ?? '');
          setCustomConfigPersistent(sharedContent.customConfig ?? '');
          setRequestPersistent(sharedContent.request ?? '');
          // Make sure it's a valid ModelKind type
          if (sharedContent.modelKind && example[sharedContent.modelKind as ModelKind]) {
            setModelKind(sharedContent.modelKind as ModelKind);
          } else {
            setModelKind('basic'); // Use Default
          }
          window.location.hash = ''; // prevent duplicate load
          setEcho(<div>Shared Content Loaded.</div>);
        })
        .catch((error) => {
          setEcho(<div>`Failed to load Shared Content.${error.message}`</div>);
        });
    }
  }, []);

  useEffect(() => {
    setPolicy(example[modelKind].policy);
    setModelText(example[modelKind].model);
    setRequest(example[modelKind].request);
    setCustomConfig(defaultCustomConfig);
    setEnforceContextData(new Map(Object.entries(JSON.parse(example[modelKind].enforceContext || defaultEnforceContext))));
  }, [modelKind]);

  function handleShare(v: ReactNode | string) {
    if (isValidElement(v)) {
      setEcho(v);
    } else {
      const currentPath = window.location.origin + window.location.pathname;
      setShare(v as string);
      setEcho(<div>{`Shared at ${currentPath}#${v}`}</div>);
    }
  }
  return {
    modelKind, setModelKind, modelText, setModelText, policy, setPolicy, request,
    setRequest, echo, setEcho, requestResult, setRequestResult, customConfig, setCustomConfig, share, setShare,
    enforceContextData, setEnforceContextData, setPolicyPersistent, setModelTextPersistent,
    setCustomConfigPersistent, setRequestPersistent, setEnforceContextDataPersistent, handleShare,
  } ;
}
