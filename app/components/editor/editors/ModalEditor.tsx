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

import { EditorProps } from '@/app/components/editor/editors/CustomFunctionEditor';
import CodeMirror from '@uiw/react-codemirror';
import { monokai } from '@uiw/codemirror-theme-monokai';
import { basicSetup } from 'codemirror';
import { CasbinConfSupport } from '@/app/components/editor/casbin-mode/casbin-conf';
import { indentUnit } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import React from 'react';

export const ModelEditor = (props: EditorProps) => {
  return (
    <div style={{ height: '100%', ...props.style }}>
      <CodeMirror
        theme={monokai}
        onChange={(value) => {
          props.onChange(value);
        }}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          bracketMatching: true,
          indentOnInput: true,
        }}
        extensions={[
          basicSetup,
          CasbinConfSupport(),
          indentUnit.of('    '),
          EditorView.lineWrapping,
        ]}
        className={'function'}
        value={props.text}
      />
    </div>
  );
};
