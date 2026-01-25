'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Copy, Check, ChevronDown, ChevronUp, Cpu, Loader2, Sparkles, Trash2, User, Bot, Play } from 'lucide-react'
import { Button } from './Button'
import { ApiConfig, AVAILABLE_MODELS, ModelOption, Message, generateId } from '@/lib/types'
import { cn } from '@/lib/utils'

interface TestPanelProps {
  config: ApiConfig
  extractedPrompt: string
  onPromptChange: (prompt: string) => void
}

export function TestPanel({ config, extractedPrompt, onPromptChange }: TestPanelProps) {
  const [selectedModel, setSelectedModel] = useState<ModelOption>(AVAILABLE_MODELS[0])
  const [isModelOpen, setIsModelOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isPromptCollapsed, setIsPromptCollapsed] = useState(false)
  
  // 对话相关状态
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [chatInput, setChatInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSessionStarted, setIsSessionStarted] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  // 复制提示词
  const handleCopy = async () => {
    if (!extractedPrompt) return
    try {
      await navigator.clipboard.writeText(extractedPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  // 开始对话会话
  const handleStartSession = () => {
    if (!extractedPrompt.trim()) return
    setIsSessionStarted(true)
    setIsPromptCollapsed(true)
    setChatMessages([])
    inputRef.current?.focus()
  }

  // 发送消息
  const handleSend = async () => {
    if (!chatInput.trim() || isLoading || !extractedPrompt.trim()) return

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: chatInput.trim(),
      timestamp: Date.now()
    }

    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: extractedPrompt,
          messages: [...chatMessages, userMessage],
          modelId: selectedModel.id,
          config,
        }),
      })

      const data = await response.json()

      if (data.success && data.result) {
        const assistantMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: data.result,
          timestamp: Date.now()
        }
        setChatMessages(prev => [...prev, assistantMessage])
      } else {
        const errorMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: `错误: ${data.error || '未知错误'}`,
          timestamp: Date.now()
        }
        setChatMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: '网络错误，请检查连接后重试',
        timestamp: Date.now()
      }
      setChatMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // 清空对话
  const handleClearChat = () => {
    setChatMessages([])
    setIsSessionStarted(false)
    setIsPromptCollapsed(false)
  }

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // 切换模型时重置会话
  const handleModelChange = (model: ModelOption) => {
    setSelectedModel(model)
    setIsModelOpen(false)
    if (isSessionStarted) {
      setChatMessages([])
    }
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* 头部 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-green-500/10 to-emerald-500/10">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          效果验证平台
        </h2>
        <div className="flex items-center gap-2">
          {isSessionStarted && (
            <Button variant="ghost" size="sm" onClick={handleClearChat}>
              <Trash2 className="w-4 h-4 mr-1" />
              重置
            </Button>
          )}
          <Button
            variant={copied ? 'secondary' : 'ghost'}
            size="sm"
            onClick={handleCopy}
            disabled={!extractedPrompt}
          >
            {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
            {copied ? '已复制' : '复制'}
          </Button>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 提示词配置区域 - 可折叠 */}
        <div className={cn(
          "border-b border-slate-200 dark:border-slate-700 transition-all duration-300",
          isPromptCollapsed ? "p-2" : "p-4"
        )}>
          {/* 折叠/展开按钮 */}
          <button
            onClick={() => setIsPromptCollapsed(!isPromptCollapsed)}
            className="w-full flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-500" />
              System Prompt {isPromptCollapsed && extractedPrompt && '(已配置)'}
            </span>
            {isPromptCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>

          {!isPromptCollapsed && (
            <div className="space-y-3">
              <textarea
                value={extractedPrompt}
                onChange={(e) => onPromptChange(e.target.value)}
                placeholder="左侧对话生成的 Prompt 会自动显示在这里，也可以手动输入..."
                className="w-full h-32 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm font-mono"
              />

              {/* 模型选择 */}
              <div className="relative">
                <button
                  onClick={() => setIsModelOpen(!isModelOpen)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-left flex items-center justify-between hover:border-primary-500 transition-colors text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-primary-500" />
                    <span className="font-medium text-slate-900 dark:text-white">{selectedModel.name}</span>
                    <span className="text-slate-500 text-xs">· {selectedModel.description}</span>
                  </div>
                  <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", isModelOpen && "rotate-180")} />
                </button>

                {isModelOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xl z-20 overflow-hidden">
                    {AVAILABLE_MODELS.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => handleModelChange(model)}
                        className={cn(
                          "w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm",
                          selectedModel.id === model.id && "bg-primary-50 dark:bg-primary-900/20"
                        )}
                      >
                        <div className="font-medium text-slate-900 dark:text-white">{model.name}</div>
                        <div className="text-xs text-slate-500">{model.provider} · {model.description}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 开始对话按钮 */}
              {!isSessionStarted && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleStartSession}
                  disabled={!extractedPrompt.trim()}
                  className="w-full"
                >
                  <Play className="w-4 h-4 mr-2" />
                  开始对话测试
                </Button>
              )}
            </div>
          )}
        </div>

        {/* 对话区域 */}
        {isSessionStarted ? (
          <>
            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.length === 0 ? (
                <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                  <Bot className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">使用 {selectedModel.name} 进行对话</p>
                  <p className="text-xs mt-1">System Prompt 已配置，开始提问吧</p>
                </div>
              ) : (
                chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-3',
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    )}
                  >
                    <div className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0',
                      message.role === 'user' 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-green-500 text-white'
                    )}>
                      {message.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>
                    <div className={cn(
                      'max-w-[85%] px-3 py-2 rounded-xl text-sm',
                      message.role === 'user'
                        ? 'bg-primary-500 text-white rounded-tr-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-sm'
                    )}>
                      <div className="whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-green-500 text-white">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="px-3 py-2 rounded-xl rounded-tl-sm bg-slate-100 dark:bg-slate-800">
                    <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* 输入区域 */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-700">
              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="输入消息... (Enter 发送)"
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm"
                  rows={2}
                  disabled={isLoading}
                />
                <Button
                  variant="primary"
                  onClick={handleSend}
                  disabled={!chatInput.trim() || isLoading}
                  className="self-end"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                <span>当前模型: {selectedModel.name}</span>
                <span>{chatMessages.length} 条消息</span>
              </div>
            </div>
          </>
        ) : (
          /* 未开始对话时的提示 */
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center text-slate-400 dark:text-slate-500">
              <Cpu className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">配置好 Prompt 后</p>
              <p className="text-sm">点击「开始对话测试」进入交互模式</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
