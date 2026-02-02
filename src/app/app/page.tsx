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
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50/50 via-slate-100/30 to-slate-200/20 dark:from-slate-900/50 dark:via-slate-800/40 dark:to-slate-700/30">
      {/* 配置面板 */}
      <ConfigPanel config={config} onConfigChange={setConfig} />

      {/* 头部 */}
      <header className="relative overflow-hidden px-4 py-8 sm:py-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-accent-500/5 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg shadow-primary-500/20 backdrop-blur-sm">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Gestalt — AI提示词编译器
            </h1>
          </div>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
            左侧对话打磨 Prompt · 右侧实时调用模型测试
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <FeatureTag icon={<Zap className="w-4 h-4" />} text="对话式优化" />
            <FeatureTag icon={<Brain className="w-4 h-4" />} text="多领域适配" />
            <FeatureTag icon={<Palette className="w-4 h-4" />} text="多模型测试" />
            <FeatureTag icon={<Shield className="w-4 h-4" />} text="实时验证" />
          </div>
          
          {/* 动态背景元素 */}
          <div className="absolute top-20 left-10 w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-1 h-1 bg-accent-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-40 right-1/3 w-1 h-1 bg-indigo-400 rounded-full animate-ping delay-500"></div>
        </div>
      </header>

      {/* 主内容 - 左右分栏 */}
      <div className="flex-1 px-4 pb-8">
        <div className="max-w-7xl mx-auto h-[calc(100vh-280px)] min-h-[500px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* 左侧：对话编译器 */}
            <div className="transform transition-all duration-500 hover:scale-[1.01]">
              <ChatPanel 
                config={config} 
                onPromptExtracted={setExtractedPrompt} 
              />
            </div>

            {/* 右侧：测试平台 */}
            <div className="transform transition-all duration-500 hover:scale-[1.01]">
              <TestPanel 
                config={config} 
                extractedPrompt={extractedPrompt}
                onPromptChange={setExtractedPrompt}
              />
            </div>
          </div>
        </div>
      </div>


    </main>
  )
}

function FeatureTag({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 text-sm text-slate-700 dark:text-slate-300 font-medium shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105">
      {icon}
      {text}
    </span>
  )
}
