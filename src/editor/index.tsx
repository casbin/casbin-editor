import React, { isValidElement, useState } from 'react';
import SelectModel from './select-model';
import { Button, EditorContainer, FlexRow, HeaderTitle } from '../ui';
import { getSelectedModel, reset } from './persist';
import { CustomFunctionEditor, ModelEditor, PolicyEditor, RequestEditor, RequestResultEditor } from './editor';
import Syntax from './syntax';
import RunTest from './run-test';

export const EditorScreen = () => {
  const [modelKind, setModelKind] = useState(getSelectedModel());
  const [modelText, setModelText] = useState('');
  const [policy, setPolicy] = useState('');
  const [fn, setFn] = useState('');
  const [request, setRequest] = useState('');
  const [echo, setEcho] = useState<JSX.Element>(<></>);
  const [requestResult, setRequestResult] = useState('');
  const [visible, setVisible] = useState(false);

  return (
    <>
      <FlexRow>
        <EditorContainer>
          <FlexRow>
            <HeaderTitle>Model</HeaderTitle>
            <SelectModel
              onChange={value => {
                setModelKind(value);
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
            <HeaderTitle>Custom Function</HeaderTitle>
            <Button onClick={() => setVisible(!visible)}>TOGGLE</Button>
          </FlexRow>
          {visible && <CustomFunctionEditor modelKind={modelKind} onChange={setFn} />}
        </EditorContainer>
      </FlexRow>

      <div style={{ padding: 8 }}>
        <Syntax model={modelText} onResponse={component => setEcho(component)} />
        <RunTest
          modelKind={modelKind}
          model={modelText}
          policy={policy}
          fn={fn}
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
