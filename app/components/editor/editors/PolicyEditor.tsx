import { EditorProps } from '@/app/components/editor/editors/CustomFunctionEditor'
import CodeMirror from '@uiw/react-codemirror'
import { basicSetup } from 'codemirror'
import { CasbinPolicySupport } from '@/app/components/editor/casbin-mode/casbin-csv'
import { indentUnit } from '@codemirror/language'
import { EditorView } from '@codemirror/view'
import { monokai } from '@uiw/codemirror-theme-monokai'
import React from 'react'

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
          props.onChange(value)
        }}
        className={'function'}
        value={props.text}
      />
    </div>
  )
}
