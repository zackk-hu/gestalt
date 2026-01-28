'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Trash2, User, Bot, Loader2, Pencil, Check, X, Zap, Brain, GitBranch, FileText, Image as ImageIcon, Video } from 'lucide-react'
import { Button } from './Button'
import { Message, ApiConfig, generateId, PromptType, TASK_TYPE_OPTIONS } from '@/lib/types'
import { extractPromptFromResponse, extractReasoningMode, EXAMPLE_QUESTIONS } from '@/lib/prompts'
import { cn } from '@/lib/utils'

interface ChatPanelProps {
  config: ApiConfig
  onPromptExtracted: (prompt: string) => void
}

// 推理模式标签组件
function ReasoningModeTag({ mode, complexity }: { mode: string; complexity: string }) {
  const getModeIcon = () => {
    if (mode.includes('思维树') || mode.includes('ToT')) {
      return <GitBranch className="w-3 h-3" />
    } else if (mode.includes('思维链') || mode.includes('CoT')) {
      return <Brain className="w-3 h-3" />
    }
    return <Zap className="w-3 h-3" />
  }

  const getModeColor = () => {
    if (mode.includes('思维树') || mode.includes('ToT')) {
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800'
    } else if (mode.includes('思维链') || mode.includes('CoT')) {
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800'
    }
    return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800'
  }

  return (
    <div className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border', getModeColor())}>
      {getModeIcon()}
      <span>{complexity} · {mode}</span>
    </div>
  )
}

export function ChatPanel({ config, onPromptExtracted }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState('')
  const [lastReasoningMode, setLastReasoningMode] = useState<{ complexity: string; mode: string } | null>(null)
  const [taskType, setTaskType] = useState<PromptType>(PromptType.TEXT)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const editInputRef = useRef<HTMLTextAreaElement>(null)

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 聚焦编辑框
  useEffect(() => {
    if (editingMessageId && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.setSelectionRange(editingContent.length, editingContent.length)
    }
  }, [editingMessageId])

  // 发送消息的核心逻辑
  const sendMessage = async (messagesToSend: Message[], newUserMessage: Message) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messagesToSend, newUserMessage],
          config,
          taskType,  // 传递任务类型
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
        setMessages(prev => [...prev, assistantMessage])

        // 尝试提取推理模式
        const reasoningMode = extractReasoningMode(data.result)
        if (reasoningMode) {
          setLastReasoningMode(reasoningMode)
        }

        // 尝试提取 Prompt
        const extractedPrompt = extractPromptFromResponse(data.result)
        if (extractedPrompt) {
          onPromptExtracted(extractedPrompt)
        }
      } else {
        const errorMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: `抱歉，发生了错误：${data.error || '未知错误'}`,
          timestamp: Date.now()
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: '网络错误，请检查连接后重试',
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // 发送新消息
  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    
    await sendMessage(messages, userMessage)
  }

  // 开始编辑消息
  const handleStartEdit = (message: Message) => {
    setEditingMessageId(message.id)
    setEditingContent(message.content)
  }

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingMessageId(null)
    setEditingContent('')
  }

  // 确认编辑并重新发送
  const handleConfirmEdit = async (messageId: string) => {
    if (!editingContent.trim() || isLoading) return

    // 找到被编辑消息的索引
    const editIndex = messages.findIndex(m => m.id === messageId)
    if (editIndex === -1) return

    // 保留该消息之前的所有消息
    const previousMessages = messages.slice(0, editIndex)
    
    // 创建编辑后的新消息
    const editedMessage: Message = {
      id: generateId(),
      role: 'user',
      content: editingContent.trim(),
      timestamp: Date.now()
    }

    // 更新消息列表（删除编辑消息及之后的所有消息，添加新的编辑消息）
    setMessages([...previousMessages, editedMessage])
    setEditingMessageId(null)
    setEditingContent('')

    // 重新发送
    await sendMessage(previousMessages, editedMessage)
  }

  // 处理编辑框键盘事件
  const handleEditKeyDown = (e: React.KeyboardEvent, messageId: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleConfirmEdit(messageId)
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  // 清空对话
  const handleClear = () => {
    setMessages([])
    setEditingMessageId(null)
    setEditingContent('')
    setLastReasoningMode(null)
    onPromptExtracted('')
  }

  // 处理快捷示例点击
  const handleExampleClick = (example: string) => {
    setInput(example)
    inputRef.current?.focus()
  }

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* 头部 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-primary-500/10 to-accent-500/10">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            提示词编译车间
          </h2>
          {lastReasoningMode && (
            <ReasoningModeTag 
              mode={lastReasoningMode.mode} 
              complexity={lastReasoningMode.complexity} 
            />
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={handleClear}>
          <Trash2 className="w-4 h-4 mr-1" />
          清空
        </Button>
      </div>

      {/* 任务类型选择器 */}
      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">任务类型：</span>
          <div className="flex gap-1">
            {TASK_TYPE_OPTIONS.map((option) => (
              <button
                key={option.type}
                onClick={() => setTaskType(option.type)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  taskType === option.type
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'
                )}
                title={option.description}
              >
                <span>{option.icon}</span>
                <span>{option.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-slate-400 dark:text-slate-500 mb-4">
              <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>开始对话，描述你想要的{
                taskType === PromptType.TEXT ? '提示词' : 
                taskType === PromptType.IMAGE ? '图片效果' : 
                '视频效果'
              }</p>
              <p className="text-sm mt-1">
                {taskType === PromptType.TEXT 
                  ? '系统会自动判断任务复杂度，智能切换推理模式，支持 RAG 知识增强'
                  : taskType === PromptType.IMAGE
                  ? '系统会用"导演视角"结构化你的创意，支持风格参考检索'
                  : '系统会生成专业的分镜脚本和运镜指令，支持影片风格参考'}
              </p>
            </div>
            
            {/* 推理模式说明 (仅文本模式显示) */}
            {taskType === PromptType.TEXT && (
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs">
                  <Zap className="w-3 h-3" />
                  直觉式 · 简单任务
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs">
                  <Brain className="w-3 h-3" />
                  思维链 · 中等任务
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs">
                  <GitBranch className="w-3 h-3" />
                  思维树 · 复杂任务
                </div>
              </div>
            )}

            {/* 图片模式说明 */}
            {taskType === PromptType.IMAGE && (
              <div className="flex flex-wrap justify-center gap-2 mb-4 text-xs">
                <span className="px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                  Subject 主体
                </span>
                <span className="px-2 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300">
                  Environment 环境
                </span>
                <span className="px-2 py-1 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300">
                  Photography 摄影
                </span>
                <span className="px-2 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300">
                  Style 风格
                </span>
              </div>
            )}

            {/* 视频模式说明 */}
            {taskType === PromptType.VIDEO && (
              <div className="flex flex-wrap justify-center gap-2 mb-4 text-xs">
                <span className="px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                  Scene 场面调度
                </span>
                <span className="px-2 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300">
                  Camera 运镜
                </span>
                <span className="px-2 py-1 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300">
                  Motion 运动
                </span>
                <span className="px-2 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300">
                  Atmosphere 氛围
                </span>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {EXAMPLE_QUESTIONS[taskType].slice(0, 4).map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  className="px-3 py-1.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'group flex gap-3',
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                message.role === 'user' 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              )}>
                {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              
              {/* 消息内容 */}
              <div className={cn(
                'max-w-[80%] relative',
                message.role === 'user' ? 'flex flex-col items-end' : ''
              )}>
                {editingMessageId === message.id ? (
                  // 编辑模式
                  <div className="w-full min-w-[200px]">
                    <textarea
                      ref={editInputRef}
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      onKeyDown={(e) => handleEditKeyDown(e, message.id)}
                      className="w-full px-3 py-2 rounded-xl border-2 border-primary-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none resize-none text-sm"
                      rows={Math.min(8, editingContent.split('\n').length + 1)}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={handleCancelEdit}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                        title="取消 (Esc)"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleConfirmEdit(message.id)}
                        disabled={!editingContent.trim() || isLoading}
                        className="p-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white disabled:opacity-50 transition-colors"
                        title="确认并重新发送 (Enter)"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  // 正常显示模式
                  <>
                    <div className={cn(
                      'px-4 py-2 rounded-2xl',
                      message.role === 'user'
                        ? 'bg-primary-500 text-white rounded-tr-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-sm'
                    )}>
                      <div className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </div>
                    </div>
                    
                    {/* 用户消息的编辑按钮 */}
                    {message.role === 'user' && !isLoading && (
                      <button
                        onClick={() => handleStartEdit(message)}
                        className="mt-1 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all"
                        title="编辑此消息"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-200 dark:bg-slate-700">
              <Bot className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </div>
            <div className="px-4 py-2 rounded-2xl rounded-tl-sm bg-slate-100 dark:bg-slate-800">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                <span className="text-xs text-slate-500">分析任务复杂度...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="描述你想要的提示词... (Enter 发送，Shift+Enter 换行)"
            className="flex-1 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            rows={2}
            disabled={isLoading}
          />
          <Button
            variant="primary"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="self-end"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          悬停消息可编辑 · 当前模式：{TASK_TYPE_OPTIONS.find(o => o.type === taskType)?.name}
        </p>
      </div>
    </div>
  )
}
