'use client'

import { useState, useEffect } from 'react'
import { ConfigPanel } from '@/components/ConfigPanel'
import { ChatPanel } from '@/components/ChatPanel'
import { TestPanel } from '@/components/TestPanel'
import { ApiConfig, DEFAULT_CONFIG } from '@/lib/types'
import { Sparkles, Zap, Brain, Palette, Shield } from 'lucide-react'

export default function Home() {
  const [config, setConfig] = useState<ApiConfig>(DEFAULT_CONFIG)
  const [isHydrated, setIsHydrated] = useState(false)
  const [extractedPrompt, setExtractedPrompt] = useState('')

  // 从 localStorage 加载配置
  useEffect(() => {
    setIsHydrated(true)
    if (typeof window !== 'undefined') {
      const savedConfig = localStorage.getItem('prompt-compiler-config')
      if (savedConfig) {
        try {
          const parsed = JSON.parse(savedConfig)
          setConfig({ ...DEFAULT_CONFIG, ...parsed })
        } catch (e) {
          console.error('加载配置失败:', e)
        }
      }
    }
  }, [])

  // 避免水合不匹配
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-slate-500">加载中...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* 配置面板 */}
      <ConfigPanel config={config} onConfigChange={setConfig} />

      {/* 头部 */}
      <header className="relative overflow-hidden px-4 py-8 sm:py-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-accent-500/10 to-transparent" />
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Gestalt — AI提示词编译器
            </h1>
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4">
            左侧对话打磨 Prompt · 右侧实时调用模型测试
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <FeatureTag icon={<Zap className="w-3 h-3" />} text="对话式优化" />
            <FeatureTag icon={<Brain className="w-3 h-3" />} text="多领域适配" />
            <FeatureTag icon={<Palette className="w-3 h-3" />} text="多模型测试" />
            <FeatureTag icon={<Shield className="w-3 h-3" />} text="实时验证" />
          </div>
        </div>
      </header>

      {/* 主内容 - 左右分栏 */}
      <div className="flex-1 px-4 pb-8">
        <div className="max-w-7xl mx-auto h-[calc(100vh-240px)] min-h-[500px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
            {/* 左侧：对话编译器 */}
            <ChatPanel 
              config={config} 
              onPromptExtracted={setExtractedPrompt} 
            />

            {/* 右侧：测试平台 */}
            <TestPanel 
              config={config} 
              extractedPrompt={extractedPrompt}
              onPromptChange={setExtractedPrompt}
            />
          </div>
        </div>
      </div>

      {/* 底部 */}
      <footer className="py-4 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          核心逻辑引用自《AI全栈实战指南》: Meta-Prompting, CoT, Step-Back
        </div>
      </footer>
    </main>
  )
}

function FeatureTag({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
      {icon}
      {text}
    </span>
  )
}
