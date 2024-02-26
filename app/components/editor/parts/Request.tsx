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

import { SetupEnforceContext } from '@/app/components/editor/setup-enforce-context';
import { RequestEditor } from '@/app/components/editor/editors/RequestEditor';
import React from 'react';
import { clsx } from 'clsx';
interface Props {
  request: string;
  setRequestPersistent: (value: string) => void;
  enforceContextData: Map<string, string>;
  setEnforceContextDataPersistent: (value: Map<string, string>) => void;
}

export default function Request({
  request,
  setRequestPersistent,
  enforceContextData,
  setEnforceContextDataPersistent,
}: Props) {
  return (
    <div>
      <div className={clsx('h-10', 'flex items-center justify-start gap-2')}>
        <h4
          className={clsx('scroll-m-20 text-2xl font-semibold tracking-tight')}
        >
          Request
        </h4>
        <SetupEnforceContext
          data={enforceContextData}
          onChange={setEnforceContextDataPersistent}
        />
      </div>
      <RequestEditor text={request} onChange={setRequestPersistent} />
    </div>
  );
}
