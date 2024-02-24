'use client'
import { EditorScreen } from '@/app/components/editor'
export default function Home() {
  return (
    <main>
      <EditorScreen />
      <div>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/casbin/casbin-editor"
        >
          <img
            alt="GitHub stars"
            src="https://img.shields.io/github/stars/casbin/casbin-editor?style=social"
          />
        </a>
        <span style={{ color: '#FFFFFF', float: 'right', fontSize: 14 }}>
          Copyright © {new Date().getFullYear()} Casbin contributors.
        </span>
      </div>
    </main>
  )
}
