import React, { isValidElement, useEffect, useState } from 'react';
import SelectModel from './select-model';
import { Button, EditorContainer, FlexRow, HeaderTitle } from '../ui';
import { getSelectedModel, reset } from './persist';
import { CustomFunctionEditor, ModelEditor, PolicyEditor, RequestEditor, RequestResultEditor } from './editor';
import Syntax from './syntax';
import RunTest from './run-test';
import { ModelKind } from './casbin-mode/example';

export const EditorScreen = () => {
  const [modelKind, setModelKind] = useState<ModelKind>(getSelectedModel());
  const [modelText, setModelText] = useState('');
  const [policy, setPolicy] = useState('');
  const [customConfig, setCustomConfig] = useState('');
  const [request, setRequest] = useState('');
  const [echo, setEcho] = useState<JSX.Element>(<></>);
  const [requestResult, setRequestResult] = useState('');
  const [customConfigVisible, setCustomConfigVisible] = useState(true);

  useEffect(() => {
    // Automatically hide the custom config container.
    setTimeout(() => {
      setCustomConfigVisible(false);
    }, 2000);
  });
  return (
    <>
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

      <FlexRow>
        <EditorContainer>
          <FlexRow>
            <HeaderTitle>Custom Config</HeaderTitle>
            <Button onClick={() => setCustomConfigVisible(!customConfigVisible)}>TOGGLE</Button>
          </FlexRow>
          {customConfigVisible && <CustomFunctionEditor modelKind={modelKind} onChange={setCustomConfig} />}
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
    </>
  );
};
