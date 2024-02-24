// Copyright 2024 The casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React, { CSSProperties } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { monokai } from '@uiw/codemirror-theme-monokai';
import { basicSetup } from 'codemirror';
import { javascriptLanguage } from '@codemirror/lang-javascript';
import { indentUnit } from '@codemirror/language';
import { EditorView } from '@codemirror/view';

interface RequestResultEditorProps {
  value: string;
  style?: CSSProperties;
}

export const RequestResultEditor = (props: RequestResultEditorProps) => {
  return (
    <div style={props.style}>
      <CodeMirror
        onChange={() => {
          return;
        }}
        theme={monokai}
        extensions={[
          basicSetup,
          javascriptLanguage,
          indentUnit.of('    '),
          EditorView.lineWrapping,
        ]}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          bracketMatching: true,
          indentOnInput: true,
        }}
        value={props.value}
      />
    </div>
  );
};
