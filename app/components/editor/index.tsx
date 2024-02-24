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

'use client'
import React, { isValidElement, ReactNode, useEffect, useState } from 'react'
import {
  defaultCustomConfig,
  defaultEnforceContext,
  example,
  ModelKind,
} from './casbin-mode/example'
import { Settings } from './parts/Settings'
import { ShareFormat } from './share'
import { defaultEnforceContextData } from './setup-enforce-context'

import Modal from '@/app/components/editor/parts/Modal'
import Policy from '@/app/components/editor/parts/Policy'
import Request from '@/app/components/editor/parts/Request'
import EnforcementResult from '@/app/components/editor/parts/EnforcementResult'
import ButtonGroup from '@/app/components/editor/parts/ButtonGroup'
import { clsx } from 'clsx'

export const EditorScreen = () => {
  const [modelKind, setModelKind] = useState<ModelKind>('basic')
  const [modelText, setModelText] = useState('')
  const [policy, setPolicy] = useState('')
  const [request, setRequest] = useState('')
  const [echo, setEcho] = useState<ReactNode>(<></>)
  const [requestResult, setRequestResult] = useState('')
  const [customConfig, setCustomConfig] = useState('')
  const [share, setShare] = useState('')
  const [enforceContextData, setEnforceContextData] = useState(
    new Map(defaultEnforceContextData),
  )

  function setPolicyPersistent(text: string): void {
    setPolicy(text)
  }

  function setModelTextPersistent(text: string): void {
    setModelText(text)
  }

  function setCustomConfigPersistent(text: string): void {
    setCustomConfig(text)
  }

  function setRequestPersistent(text: string): void {
    setRequest(text)
  }

  function setEnforceContextDataPersistent(map: Map<string, string>): void {
    const text = JSON.stringify(Object.fromEntries(map))
    setEnforceContextData(new Map(map))
  }

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash) {
      setEcho(<div>Loading Shared Content...</div>)
      fetch(`https://dpaste.com/${hash}.txt`)
        .then((resp) => {
          return resp.text()
        })
        .then((content) => {
          const sharedContent = JSON.parse(content) as ShareFormat
          setPolicyPersistent(sharedContent.policy)
          setModelTextPersistent(sharedContent.model)
          setCustomConfigPersistent(sharedContent.customConfig)
          setRequestPersistent(sharedContent.request)
          setRequestPersistent(sharedContent.request)
          if (sharedContent.enforceContext) {
            setEnforceContextDataPersistent(
              new Map(Object.entries(sharedContent.enforceContext)),
            )
          }
          setRequestResult('')
          window.location.hash = '' // prevent duplicate load
          setEcho(<div>Shared Content Loaded.</div>)
        })
        .catch(() => {
          setEcho(<div>Failed to load Shared Content.</div>)
        })
    }
  }, [])

  useEffect(() => {
    setPolicy(example[modelKind].policy)
    setModelText(example[modelKind].model)
    setRequest(example[modelKind].request)
    setCustomConfig(defaultCustomConfig)
    setEnforceContextData(
      new Map(
        Object.entries(
          JSON.parse(
            example[modelKind].enforceContext || defaultEnforceContext,
          ),
        ),
      ),
    )
  }, [modelKind])

  function handleShare(v: ReactNode | string) {
    if (isValidElement(v)) {
      setEcho(v)
    } else {
      const currentPath = window.location.origin + window.location.pathname
      setShare(v as string)
      setEcho(<div>{`Shared at ${currentPath}#${v}`}</div>)
    }
  }

  return (
    <div className={clsx('flex flex-row  gap-1')}>
      <div className={'w-64'}>
        <Settings
          text={customConfig}
          onCustomConfigChange={(v) => {
            setCustomConfigPersistent(v)
          }}
        />
      </div>
      <div className={clsx('flex flex-col grow')}>
        <div className={clsx('flex flex-row  gap-1')}>
          <div className={'flex-1'}>
            <Modal
              setModelKind={setModelKind}
              modelText={modelText}
              setModelTextPersistent={setModelTextPersistent}
            ></Modal>
          </div>
          <div className={'flex-1'}>
            <Policy
              policy={policy}
              setPolicyPersistent={setPolicyPersistent}
            ></Policy>
          </div>
        </div>
        <div className={'flex flex-row gap-1'}>
          <div className={'flex-1'}>
            <Request
              request={request}
              setRequestPersistent={setRequest}
              enforceContextData={enforceContextData}
              setEnforceContextDataPersistent={setEnforceContextDataPersistent}
            ></Request>
          </div>
          <div className={'flex-1'}>
            <EnforcementResult
              requestResult={requestResult}
            ></EnforcementResult>
          </div>
        </div>
        <ButtonGroup
          modelText={modelText}
          echo={echo}
          setEcho={setEcho}
          modelKind={modelKind}
          policy={policy}
          customConfig={customConfig}
          request={request}
          enforceContextData={enforceContextData}
          setRequestResult={setRequestResult}
          share={share}
          setShare={setShare}
          handleShare={handleShare}
        ></ButtonGroup>
      </div>
    </div>
  )
}
