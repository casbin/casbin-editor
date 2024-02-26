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
import { clsx } from 'clsx';
import HiddenButton from '@/app/components/editor/parts/Settings/HiddenButton';

interface SettingsProps {
  text: string;
  onCustomConfigChange: (text: string) => void;
}

export function Settings(props: SettingsProps) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <div className={' flex items-center justify-center '}>
        {open && (
          <h4
            className={clsx(
              'scroll-m-20 text-2xl font-semibold tracking-tight',
            )}
          >
            Custom config
          </h4>
        )}
        <HiddenButton open={open} setOpen={setOpen}></HiddenButton>
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
