import { clsx } from 'clsx'
import { SetupEnforceContext } from '@/app/components/editor/setup-enforce-context'
import { RequestEditor } from '@/app/components/editor/editors/RequestEditor'
import React from 'react'
interface Props {
  request: string
  setRequestPersistent: (value: string) => void
  enforceContextData: Map<string, string>
  setEnforceContextDataPersistent: (value: Map<string, string>) => void
}

export default function Request({
  request,
  setRequestPersistent,
  enforceContextData,
  setEnforceContextDataPersistent,
}: Props) {
  return (
    <div>
      <div className={'h-10 flex items-center justify-center '}>
        <div>Request</div>
        <SetupEnforceContext
          data={enforceContextData}
          onChange={setEnforceContextDataPersistent}
        />
      </div>
      <RequestEditor text={request} onChange={setRequestPersistent} />
    </div>
  )
}
