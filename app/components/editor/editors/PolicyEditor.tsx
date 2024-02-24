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
import { basicSetup } from 'codemirror';
import { CasbinPolicySupport } from '@/app/components/editor/casbin-mode/casbin-csv';
import { indentUnit } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { monokai } from '@uiw/codemirror-theme-monokai';
import React from 'react';

export const PolicyEditor = (props: EditorProps) => {
  return (
    <div style={{ height: '100%', ...props.style }}>
      <CodeMirror
        extensions={[
          basicSetup,
          CasbinPolicySupport(),
          indentUnit.of('    '),
          EditorView.lineWrapping,
        ]}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          bracketMatching: true,
          indentOnInput: true,
        }}
        theme={monokai}
        onChange={(value) => {
          props.onChange(value);
        }}
        className={'function'}
        value={props.text}
      />
    </div>
  );
};
