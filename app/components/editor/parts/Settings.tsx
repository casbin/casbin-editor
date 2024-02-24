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

import React, { useState } from 'react';

import { CustomFunctionEditor } from '@/app/components/editor/editors/CustomFunctionEditor';

interface SettingsProps {
  text: string;
  onCustomConfigChange: (text: string) => void;
}

export function Settings(props: SettingsProps) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <div className={'h-10 flex items-center justify-center '}>
        <span>Custom config</span>
        <div
          className={'h-10 w-10'}
          onClick={() => {
            return setOpen(!open);
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
  );
}
