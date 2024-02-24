import Syntax from '@/app/components/editor/syntax'
import RunTest from '@/app/components/editor/run-test'
import React, { isValidElement, ReactNode } from 'react'
import Share from '@/app/components/editor/share'
import Copy from '@/app/components/editor/copy'
interface Props {
  modelText: string
  echo: ReactNode
  setEcho: (value: ReactNode) => void
  modelKind: string
  policy: string
  customConfig: string
  request: string
  enforceContextData: Map<string, string>
  setRequestResult: (value: string) => void
  share: string
  setShare: (value: string) => void
  handleShare: (value: ReactNode | string) => void
}

export default function ButtonGroup({
  echo,
  modelText,
  modelKind,
  setEcho,
  policy,
  customConfig,
  request,
  enforceContextData,
  setRequestResult,
  share,
  setShare,
  handleShare,
}: Props) {
  return (
    <div>
      <Syntax
        model={modelText}
        onResponse={(component) => {
          return setEcho(component)
        }}
      />
      <RunTest
        modelKind={modelKind}
        model={modelText}
        policy={policy}
        customConfig={customConfig}
        request={request}
        enforceContextData={enforceContextData}
        onResponse={(v) => {
          if (isValidElement(v)) {
            setEcho(v)
          } else if (Array.isArray(v)) {
            setRequestResult(v.join('\n'))
          }
        }}
      />
      {!share ? (
        <Share
          onResponse={(v) => {
            return handleShare(v)
          }}
          model={modelText}
          policy={policy}
          customConfig={customConfig}
          request={request}
          enforceContext={Object.entries(enforceContextData)}
        />
      ) : (
        <Copy
          content={share}
          cb={() => {
            setShare('')
            setEcho(<div>Copied.</div>)
          }}
        />
      )}
      <div style={{ display: 'inline-block' }}>{echo}</div>
    </div>
  )
}
