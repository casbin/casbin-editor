import { EditorProps } from '@/app/components/editor/editors/CustomFunctionEditor'
import CodeMirror from '@uiw/react-codemirror'
import { monokai } from '@uiw/codemirror-theme-monokai'
import { basicSetup } from 'codemirror'
import { CasbinConfSupport } from '@/app/components/editor/casbin-mode/casbin-conf'
import { indentUnit } from '@codemirror/language'
import { EditorView } from '@codemirror/view'
import React from 'react'

export const ModelEditor = (props: EditorProps) => {
  return (
    <div style={{ height: '100%', ...props.style }}>
      <CodeMirror
        theme={monokai}
        onChange={(value) => {
          props.onChange(value)
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
  )
}
