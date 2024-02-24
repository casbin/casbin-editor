import React from 'react'
import {
  DefaultRoleManager,
  newEnforcer,
  newModel,
  StringAdapter,
  Util,
} from 'casbin'
import { newEnforceContext } from './setup-enforce-context'

interface RunTestProps {
  model: string
  modelKind: string
  policy: string
  customConfig: string
  request: string
  enforceContextData: Map<string, string>
  onResponse: (com: JSX.Element | any[]) => void
  // parseABAC: boolean;
}

function parseABACRequest(line: string): any[] {
  let value: string | Record<string, any> = ''
  let objectToken = 0
  let parseToObject = false
  const request = []

  for (let i = 0; i < line.length; i++) {
    if (objectToken === 0 && line[i] === ',') {
      if (parseToObject) {
        // eslint-disable-next-line
        value = eval(`(${value})`)
      }
      if (typeof value === 'string') {
        value = value.trim()
      }
      // @ts-ignore
      request.push(value)

      value = ''
      parseToObject = false
      continue
    }

    value += line[i]

    if (line[i] === '{') {
      parseToObject = true
      objectToken++
      continue
    }

    if (line[i] === '}') {
      objectToken--
    }
  }

  if (objectToken !== 0) {
    throw new Error(`invalid request ${line}`)
  }

  if (value) {
    if (parseToObject) {
      // eslint-disable-next-line
      value = eval(`(${value})`)
    }
    if (typeof value === 'string') {
      value = value.trim()
    }
    // @ts-ignore
    request.push(value)
  }

  return request
}

async function enforcer(props: RunTestProps) {
  const startTime = performance.now()
  const result = []
  try {
    const e = await newEnforcer(
      newModel(props.model),
      props.policy ? new StringAdapter(props.policy) : undefined,
    )

    const customConfigCode = props.customConfig
    if (customConfigCode) {
      try {
        const builtinFunc = {
          keyMatch: Util.keyMatchFunc,
          keyGet: Util.keyGetFunc,
          keyMatch2: Util.keyMatch2Func,
          keyGet2: Util.keyGet2Func,
          keyMatch3: Util.keyMatch3Func,
          keyMatch4: Util.keyMatch4Func,
          regexMatch: Util.regexMatchFunc,
          ipMatch: Util.ipMatchFunc,
          globMatch: Util.globMatch,
        }

        // eslint-disable-next-line
        let config = eval(customConfigCode)
        if (config) {
          config = {
            ...config,
            functions: { ...config.functions, ...builtinFunc },
          }
          if (config?.functions) {
            Object.keys(config.functions).forEach((key) => {
              return e.addFunction(key, config.functions[key])
            })
          }

          const rm = e.getRoleManager() as DefaultRoleManager
          const matchingForGFunction = config.matchingForGFunction
          if (matchingForGFunction) {
            if (typeof matchingForGFunction === 'function') {
              await rm.addMatchingFunc(matchingForGFunction)
            }
            if (typeof matchingForGFunction === 'string') {
              if (matchingForGFunction in config.functions) {
                await rm.addMatchingFunc(config.functions[matchingForGFunction])
              } else {
                props.onResponse(
                  <div>
                    Must sure the {matchingForGFunction}() in config.functions
                  </div>,
                )
                return
              }
            }
          }

          const matchingDomainForGFunction = config.matchingDomainForGFunction
          if (matchingDomainForGFunction) {
            if (typeof matchingDomainForGFunction === 'function') {
              await rm.addDomainMatchingFunc(matchingDomainForGFunction)
            }
            if (typeof matchingDomainForGFunction === 'string') {
              if (matchingDomainForGFunction in config.functions) {
                await rm.addDomainMatchingFunc(
                  config.functions[matchingDomainForGFunction],
                )
              } else {
                props.onResponse(
                  <div>
                    Must sure the {matchingDomainForGFunction}() in
                    config.functions
                  </div>,
                )
                return
              }
            }
          }
        }
      } catch (e) {
        props.onResponse(
          <div>
            Please check syntax in Custom Function Editor: {(e as any).message}
          </div>,
        )
        return
      }
    }

    const requests = props.request.split('\n')

    for (const n of requests) {
      const line = n.trim()
      if (!line) {
        // @ts-ignore
        result.push('// ignore')
        continue
      }

      if (line[0] === '#') {
        // @ts-ignore
        result.push('// ignore')
        continue
      }

      const rvals = parseABACRequest(n)
      const ctx = newEnforceContext(props.enforceContextData)

      // @ts-ignore
      result.push(await e.enforce(ctx, ...rvals))
    }

    const stopTime = performance.now()

    props.onResponse(
      <div>{'Done in ' + (stopTime - startTime).toFixed(2) + 'ms'}</div>,
    )
    props.onResponse(result)
  } catch (e) {
    props.onResponse(<div>{(e as any).message}</div>)
    props.onResponse([])
  }
}

const RunTest = (props: RunTestProps) => {
  return (
    <button
      style={{ marginRight: 8 }}
      onClick={() => {
        return enforcer(props)
      }}
    >
      RUN THE TEST
    </button>
  )
}

export default RunTest
