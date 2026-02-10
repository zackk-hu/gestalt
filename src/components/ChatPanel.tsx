'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Trash2, User, Bot, Loader2, Pencil, Check, X, Zap, Brain, GitBranch, FileText, Image as ImageIcon, Video, Paperclip, File, XCircle, RotateCcw } from 'lucide-react'
import { Button } from './Button'
import { Message, ApiConfig, generateId, PromptType, TASK_TYPE_OPTIONS } from '@/lib/types'
import { extractPromptFromResponse, extractReasoningMode, EXAMPLE_QUESTIONS } from '@/lib/prompts'
import { cn } from '@/lib/utils'
import { ClarificationRequest } from '@/lib/rag/types'
import { useI18n } from '@/lib/i18n'

interface ChatPanelProps {
  config: ApiConfig
  onPromptExtracted: (prompt: string) => void
}

// 文件附件接口
interface FileAttachment {
  id: string
  file: File
  name: string
  type: string // 'image' | 'document' | 'other'
  preview?: string // 图片预览URL
  size: number
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
  const { t } = useI18n()
  // 按任务类型分开存储消息历史
  const [messagesByType, setMessagesByType] = useState<Record<PromptType, Message[]>>({
    [PromptType.TEXT]: [],
    [PromptType.IMAGE]: [],
    [PromptType.VIDEO]: [],
  })
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState('')
  const [lastReasoningMode, setLastReasoningMode] = useState<{ complexity: string; mode: string } | null>(null)
  const [taskType, setTaskType] = useState<PromptType>(PromptType.TEXT)
  const [attachments, setAttachments] = useState<FileAttachment[]>([])
  const [clarificationRequest, setClarificationRequest] = useState<ClarificationRequest | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const editInputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 当前任务类型的消息
  const messages = messagesByType[taskType]

  // 更新当前任务类型的消息
  const setMessages = (updater: Message[] | ((prev: Message[]) => Message[])) => {
    setMessagesByType(prev => ({
      ...prev,
      [taskType]: typeof updater === 'function' ? updater(prev[taskType]) : updater
    }))
  }

  // 文件数量限制
  const MAX_FILES = 10

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

  // 清理图片预览URL (组件卸载时)
  useEffect(() => {
    return () => {
      attachments.forEach(att => {
        if (att.preview) URL.revokeObjectURL(att.preview)
      })
    }
  }, [])

  // 获取文件类型分类
  const getFileType = (file: File): 'image' | 'document' | 'other' => {
    if (file.type.startsWith('image/')) return 'image'
    if (file.type.includes('pdf') || file.type.includes('document') || 
        file.type.includes('text') || file.name.endsWith('.txt') ||
        file.name.endsWith('.md') || file.name.endsWith('.json') ||
        file.name.endsWith('.csv') || file.name.endsWith('.xml')) return 'document'
    return 'other'
  }

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  // 处理文件选择
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const remainingSlots = MAX_FILES - attachments.length
    const filesToAdd = Array.from(files).slice(0, remainingSlots)
    
    const newAttachments: FileAttachment[] = filesToAdd.map(file => {
      const fileType = getFileType(file)
      const attachment: FileAttachment = {
        id: generateId(),
        file,
        name: file.name,
        type: fileType,
        size: file.size,
      }
      // 为图片生成预览
      if (fileType === 'image') {
        attachment.preview = URL.createObjectURL(file)
      }
      return attachment
    })
    
    setAttachments(prev => [...prev, ...newAttachments])
    // 重置input以允许重复选择同一文件
    if (fileInputRef.current) fileInputRef.current.value = ''

  }

  // 移除附件
  const removeAttachment = (id: string) => {
    setAttachments(prev => {
      const attachment = prev.find(a => a.id === id)
      if (attachment?.preview) {
        URL.revokeObjectURL(attachment.preview)
      }
      return prev.filter(a => a.id !== id)
    })
  }

  // 触发文件选择
  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

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
    
      if (data.success) {
        // 检查是否需要澄清
        if (data.metadata?.needs_clarification) {
          setClarificationRequest(data.metadata.clarification);
          // 显示澄清请求作为消息
          const clarificationMessage: Message = {
            id: generateId(),
            role: 'assistant',
            content: data.metadata.clarification.message,
            timestamp: Date.now()
          };
          setMessages(prev => [...prev, clarificationMessage]);
        } else if (data.result) {
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
        }
      } else {
        const errorMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: `${t('chat.error')}${data.error || t('chat.unknownError')}`,
          timestamp: Date.now()
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: t('chat.networkError'),
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }

  }

  // 发送新消息
  const handleSend = async () => {
    if ((!input.trim() && attachments.length === 0) || isLoading) return

    // 构建包含附件信息的消息内容
    let messageContent = input.trim()
    if (attachments.length > 0) {
      const attachmentInfo = attachments.map(att => 
        `[${t('chat.attachment')}: ${att.name} (${att.type === 'image' ? t('chat.image') : att.type === 'document' ? t('chat.document') : t('chat.file')}, ${formatFileSize(att.size)})]`
      ).join('\n')
      messageContent = messageContent 
        ? `${messageContent}\n\n---\n${attachmentInfo}`
        : attachmentInfo
    }
    
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: messageContent,
      timestamp: Date.now()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    // 清空附件并释放预览URL
    attachments.forEach(att => {
      if (att.preview) URL.revokeObjectURL(att.preview)
    })
    setAttachments([])
    
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
    // 清空附件并释放预览URL
    attachments.forEach(att => {
      if (att.preview) URL.revokeObjectURL(att.preview)
    })
    setAttachments([])
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

  // 处理澄清选项的选择
  const handleClarificationSelect = async (optionId: string) => {
    if (!clarificationRequest) return;
    

    // 添加用户的选择作为消息
    const userChoiceMessage: Message = {
      id: generateId(),
      role: 'user',
      content: `${t('chat.select')}: ${optionId}`,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userChoiceMessage]);
    setClarificationRequest(null); // 隐藏澄清请求
    
    // 构建包含澄清选择的新请求
    const refinedInput = `${clarificationRequest.original_query} [已选择领域: ${optionId}]`;
    
    const refinedMessage: Message = {
      id: generateId(),
      role: 'user',
      content: refinedInput,
      timestamp: Date.now()
    };
    
    await sendMessage(messages, refinedMessage);

  };

  // 重试澄清请求
  const handleRetryClarification = () => {
    setClarificationRequest(null);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-xl shadow-lg shadow-gray-200/50 dark:shadow-black/20 border border-gray-100 dark:border-slate-700/50 overflow-hidden" style={{ minHeight: 0 }}>
      {/* 头部 (Fixed) */}
      <div className="flex-none flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-700/50 bg-gradient-to-r from-primary-500/5 to-accent-500/5 dark:from-primary-500/10 dark:to-accent-500/10 z-10">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            {t('chat.title')}
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
          {t('chat.clear')}
        </Button>
      </div>

      {/* 任务类型选择器 (Fixed) */}
      <div className="flex-none px-4 py-2 border-b border-gray-100 dark:border-slate-700/50 bg-gray-50/50 dark:bg-slate-800/50 z-10">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 dark:text-slate-500">{t('chat.taskType')}</span>
          <div className="flex gap-1">
            {TASK_TYPE_OPTIONS.map((option) => {
              const nameKey = option.type === PromptType.TEXT ? 'type.text' : option.type === PromptType.IMAGE ? 'type.image' : 'type.video'
              const descKey = option.type === PromptType.TEXT ? 'type.textDesc' : option.type === PromptType.IMAGE ? 'type.imageDesc' : 'type.videoDesc'
              return (
              <button
                key={option.type}
                onClick={() => setTaskType(option.type)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  taskType === option.type
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-sm shadow-primary-500/20'
                    : 'bg-white dark:bg-slate-700 text-gray-500 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600'
                )}
                title={t(descKey as any)}
              >
                <span>{option.icon}</span>
                <span>{t(nameKey as any)}</span>
              </button>
              )
            })}
          </div>
        </div>
      </div>
    
      {/* 消息列表 (Flexible & Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-slate-800 scroll-smooth" style={{ minHeight: 0 }}>
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 dark:text-slate-500 mb-4">
              <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>{t('chat.startChat')}{
                taskType === PromptType.TEXT ? t('chat.promptSuffix') : 
                taskType === PromptType.IMAGE ? t('chat.imageEffect') : 
                t('chat.videoEffect')
              }</p>
              <p className="text-sm mt-1">
                {taskType === PromptType.TEXT 
                  ? t('chat.textAutoDesc')
                  : taskType === PromptType.IMAGE
                  ? t('chat.imageAutoDesc')
                  : t('chat.videoAutoDesc')}
              </p>
            </div>
            
            {/* 推理模式说明 (仅文本模式显示) */}
            {taskType === PromptType.TEXT && (
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs">
                  <Zap className="w-3 h-3" />
                  {t('chat.intuition')}
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs">
                  <Brain className="w-3 h-3" />
                  {t('chat.cot')}
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs">
                  <GitBranch className="w-3 h-3" />
                  {t('chat.tot')}
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
                  className="px-3 py-1.5 text-xs rounded-full bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
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
                  ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-sm shadow-primary-500/20' 
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-300'
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
                      className="w-full px-3 py-2 rounded-xl border-2 border-primary-500 bg-white dark:bg-slate-700 text-gray-800 dark:text-white focus:outline-none resize-none text-sm"
                      rows={Math.min(8, editingContent.split('\n').length + 1)}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={handleCancelEdit}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-400 transition-colors"
                        title={t('chat.cancelEsc')}
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleConfirmEdit(message.id)}
                        disabled={!editingContent.trim() || isLoading}
                        className="p-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white disabled:opacity-50 transition-colors"
                        title={t('chat.confirmResend')}
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
                        ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-tr-sm shadow-sm shadow-primary-500/20'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-100 rounded-tl-sm'
                    )}>
                      <div className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </div>
                    </div>
                    
                    {/* 用户消息的编辑按钮 */}
                    {message.role === 'user' && !isLoading && (
                      <button
                        onClick={() => handleStartEdit(message)}
                        className="mt-1 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-all"
                        title={t('chat.editMessage')}
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
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-slate-700">
              <Bot className="w-4 h-4 text-gray-500 dark:text-slate-300" />
            </div>
            <div className="px-4 py-2 rounded-2xl rounded-tl-sm bg-gray-100 dark:bg-slate-700">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                <span className="text-xs text-gray-400 dark:text-slate-400">{t('chat.analyzing')}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* 澄清请求组件 */}
        {clarificationRequest && (
          <div className="mb-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/50">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-blue-700 dark:text-blue-300 mb-2">
                  {clarificationRequest.message}
                </div>
                <div className="flex flex-wrap gap-2">
                  {clarificationRequest.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleClarificationSelect(option.id)}
                      className="px-3 py-2 text-sm rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                    >
                      {option.label}
                      {option.description && (
                        <div className="text-xs opacity-80 mt-1">{option.description}</div>
                      )}
                    </button>
                  ))}
                </div>
                <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                  {t('chat.selectOption')}
                </div>
              </div>
              <button
                onClick={handleRetryClarification}
                className="p-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-500 dark:text-blue-400"
                title={t('chat.regenerate')}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    
      {/* 输入区域 (Fixed at bottom) */}
      <div className="flex-none border-t border-gray-100 dark:border-slate-700/50 p-4 flex flex-col gap-3 bg-white dark:bg-slate-800 z-10">
        {/* 附件预览列表 */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {attachments.map(att => (
              <div 
                key={att.id}
                className="relative group flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-100 dark:border-slate-600"
              >
                {att.type === 'image' && att.preview ? (
                  <img 
                    src={att.preview} 
                    alt={att.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-slate-600 rounded">
                    {att.type === 'image' ? (
                      <ImageIcon className="w-5 h-5 text-gray-400" />
                    ) : att.type === 'document' ? (
                      <FileText className="w-5 h-5 text-gray-400" />
                    ) : (
                      <File className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-medium text-gray-600 dark:text-slate-300 truncate max-w-[120px]">
                    {att.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatFileSize(att.size)}
                  </span>
                </div>
                <button
                  onClick={() => removeAttachment(att.id)}
                  className="absolute -top-1.5 -right-1.5 p-0.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title={t('chat.removeAttachment')}
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            ))}
            {attachments.length >= MAX_FILES && (
              <div className="flex items-center px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
                {t('chat.maxFiles')} ({MAX_FILES})
              </div>
            )}
          </div>
        )}
    
        {/* 隐藏的文件输入 */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.txt,.md,.json,.csv,.xml,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />
    
        <div className="flex gap-2">
          {/* 上传按钮 */}
          <Button
            variant="ghost"
            onClick={triggerFileSelect}
            disabled={isLoading || attachments.length >= MAX_FILES}
            className="self-end"
            title={`${t('chat.uploadFile')} (${attachments.length}/${MAX_FILES})`}
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('chat.inputPlaceholder')}
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows={2}
            disabled={isLoading}
          />
          <Button
            variant="primary"
            onClick={handleSend}
            disabled={(!input.trim() && attachments.length === 0) || isLoading}
            className="self-end"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-400 dark:text-slate-500">
          {t('chat.inputHint')} ({t('chat.currentMode')}{TASK_TYPE_OPTIONS.find(o => o.type === taskType)?.name})
        </p>
      </div>
    </div>

  )
}
