'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Copy, Check, ChevronDown, ChevronUp, Cpu, Loader2, Sparkles, Trash2, User, Bot, Play, Maximize2, Minimize2 } from 'lucide-react'
import { Button } from './Button'
import { ApiConfig, AVAILABLE_MODELS, ModelOption, Message, generateId } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'

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
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPromptExpanded, setIsPromptExpanded] = useState(false)
  
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [chatInput, setChatInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSessionStarted, setIsSessionStarted] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { t } = useI18n()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isPromptExpanded) setIsPromptExpanded(false)
        else if (isExpanded) setIsExpanded(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isExpanded, isPromptExpanded])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  const handleCopy = async () => {
    if (!extractedPrompt) return
    try {
      await navigator.clipboard.writeText(extractedPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  const handleStartSession = () => {
    if (!extractedPrompt.trim()) return
    setIsSessionStarted(true)
    setIsPromptCollapsed(true)
    setChatMessages([])
    inputRef.current?.focus()
  }

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
          content: `${t('test.error')}: ${data.error || t('chat.unknownError')}`,
          timestamp: Date.now()
        }
        setChatMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: t('test.networkError'),
        timestamp: Date.now()
      }
      setChatMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearChat = () => {
    setChatMessages([])
    setIsSessionStarted(false)
    setIsPromptCollapsed(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleModelChange = (model: ModelOption) => {
    setSelectedModel(model)
    setIsModelOpen(false)
    if (isSessionStarted) {
      setChatMessages([])
    }
  }

  return (
    <>
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {isPromptExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsPromptExpanded(false)}
        />
      )}

      {isPromptExpanded && (
        <div className="fixed inset-4 md:inset-8 lg:inset-16 z-50 bg-white dark:bg-slate-800 rounded-xl shadow-2xl shadow-gray-300/50 dark:shadow-black/30 border border-gray-100 dark:border-slate-700/50 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-700/50 bg-gradient-to-r from-amber-500/5 to-orange-500/5 dark:from-amber-500/10 dark:to-orange-500/10">
            <span className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white">
              <Sparkles className="w-5 h-5 text-primary-500" />
              System Prompt
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant={copied ? 'secondary' : 'ghost'}
                size="sm"
                onClick={handleCopy}
                disabled={!extractedPrompt}
              >
                {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                {copied ? t('test.copied') : t('test.copy')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPromptExpanded(false)}
                title={t('test.exitFullscreen')}
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-hidden">
            <textarea
              value={extractedPrompt}
              onChange={(e) => onPromptChange(e.target.value)}
              placeholder={t('test.promptPlaceholder')}
              className="w-full h-full px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm font-mono"
            />
          </div>
        </div>
      )}
      
      <div className={cn(
        "flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-lg shadow-gray-200/50 dark:shadow-black/20 border border-gray-100 dark:border-slate-700/50 overflow-hidden transition-all duration-300",
        isExpanded 
          ? "fixed inset-4 z-50 md:inset-8 lg:inset-16" 
          : "h-full"
      )}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-700/50 bg-gradient-to-r from-green-500/5 to-emerald-500/5 dark:from-green-500/10 dark:to-emerald-500/10">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            {t('test.title')}
          </h2>
          <div className="flex items-center gap-2">
            {isSessionStarted && (
              <Button variant="ghost" size="sm" onClick={handleClearChat}>
                <Trash2 className="w-4 h-4 mr-1" />
                {t('test.reset')}
              </Button>
            )}
            <Button
              variant={copied ? 'secondary' : 'ghost'}
              size="sm"
              onClick={handleCopy}
              disabled={!extractedPrompt}
            >
              {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
              {copied ? t('test.copied') : t('test.copy')}
            </Button>
          </div>
        </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className={cn(
          "border-b border-gray-100 dark:border-slate-700/50 transition-all duration-300",
          isPromptCollapsed ? "p-2" : "p-4"
        )}>
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setIsPromptCollapsed(!isPromptCollapsed)}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-300"
            >
              <Sparkles className="w-4 h-4 text-primary-500" />
              System Prompt {isPromptCollapsed && extractedPrompt && `(${t('test.configured')})`}
              {isPromptCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
            {!isPromptCollapsed && (
              <button
                onClick={() => setIsPromptExpanded(true)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
                title={t('test.fullscreenEdit')}
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {!isPromptCollapsed && (
            <div className="space-y-3">
              <div>
                <textarea
                  value={extractedPrompt}
                  onChange={(e) => onPromptChange(e.target.value)}
                  placeholder={t('test.promptPlaceholder')}
                  className="w-full h-32 px-3 py-2 pr-10 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm font-mono"
                />
              </div>

              <div className="relative">
                <button
                  onClick={() => setIsModelOpen(!isModelOpen)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-left flex items-center justify-between hover:border-primary-500 transition-colors text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-primary-500" />
                    <span className="font-medium text-gray-800 dark:text-white">{selectedModel.name}</span>
                    <span className="text-gray-400 text-xs">· {selectedModel.description}</span>
                  </div>
                  <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", isModelOpen && "rotate-180")} />
                </button>

                {isModelOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-700 rounded-lg border border-gray-100 dark:border-slate-600 shadow-xl shadow-gray-200/50 dark:shadow-black/30 z-20 overflow-hidden">
                    {AVAILABLE_MODELS.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => handleModelChange(model)}
                        className={cn(
                          "w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors text-sm",
                          selectedModel.id === model.id && "bg-primary-50 dark:bg-primary-900/20"
                        )}
                      >
                        <div className="font-medium text-gray-800 dark:text-white">{model.name}</div>
                        <div className="text-xs text-gray-400 dark:text-slate-400">{model.provider} · {model.description}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {!isSessionStarted && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleStartSession}
                  disabled={!extractedPrompt.trim()}
                  className="w-full"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {t('test.startChat')}
                </Button>
              )}
            </div>
          )}
        </div>

        {isSessionStarted ? (
          <div className="flex flex-col flex-1 h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.length === 0 ? (
                <div className="text-center py-8 text-gray-400 dark:text-slate-500">
                  <Bot className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">{t('test.chatWith', { model: selectedModel.name })}</p>
                  <p className="text-xs mt-1">{t('test.promptReady')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatMessages.map((message) => (
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
                          ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white' 
                          : 'bg-green-500 text-white'
                      )}>
                        {message.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                      </div>
                      <div className={cn(
                        'max-w-[85%] px-3 py-2 rounded-xl text-sm',
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-tr-sm shadow-sm shadow-primary-500/20'
                          : 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-100 rounded-tl-sm'
                      )}>
                        <div className="whitespace-pre-wrap break-words max-h-40 overflow-y-auto">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-green-500 text-white">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="px-3 py-2 rounded-xl rounded-tl-sm bg-gray-100 dark:bg-slate-700">
                    <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-gray-100 dark:border-slate-700/50 bg-white dark:bg-slate-800 sticky bottom-0 z-10">
              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('test.inputPlaceholder')}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm"
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
              <div className="flex items-center justify-between mt-2 text-xs text-gray-400 dark:text-slate-500">
                <span>{t('test.currentModel')}: {selectedModel.name}</span>
                <span>{t('test.messageCount', { count: chatMessages.length })}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center text-gray-400 dark:text-slate-500">
              <Cpu className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">{t('test.configPrompt')}</p>
              <p className="text-sm">{t('test.clickStart')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  )
}
