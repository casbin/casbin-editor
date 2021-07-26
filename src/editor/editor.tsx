import React, { CSSProperties } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';

import * as codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/mathematica/mathematica';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/display/placeholder';
import './casbin-mode/casbin-conf';
import './casbin-mode/casbin-csv';
import './editor.css';

interface CasbinCodeMirror {
  content: string;
  options: codemirror.EditorConfiguration;
  style?: CSSProperties;
  onChange: (text: string) => void;
  className?: string;
}

interface EditorProps {
  text: string;
  onChange?: (text: string) => void;
  style?: CSSProperties;
}

const CasbinCodeMirror = (props: CasbinCodeMirror) => {
  return (
    <div style={props.style} className={props.className}>
      <CodeMirror
        onBeforeChange={(editor, data, value) => {
          props.onChange(value);
        }}
        options={props.options}
        value={props.content}
      />
    </div>
  );
};

CasbinCodeMirror.defaultProps = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: () => {}
};

export const CustomFunctionEditor = (props: EditorProps) => {
  return (
    <CasbinCodeMirror
      style={{ height: '100%' }}
      content={props.text}
      options={{
        lineNumbers: true,
        indentUnit: 4,
        styleActiveLine: true,
        matchBrackets: true,
        mode: 'javascript',
        lineWrapping: true,
        theme: 'monokai'
      }}
      className={'function'}
      {...props}
    />
  );
};

export const ModelEditor = (props: EditorProps) => {
  return (
    <CasbinCodeMirror
      content={props.text}
      options={{
        lineNumbers: true,
        indentUnit: 4,
        styleActiveLine: true,
        matchBrackets: true,
        mode: 'casbin-conf',
        lineWrapping: true,
        theme: 'monokai'
      }}
      {...props}
    />
  );
};

export const PolicyEditor = (props: EditorProps) => {
  return (
    <CasbinCodeMirror
      content={props.text}
      options={{
        lineNumbers: true,
        indentUnit: 4,
        styleActiveLine: true,
        matchBrackets: true,
        mode: 'casbin-csv',
        lineWrapping: true,
        theme: 'monokai'
      }}
      {...props}
    />
  );
};

export const RequestEditor = (props: EditorProps) => {
  return (
    <CasbinCodeMirror
      content={props.text}
      options={{
        lineNumbers: true,
        indentUnit: 4,
        styleActiveLine: true,
        matchBrackets: true,
        mode: 'mathematica',
        lineWrapping: true,
        theme: 'monokai'
      }}
      {...props}
    />
  );
};

interface RequestResultEditorProps {
  value: string;
  style?: CSSProperties;
}

export const RequestResultEditor = (props: RequestResultEditorProps) => {
  return (
    <div style={props.style}>
      <CodeMirror
        onBeforeChange={() => {
          return;
        }}
        value={props.value}
        options={{
          readOnly: true,
          indentUnit: 4,
          styleActiveLine: true,
          matchBrackets: true,
          mode: 'javascript',
          lineWrapping: true,
          theme: 'monokai'
        }}
      />
    </div>
  );
};
