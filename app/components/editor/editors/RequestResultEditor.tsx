import React, { CSSProperties } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { monokai } from '@uiw/codemirror-theme-monokai'
import { basicSetup } from 'codemirror'
import { javascriptLanguage } from '@codemirror/lang-javascript'
import { indentUnit } from '@codemirror/language'
import { EditorView } from '@codemirror/view'

interface RequestResultEditorProps {
  value: string
  style?: CSSProperties
}

export const RequestResultEditor = (props: RequestResultEditorProps) => {
  return (
    <div style={props.style}>
      <CodeMirror
        onChange={() => {
          return
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
  )
}
