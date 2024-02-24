import { RequestResultEditor } from '@/app/components/editor/editors/RequestResultEditor'
import React from 'react'
interface Props {
  requestResult: string
}

export default function EnforcementResult({ requestResult }: Props) {
  return (
    <div>
      <div className={'h-10 flex items-center justify-center '}>
        Enforcement Result
      </div>
      <RequestResultEditor value={requestResult} />
    </div>
  )
}
