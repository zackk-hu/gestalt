'use client'

import { useState, useEffect } from 'react'
import { ConfigPanel } from '@/components/ConfigPanel'
import { ChatPanel } from '@/components/ChatPanel'
import { TestPanel } from '@/components/TestPanel'
import { PromptEvaluationPanel } from '@/components/PromptEvaluationPanel'
import { PromptCommunity } from '@/components/PromptCommunity'
import { ApiConfig, DEFAULT_CONFIG } from '@/lib/types'

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
    <main className="h-full flex flex-col overflow-y-auto">
      {/* 配置面板 */}
      <ConfigPanel config={config} onConfigChange={setConfig} />

      {/* 主内容 - 左右分栏（固定高度区域） */}
      <div className="flex-none px-4 py-4" style={{ height: 'calc(100vh - 120px)', minHeight: '500px' }}>
        <div className="max-w-7xl mx-auto h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
            {/* 左侧：对话编译器 */}
            <div className="min-h-0 h-full">
              <ChatPanel 
                config={config} 
                onPromptExtracted={setExtractedPrompt} 
              />
            </div>

            {/* 右侧：测试平台 */}
            <div className="min-h-0 h-full">
              <TestPanel 
                config={config} 
                extractedPrompt={extractedPrompt}
                onPromptChange={setExtractedPrompt}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 分隔线 */}
      <div className="max-w-7xl mx-auto w-full px-4">
        <div className="border-t border-gray-200 dark:border-slate-700/50" />
      </div>

      {/* 提示词优化评价 */}
      <PromptEvaluationPanel />

      {/* 分隔线 */}
      <div className="max-w-7xl mx-auto w-full px-4">
        <div className="border-t border-gray-200 dark:border-slate-700/50" />
      </div>

      {/* 社区讨论 */}
      <PromptCommunity />
    </main>
  )
}
