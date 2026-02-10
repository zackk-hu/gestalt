'use client'

import React, { useState } from 'react'
import { Settings, X, Key, Server, Cpu } from 'lucide-react'
import { Button } from './Button'
import { Card, CardHeader, CardContent, CardFooter } from './Card'
import { ApiConfig, DEFAULT_CONFIG } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'

interface ConfigPanelProps {
  config: ApiConfig
  onConfigChange: (config: ApiConfig) => void
}

export function ConfigPanel({ config, onConfigChange }: ConfigPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localConfig, setLocalConfig] = useState(config)
  const { t } = useI18n()

  const handleSave = () => {
    onConfigChange(localConfig)
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
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-40"
      >
        <Settings className="w-5 h-5 mr-2" />
        {t('config.button')}
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={cn(
          'fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-800 shadow-2xl shadow-gray-300/50 dark:shadow-black/30 z-50 transform transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-700/50">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {t('config.title')}
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-600 dark:text-slate-300">
                <Key className="w-4 h-4 mr-2" />
                API Key
              </label>
              <input
                type="password"
                value={localConfig.apiKey}
                onChange={(e) => setLocalConfig({ ...localConfig, apiKey: e.target.value })}
                placeholder="sk-xxxx..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-400 dark:text-slate-500">
                {t('config.apiKeyHint')}
              </p>
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-600 dark:text-slate-300">
                <Server className="w-4 h-4 mr-2" />
                Base URL
              </label>
              <input
                type="text"
                value={localConfig.baseUrl}
                onChange={(e) => setLocalConfig({ ...localConfig, baseUrl: e.target.value })}
                placeholder="https://api.deepseek.com/v1"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-600 dark:text-slate-300">
                <Cpu className="w-4 h-4 mr-2" />
                {t('config.modelName')}
              </label>
              <input
                type="text"
                value={localConfig.modelName}
                onChange={(e) => setLocalConfig({ ...localConfig, modelName: e.target.value })}
                placeholder="deepseek-chat"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 dark:text-slate-300">
                {t('config.quickPresets')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setLocalConfig({
                    ...localConfig,
                    baseUrl: 'https://api-inference.modelscope.cn/v1',
                    modelName: 'Qwen/Qwen2.5-72B-Instruct'
                  })}
                  className="px-3 py-2 text-sm rounded-xl border border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                >
                  ModelScope ({t('config.recommended')})
                </button>
                <button
                  onClick={() => setLocalConfig({
                    ...localConfig,
                    baseUrl: 'https://api.deepseek.com/v1',
                    modelName: 'deepseek-chat'
                  })}
                  className="px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-gray-600 dark:text-slate-300"
                >
                  DeepSeek
                </button>
                <button
                  onClick={() => setLocalConfig({
                    ...localConfig,
                    baseUrl: 'https://api.openai.com/v1',
                    modelName: 'gpt-4o'
                  })}
                  className="px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-gray-600 dark:text-slate-300"
                >
                  OpenAI
                </button>
                <button
                  onClick={() => setLocalConfig({
                    ...localConfig,
                    baseUrl: 'http://localhost:11434/v1',
                    modelName: 'llama3'
                  })}
                  className="px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-gray-600 dark:text-slate-300"
                >
                  Ollama
                </button>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-700/50 flex gap-3">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              {t('config.reset')}
            </Button>
            <Button variant="primary" onClick={handleSave} className="flex-1">
              {t('config.save')}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
