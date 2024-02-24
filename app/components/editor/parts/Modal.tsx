import SelectModel from '@/app/components/editor/select-model'
import { ModelKind } from '@/app/components/editor/casbin-mode/example'
import { ModelEditor } from '@/app/components/editor/editors/ModalEditor'
import React from 'react'
interface Props {
  setModelKind: (value: string) => void
  modelText: string
  setModelTextPersistent: (value: string) => void
}

export default function Modal({
  setModelKind,
  modelText,
  setModelTextPersistent,
}: Props) {
  return (
    <div>
      <div className={'flex flex-row items-center'}>
        <div className={'h-10 flex items-center justify-center '}>Model</div>
        <SelectModel
          onChange={(value) => {
            setModelKind(value as ModelKind)
          }}
        />
        <button
          onClick={() => {
            const ok = window.confirm('Confirm Reset?')
            if (ok) {
              window.location.reload()
            }
          }}
        >
          Reset
        </button>
      </div>
      <ModelEditor text={modelText} onChange={setModelTextPersistent} />
    </div>
  )
}
