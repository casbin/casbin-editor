import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'casbin-editor',
  description: 'web playground for casbin',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
