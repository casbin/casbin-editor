import React from 'react'

interface CopyProps {
  content: string
  cb: () => void
}

const Copy = (props: CopyProps) => {
  function copy(data: string): void {
    const listener = (e: ClipboardEvent) => {
      if (!e.clipboardData) {
        throw new Error('Clipboard API unavailable.')
      }
      e.clipboardData.setData('text/plain', data)
      e.preventDefault()
      document.removeEventListener('copy', listener)
    }
    document.addEventListener('copy', listener)
    document.execCommand('copy')
    props.cb()
  }

  return (
    <button
      style={{ marginRight: 8 }}
      onClick={() => {
        return copy(
          `${window.location.origin + window.location.pathname}#${props.content}`,
        )
      }}
    >
      COPY
    </button>
  )
}

export default Copy
