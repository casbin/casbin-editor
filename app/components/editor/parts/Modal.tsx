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

import SelectModel from '@/app/components/editor/select-model';
import { ModelKind } from '@/app/components/editor/casbin-mode/example';
import { ModelEditor } from '@/app/components/editor/editors/ModalEditor';
import React from 'react';
interface Props {
  setModelKind: (value: string) => void;
  modelText: string;
  setModelTextPersistent: (value: string) => void;
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
            setModelKind(value as ModelKind);
          }}
        />
        <button
          onClick={() => {
            const ok = window.confirm('Confirm Reset?');
            if (ok) {
              window.location.reload();
            }
          }}
        >
          Reset
        </button>
      </div>
      <ModelEditor text={modelText} onChange={setModelTextPersistent} />
    </div>
  );
}
