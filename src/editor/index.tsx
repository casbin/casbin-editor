import React, { isValidElement, useEffect, useState } from 'react';
import SelectModel from './select-model';
import { Button, Echo, EditorContainer, FlexRow, HeaderTitle } from '../ui';
import { getSelectedModel, reset } from './persist';
import { ModelEditor, PolicyEditor, RequestEditor, RequestResultEditor } from './editor';
import Syntax from './syntax';
import RunTest from './run-test';
import { ModelKind } from './casbin-mode/example';
import { Settings } from './settings';
import styled from 'styled-components';
import { useLocalStorage } from './use-local-storage';
import Share, { ShareFormat } from './share';

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

export const EditorScreen = () => {
  const [modelKind, setModelKind] = useState<ModelKind>(getSelectedModel());
  const [modelText, setModelText] = useState('');
  const [policy, setPolicy] = useState('');
  const [request, setRequest] = useState('');
  const [echo, setEcho] = useState<JSX.Element>(<></>);
  const [requestResult, setRequestResult] = useState('');
  const [enableABAC, setEnableABAC] = useLocalStorage(true, 'ENABLE_ABAC');

  const [customConfig, setCustomConfig] = useState('');

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setEcho(<Echo>Loading Shared Content...</Echo>);
      fetch(`https://dpaste.com/${hash}.txt`)
        .then(resp => resp.text())
        .then(content => {
          const sharedContent = JSON.parse(content) as ShareFormat;
          setPolicy(sharedContent.policy);
          setModelText(sharedContent.model);
          setCustomConfig(sharedContent.customConfig);
          setRequest(sharedContent.request);
          setEnableABAC(sharedContent.enableABAC);
          setRequestResult('');
          setEcho(<Echo>Shared Content Loaded.</Echo>);
        })
        .catch(() => {
          setEcho(<Echo type={'error'}>Failed to load Shared Content.</Echo>);
        });
    }
  }, []);

  return (
    <Container>
      <Settings
        modelKind={modelKind}
        enableABAC={enableABAC}
        onCustomConfigChange={v => {
          setCustomConfig(v);
        }}
        onEnableABAC={v => {
          setEnableABAC(v);
        }}
      />
      <div style={{ flex: 1 }}>
        <FlexRow>
          <EditorContainer>
            <FlexRow>
              <HeaderTitle>Model</HeaderTitle>
              <SelectModel
                onChange={value => {
                  setModelKind(value as ModelKind);
                }}
              />
              <Button
                onClick={() => {
                  const ok = window.confirm('Confirm Reset?');
                  if (ok) {
                    reset(modelKind);
                    window.location.reload();
                  }
                }}
                style={{ marginLeft: 8 }}
              >
                Reset
              </Button>
            </FlexRow>
            <ModelEditor modelKind={modelKind} onChange={setModelText} />
          </EditorContainer>
          <EditorContainer>
            <HeaderTitle>Policy</HeaderTitle>
            <PolicyEditor modelKind={modelKind} onChange={setPolicy} />
          </EditorContainer>
        </FlexRow>

        <FlexRow>
          <EditorContainer>
            <HeaderTitle>Request</HeaderTitle>
            <RequestEditor modelKind={modelKind} onChange={setRequest} />
          </EditorContainer>
          <EditorContainer>
            <HeaderTitle>Enforcement Result</HeaderTitle>
            <RequestResultEditor value={requestResult} />
          </EditorContainer>
        </FlexRow>

        <div style={{ padding: 8 }}>
          <Syntax model={modelText} onResponse={component => setEcho(component)} />
          <RunTest
            modelKind={modelKind}
            model={modelText}
            policy={policy}
            customConfig={customConfig}
            request={request}
            parseABAC={enableABAC}
            onResponse={v => {
              if (isValidElement(v)) {
                setEcho(v);
              } else if (Array.isArray(v)) {
                setRequestResult(v.join('\n'));
              }
            }}
          />
          <Share
            onResponse={v => setEcho(v)}
            model={modelText}
            policy={policy}
            customConfig={customConfig}
            request={request}
            enableABAC={enableABAC}
          />
          <div style={{ display: 'inline-block' }}>{echo}</div>
        </div>
      </div>
    </Container>
  );
};
