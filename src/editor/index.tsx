import React, { isValidElement, useState } from 'react';
import SelectModel from './select-model';
import { Button, EditorContainer, FlexRow, HeaderTitle } from '../ui';
import { getSelectedModel, reset } from './persist';
import { CustomFunctionEditor, ModelEditor, PolicyEditor, RequestEditor, RequestResultEditor } from './editor';
import { RouteComponentProps } from '@reach/router';
import Syntax from './syntax';
import RunTest from './run-test';

interface Props extends RouteComponentProps {}

export const EditorScreen = (props: Props) => {
  const [model, setModel] = useState(getSelectedModel());
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
                setModel(value);
              }}
            />
            <Button
              onClick={() => {
                const ok = window.confirm('Confirm Reset?');
                if (ok) {
                  reset(model);
                  window.location.reload();
                }
              }}
              style={{ marginLeft: 8 }}
            >
              Reset
            </Button>
          </FlexRow>
          <ModelEditor model={model} onChange={setModelText} />
        </EditorContainer>
        <EditorContainer>
          <HeaderTitle>Policy</HeaderTitle>
          <PolicyEditor model={model} onChange={setPolicy} />
        </EditorContainer>
      </FlexRow>

      <FlexRow>
        <EditorContainer>
          <HeaderTitle>Request</HeaderTitle>
          <RequestEditor model={model} onChange={setRequest} />
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
          {visible && <CustomFunctionEditor model={model} onChange={setFn} />}
        </EditorContainer>
      </FlexRow>

      <div style={{ padding: 8 }}>
        <Syntax model={modelText} onResponse={component => setEcho(component)} />
        <RunTest
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
