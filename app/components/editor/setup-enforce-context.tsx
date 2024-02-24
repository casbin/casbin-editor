import React, { useEffect, useState } from 'react'
import { EnforceContext } from 'casbin'

interface SetupEnforceContextProps {
  data: Map<string, string>
  onChange: (data: Map<string, string>) => void
}

const r = 'r'
const p = 'p'
const e = 'e'
const m = 'm'

export const defaultEnforceContextData = new Map<string, string>([
  [r, r],
  [p, p],
  [e, e],
  [m, m],
])

export const newEnforceContext = (data: Map<string, string>) => {
  return new EnforceContext(
    data.get(r)!,
    data.get(p)!,
    data.get(e)!,
    data.get(m)!,
  )
}

export const SetupEnforceContext = ({
  onChange,
  data,
}: SetupEnforceContextProps) => {
  const [enforceContextData, setEnforceContextData] = useState(
    new Map(defaultEnforceContextData),
  )
  const handleEnforceContextChange = (key: string, value: string) => {
    onChange(data.set(key, value))
  }

  useEffect(() => {
    setEnforceContextData(data)
  }, [data])

  return (
    <div className={''}>
      <input
        className={'w-10'}
        value={enforceContextData.get(r)}
        placeholder={r}
        onChange={(event) => {
          return handleEnforceContextChange(r, event.target.value)
        }}
      />
      <input
        className={'w-10'}
        value={enforceContextData.get(p)}
        placeholder={p}
        onChange={(event) => {
          return handleEnforceContextChange(p, event.target.value)
        }}
      />
      <input
        className={'w-10'}
        value={enforceContextData.get(e)}
        placeholder={e}
        onChange={(event) => {
          return handleEnforceContextChange(e, event.target.value)
        }}
      />
      <input
        className={'w-10'}
        value={enforceContextData.get(m)}
        placeholder={m}
        onChange={(event) => {
          return handleEnforceContextChange(m, event.target.value)
        }}
      />
    </div>
  )
}
