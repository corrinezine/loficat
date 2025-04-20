import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '猫咪冒险游戏',
  description: '一个基于 Next.js 和 TypeScript 开发的平台跳跃网页游戏',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  )
}
