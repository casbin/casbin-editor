import React, { useState } from 'react'

interface ShareProps extends ShareFormat {
  onResponse: (info: JSX.Element | string) => void
}

export interface ShareFormat {
  model: string
  policy: string
  customConfig: string
  request: string
  enforceContext: object
}

async function dpaste(content: string) {
  const response = await fetch('https://dpaste.com/api/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `content=${encodeURIComponent(content)}&syntax=json&title=${encodeURIComponent('Casbin Shared Content')}&expiry_days=200`,
  })
  return response.text()
}

const Share = (props: ShareProps) => {
  const [sharing, setSharing] = useState(false)

  function shareInfo(props: ShareProps) {
    if (sharing) return
    setSharing(true)
    props.onResponse(<div>Sharing...</div>)
    const shareContent: ShareFormat = {
      model: props.model,
      policy: props.policy,
      customConfig: props.customConfig,
      request: props.request,
      enforceContext: props.enforceContext,
    }
    dpaste(JSON.stringify(shareContent)).then((url: string) => {
      setSharing(false)
      const hash = url.split('/')[3]
      props.onResponse(hash)
    })
  }

  return (
    <button
      style={{ marginRight: 8 }}
      onClick={() => {
        return shareInfo(props)
      }}
    >
      SHARE
    </button>
  )
}

export default Share
