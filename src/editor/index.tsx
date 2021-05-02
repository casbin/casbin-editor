import React, { isValidElement, useState } from 'react';
import SelectModel from './select-model';
import { Button, EditorContainer, FlexRow, HeaderTitle } from '../ui';
import { getSelectedModel, reset } from './persist';
import { ModelEditor, PolicyEditor, RequestEditor, RequestResultEditor } from './editor';
import Syntax from './syntax';
import RunTest from './run-test';
import { ModelKind } from './casbin-mode/example';
import { Settings } from './settings';
import styled from 'styled-components';
import { useLocalStorage } from './use-local-storage';

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
          <div style={{ display: 'inline-block' }}>{echo}</div>
        </div>
      </div>
    </Container>
  );
};
