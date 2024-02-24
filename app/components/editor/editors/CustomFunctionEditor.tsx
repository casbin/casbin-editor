import CodeMirror from '@uiw/react-codemirror'
import { monokai } from '@uiw/codemirror-theme-monokai'
import { basicSetup } from 'codemirror'
import { indentUnit, StreamLanguage } from '@codemirror/language'
import { go } from '@codemirror/legacy-modes/mode/go'
import { EditorView } from '@codemirror/view'
import React, { CSSProperties } from 'react'
export interface EditorProps {
  text: string
  onChange: (text: string) => void
  style?: CSSProperties
}
export const CustomFunctionEditor = (props: EditorProps) => {
  return (
    <div style={{ height: '100%', ...props.style }}>
      <CodeMirror
        onChange={(value) => {
          props.onChange(value)
        }}
        theme={monokai}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          bracketMatching: true,
          indentOnInput: true,
        }}
        extensions={[
          basicSetup,
          StreamLanguage.define(go),
          indentUnit.of('    '),
          EditorView.lineWrapping,
        ]}
        className={'function'}
        value={props.text}
      />
    </div>
  )
}
