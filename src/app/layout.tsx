import type { Metadata } from 'next'
import './globals.css'
import { ProtectedLayout } from '@/components/ProtectedLayout'

export const metadata: Metadata = {
  title: 'Gestalt — AI提示词编译器',
  description: '将原始意图转换为专业级 Prompt，基于 Meta-Prompting、CoT 思维链与智能推理模式切换技术',
  keywords: ['Gestalt', 'AI', 'Prompt', '提示词编译器', 'Meta-Prompting', 'CoT', 'LLM'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">
        <ProtectedLayout>
          {children}
        </ProtectedLayout>
      </body>
    </html>
  )
}
