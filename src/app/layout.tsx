import type { Metadata } from 'next'
import './globals.css'

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          {children}
        </div>
      </body>
    </html>
  )
}
