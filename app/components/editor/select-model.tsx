import React from 'react'
import { ModelKind, example } from './casbin-mode/example'

interface SelectModelProps {
  onChange: (value: string) => void
}

const SelectModel = (props: SelectModelProps) => {
  return (
    <select
      defaultValue={''}
      onChange={(e) => {
        const model = e.target.value
        props.onChange(model)
      }}
    >
      <option value="" disabled>
        Select your model
      </option>
      {Object.keys(example).map((n) => {
        return (
          <option key={n} value={n}>
            {example[n as ModelKind].name}
          </option>
        )
      })}
    </select>
  )
}

export default SelectModel
