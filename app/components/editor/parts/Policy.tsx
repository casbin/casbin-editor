import { PolicyEditor } from '@/app/components/editor/editors/PolicyEditor'
import React from 'react'
interface Props {
  policy: string
  setPolicyPersistent: (value: string) => void
}

export default function Policy({ policy, setPolicyPersistent }: Props) {
  return (
    <div>
      <div className={'h-10 flex items-center justify-center '}>Policy</div>
      <PolicyEditor text={policy} onChange={setPolicyPersistent} />
    </div>
  )
}
