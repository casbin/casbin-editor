import React, { useState } from 'react'

import { CustomFunctionEditor } from '@/app/components/editor/editors/CustomFunctionEditor'

interface SettingsProps {
  text: string
  onCustomConfigChange: (text: string) => void
}

export function Settings(props: SettingsProps) {
  const [open, setOpen] = useState(true)

  return (
    <div>
      <div className={'h-10 flex items-center justify-center '}>
        <span>Custom config</span>
        <div
          className={'h-10 w-10'}
          onClick={() => {
            return setOpen(!open)
          }}
        >
          <svg
            style={{
              width: '100%',
              height: '100%',
              transform: open ? 'rotateZ(0deg)' : 'rotateZ(180deg)',
            }}
            viewBox="0 0 24 24"
          >
            <path
              fill={'currentColor'}
              d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"
            />
          </svg>
        </div>
      </div>
      <div>
        {open && (
          <div>
            <CustomFunctionEditor
              text={props.text}
              onChange={props.onCustomConfigChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}
