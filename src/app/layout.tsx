import type { Metadata } from 'next'
import './globals.css'
import { ProtectedLayout } from '@/components/ProtectedLayout'
import { Providers } from '@/components/Providers'

export const metadata: Metadata = {
  title: 'Gestalt — AI Prompt Compiler',
  description: 'Transform raw intent into professional-grade prompts with Meta-Prompting, CoT and intelligent reasoning mode switching',
  keywords: ['Gestalt', 'AI', 'Prompt', 'Prompt Compiler', 'Meta-Prompting', 'CoT', 'LLM'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>
          <ProtectedLayout>
            {children}
          </ProtectedLayout>
        </Providers>
      </body>
    </html>
  )
}
