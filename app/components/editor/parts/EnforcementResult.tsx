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

import { RequestResultEditor } from '@/app/components/editor/editors/RequestResultEditor'
import React from 'react'
interface Props {
  requestResult: string
}

export default function EnforcementResult({ requestResult }: Props) {
  return (
    <div>
      <div className={'h-10 flex items-center justify-center '}>
        Enforcement Result
      </div>
      <RequestResultEditor value={requestResult} />
    </div>
  )
}
