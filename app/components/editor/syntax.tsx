import React from 'react'
import { Config } from 'casbin'

interface SyntaxProps {
  model: string
  onResponse: (com: JSX.Element) => void
}

const Syntax = (props: SyntaxProps) => {
  return (
    <button
      style={{ marginRight: 8 }}
      onClick={() => {
        try {
          Config.newConfigFromText(props.model)
          props.onResponse(<div>Passed</div>)
        } catch (e) {
          props.onResponse(<div>{(e as any).message}</div>)
        }
      }}
    >
      SYNTAX VALIDATE
    </button>
  )
}

export default Syntax
