// Copyright 2024 The casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React, { useEffect, useState } from 'react';
import { EnforceContext } from 'casbin';

interface SetupEnforceContextProps {
  data: Map<string, string>;
  onChange: (data: Map<string, string>) => void;
}

export const r = 'r';
export const p = 'p';
export const e = 'e';
export const m = 'm';

export const defaultEnforceContextData = new Map<string, string>([
  [r, r],
  [p, p],
  [e, e],
  [m, m],
]);

export const newEnforceContext = (data: Map<string, string>) => {
  return new EnforceContext(data.get(r)!, data.get(p)!, data.get(e)!, data.get(m)!);
};

export default function useSetupEnforceContext({ onChange, data }: SetupEnforceContextProps) {
  const [enforceContextData, setEnforceContextData] = useState(new Map(defaultEnforceContextData));
  const handleEnforceContextChange = (key: string, value: string) => {
    onChange(data.set(key, value));
  };

  useEffect(() => {
    setEnforceContextData(data);
  }, [data]);

  return {
    setupEnforceContextData: enforceContextData,
    setupHandleEnforceContextChange: handleEnforceContextChange,
  };
}
