'use client'

import React, { useState, useRef } from 'react'
import { Upload, FileText, X, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import type { AnalysisResult } from '@/app/pro-science/page'

interface PdfUploadPanelProps {
  onAnalysisComplete: (result: AnalysisResult | null) => void
  selectedJournalId: string
  analysisMode: 'basic' | 'deep'
}

const ENTITY_COLORS: Record<string, string> = {
  protein: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  gene: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  compound: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  pathway: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  cell: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  disease: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  drug: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  organism: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
}

const ENTITY_ICONS: Record<string, string> = {
  protein: '🧬', gene: '🔬', compound: '⚗️', pathway: '🔗',
  cell: '🫧', disease: '🏥', drug: '💊', organism: '🦠'
}

export function PdfUploadPanel({ onAnalysisComplete, selectedJournalId, analysisMode }: PdfUploadPanelProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')
  const [showEntities, setShowEntities] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('请上传 PDF 格式的文件')
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('文件大小不能超过 20MB')
      return
    }

    setError('')
    setIsAnalyzing(true)
    setAnalysisResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('mode', analysisMode)
      if (selectedJournalId) formData.append('journalId', selectedJournalId)

      const res = await fetch('/api/analyze-pdf', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()
      if (data.success) {
        setAnalysisResult(data.data as AnalysisResult)
        onAnalysisComplete(data.data as AnalysisResult)
      } else {
        setError(data.error || '分析失败')
      }
    } catch {
      setError('网络错误，请稍后重试')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3 flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <FileText className="w-4 h-4 text-blue-500" />
        </div>
        <h2 className="text-sm font-semibold text-gray-800 dark:text-white">论文上传</h2>
        <span className="text-xs text-gray-400 ml-auto">
          {analysisMode === 'deep' ? '🧠 深度分析' : '📄 基础解析'}
        </span>
      </div>

      {/* Upload area */}
      {!analysisResult && (
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex-shrink-0
            ${isDragging
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 bg-gray-50/50 dark:bg-slate-800/30'
            }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleInputChange} />
          {isAnalyzing ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">正在分析论文...</p>
              <p className="text-xs text-gray-400">AI 正在提取关键信息</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-2">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Upload className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">拖拽或点击上传 PDF</p>
              <p className="text-xs text-gray-400">支持科研论文，最大 20MB</p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-600 dark:text-red-400 flex items-center gap-1 flex-shrink-0">
          <X className="w-3 h-3 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Analysis results */}
      {analysisResult && (
        <div className="flex-1 min-h-0 overflow-y-auto mt-2 space-y-3">
          {/* File info bar */}
          <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300 truncate max-w-[160px]">
                {analysisResult.fileName}
              </span>
              <span className="text-xs text-gray-400">{analysisResult.numPages}页</span>
            </div>
            <button
              onClick={() => { setAnalysisResult(null); onAnalysisComplete(null) }}
              className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Title & Authors */}
          {analysisResult.title && (
            <div className="p-3 bg-white dark:bg-slate-800/60 rounded-xl border border-gray-100 dark:border-slate-700/50">
              <p className="text-xs font-semibold text-gray-800 dark:text-white line-clamp-2">{analysisResult.title}</p>
              {analysisResult.authors && analysisResult.authors.length > 0 && (
                <p className="text-xs text-gray-400 mt-1">{analysisResult.authors.slice(0, 3).join(', ')}{analysisResult.authors.length > 3 ? ' 等' : ''}</p>
              )}
              {analysisResult.researchType && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs rounded-full">
                  {analysisResult.researchType}
                </span>
              )}
            </div>
          )}

          {/* Abstract */}
          {analysisResult.abstract && (
            <div className="p-3 bg-white dark:bg-slate-800/60 rounded-xl border border-gray-100 dark:border-slate-700/50">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">摘要</p>
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{analysisResult.abstract}</p>
            </div>
          )}

          {/* Keywords */}
          {analysisResult.keywords && analysisResult.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {analysisResult.keywords.map((kw, i) => (
                <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                  {kw}
                </span>
              ))}
            </div>
          )}

          {/* Main findings */}
          {analysisResult.mainFindings && analysisResult.mainFindings.length > 0 && (
            <div className="p-3 bg-white dark:bg-slate-800/60 rounded-xl border border-gray-100 dark:border-slate-700/50">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">主要发现</p>
              <ul className="space-y-1">
                {analysisResult.mainFindings.map((f, i) => (
                  <li key={i} className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-1">
                    <span className="text-blue-500 flex-shrink-0">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Entities */}
          {analysisResult.entities && analysisResult.entities.length > 0 && (
            <div className="p-3 bg-white dark:bg-slate-800/60 rounded-xl border border-gray-100 dark:border-slate-700/50">
              <button
                className="flex items-center justify-between w-full"
                onClick={() => setShowEntities(!showEntities)}
              >
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  生物实体 ({analysisResult.entities.length})
                </p>
                {showEntities ? <ChevronUp className="w-3 h-3 text-gray-400" /> : <ChevronDown className="w-3 h-3 text-gray-400" />}
              </button>
              {showEntities && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {analysisResult.entities.map((entity, i) => (
                    <span
                      key={i}
                      className={`px-2 py-0.5 text-xs rounded-full font-medium ${ENTITY_COLORS[entity.type] || 'bg-gray-100 text-gray-600'}`}
                      title={entity.role}
                    >
                      {ENTITY_ICONS[entity.type] || '•'} {entity.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Suggested figure type */}
          {analysisResult.suggestedFigureType && (
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/50">
              <p className="text-xs text-indigo-700 dark:text-indigo-300">
                💡 建议图表类型：<strong>{analysisResult.suggestedFigureType}</strong>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
