import React from 'react';
import { getSelectedModel, setSelectedModel } from './persist';
import { ModelKind, example } from './casbin-mode/example';

interface SelectModelProps {
  onChange: (value: string) => void;
}

const SelectModel = (props: SelectModelProps) => {
  return (
    <select
      defaultValue={getSelectedModel()}
      onChange={e => {
        const model = e.target.value;
        setSelectedModel(model);
        props.onChange(model);
      }}
    >
      <option value="" disabled>
        Select your model
      </option>
      {Object.keys(example).map(n => (
        <option key={n} value={n}>
          {example[n as ModelKind].name}
        </option>
      ))}
    </select>
  );
};

SelectModel.defaultProps = {
  onChange: console.log,
  defaultValue: 'basic'
};
export default SelectModel;
