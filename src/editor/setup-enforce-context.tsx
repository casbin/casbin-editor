import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { EnforceContext } from 'casbin';

const EnforceContextInput = styled.input`
  width: 20px;
  margin: 0 5px;
`;
interface SetupEnforceContextProps {
  data: Map<string, string>;
  onChange: (data: Map<string, string>) => void;
}

const r = 'r';
const p = 'p';
const e = 'e';
const m = 'm';

export const defaultEnforceContextData = new Map<string, string>([
  [r, r],
  [p, p],
  [e, e],
  [m, m]
]);

export const newEnforceContext = (data: Map<string, string>) => {
  return new EnforceContext(data.get(r)!, data.get(p)!, data.get(e)!, data.get(m)!);
};

export const SetupEnforceContext = ({ onChange, data }: SetupEnforceContextProps) => {
  const [enforceContextData, setEnforceContextData] = useState(new Map(defaultEnforceContextData));
  const handleEnforceContextChange = (key: string, value: string) => {
    onChange(data.set(key, value));
  };

  useEffect(() => {
    setEnforceContextData(data);
  }, [data]);

  return (
    <>
      <EnforceContextInput
        value={enforceContextData.get(r)}
        placeholder={r}
        onChange={event => handleEnforceContextChange(r, event.target.value)}
      />
      <EnforceContextInput
        value={enforceContextData.get(p)}
        placeholder={p}
        onChange={event => handleEnforceContextChange(p, event.target.value)}
      />
      <EnforceContextInput
        value={enforceContextData.get(e)}
        placeholder={e}
        onChange={event => handleEnforceContextChange(e, event.target.value)}
      />
      <EnforceContextInput
        value={enforceContextData.get(m)}
        placeholder={m}
        onChange={event => handleEnforceContextChange(m, event.target.value)}
      />
    </>
  );
};
