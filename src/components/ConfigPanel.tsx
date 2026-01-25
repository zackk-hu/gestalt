'use client'

import React, { useState } from 'react'
import { Settings, X, Key, Server, Cpu } from 'lucide-react'
import { Button } from './Button'
import { Card, CardHeader, CardContent, CardFooter } from './Card'
import { ApiConfig, DEFAULT_CONFIG } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ConfigPanelProps {
  config: ApiConfig
  onConfigChange: (config: ApiConfig) => void
}

export function ConfigPanel({ config, onConfigChange }: ConfigPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localConfig, setLocalConfig] = useState(config)

  const handleSave = () => {
    onConfigChange(localConfig)
    // 保存到 localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('prompt-compiler-config', JSON.stringify(localConfig))
    }
    setIsOpen(false)
  }

  const handleReset = () => {
    setLocalConfig(DEFAULT_CONFIG)
  }

  return (
    <>
      {/* 触发按钮 */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-40"
      >
        <Settings className="w-5 h-5 mr-2" />
        配置
      </Button>

      {/* 遮罩层 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* 头部 */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              引擎配置
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* 内容 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* API Key */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300">
                <Key className="w-4 h-4 mr-2" />
                API Key
              </label>
              <input
                type="password"
                value={localConfig.apiKey}
                onChange={(e) => setLocalConfig({ ...localConfig, apiKey: e.target.value })}
                placeholder="sk-xxxx..."
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
              <p className="text-xs text-slate-500">
                你的 API Key 将仅保存在本地浏览器中
              </p>
            </div>

            {/* Base URL */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300">
                <Server className="w-4 h-4 mr-2" />
                Base URL
              </label>
              <input
                type="text"
                value={localConfig.baseUrl}
                onChange={(e) => setLocalConfig({ ...localConfig, baseUrl: e.target.value })}
                placeholder="https://api.deepseek.com/v1"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            {/* 模型名称 */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300">
                <Cpu className="w-4 h-4 mr-2" />
                模型名称
              </label>
              <input
                type="text"
                value={localConfig.modelName}
                onChange={(e) => setLocalConfig({ ...localConfig, modelName: e.target.value })}
                placeholder="deepseek-chat"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            {/* 预设配置 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                快速预设
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setLocalConfig({
                    ...localConfig,
                    baseUrl: 'https://api-inference.modelscope.cn/v1',
                    modelName: 'Qwen/Qwen2.5-72B-Instruct'
                  })}
                  className="px-3 py-2 text-sm rounded-lg border border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                >
                  ModelScope (推荐)
                </button>
                <button
                  onClick={() => setLocalConfig({
                    ...localConfig,
                    baseUrl: 'https://api.deepseek.com/v1',
                    modelName: 'deepseek-chat'
                  })}
                  className="px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  DeepSeek
                </button>
                <button
                  onClick={() => setLocalConfig({
                    ...localConfig,
                    baseUrl: 'https://api.openai.com/v1',
                    modelName: 'gpt-4o'
                  })}
                  className="px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  OpenAI
                </button>
                <button
                  onClick={() => setLocalConfig({
                    ...localConfig,
                    baseUrl: 'http://localhost:11434/v1',
                    modelName: 'llama3'
                  })}
                  className="px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Ollama
                </button>
              </div>
            </div>
          </div>

          {/* 底部操作 */}
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex gap-3">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              重置
            </Button>
            <Button variant="primary" onClick={handleSave} className="flex-1">
              保存配置
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
