'use client'

import React, { useState } from 'react'
import { Sparkles, Copy, Check, Download, ChevronDown, ChevronUp } from 'lucide-react'
import { getJournalById } from '@/lib/journal-knowledge-base'

interface BlueprintPanelProps {
  analysisResult: {
    title?: string
    entities?: Array<{ name: string; type: string; role: string }>
    relations?: Array<{ from: string; to: string; type: string; evidence: string }>
    blueprintPrompt?: { midjourney: string; dalle: string; stable_diffusion: string }
    suggestedFigureType?: string
    mainFindings?: string[]
  } | null
  selectedJournalId: string
}

const PLATFORM_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  midjourney: { label: 'Midjourney', icon: '🎨', color: 'text-purple-600 dark:text-purple-400' },
  dalle: { label: 'DALL-E', icon: '🖼️', color: 'text-green-600 dark:text-green-400' },
  stable_diffusion: { label: 'Stable Diffusion', icon: '⚙️', color: 'text-blue-600 dark:text-blue-400' }
}

const RELATION_COLORS: Record<string, string> = {
  activates: 'text-green-600 dark:text-green-400',
  inhibits: 'text-red-600 dark:text-red-400',
  binds: 'text-blue-600 dark:text-blue-400',
  phosphorylates: 'text-yellow-600 dark:text-yellow-400',
  upregulates: 'text-emerald-600 dark:text-emerald-400',
  downregulates: 'text-rose-600 dark:text-rose-400',
  regulates: 'text-indigo-600 dark:text-indigo-400',
  colocalizes: 'text-purple-600 dark:text-purple-400'
}

const RELATION_LABELS: Record<string, string> = {
  activates: '激活', inhibits: '抑制', binds: '结合',
  phosphorylates: '磷酸化', upregulates: '上调', downregulates: '下调',
  regulates: '调控', colocalizes: '共定位'
}

export function BlueprintPanel({ analysisResult, selectedJournalId }: BlueprintPanelProps) {
  const [copiedKey, setCopiedKey] = useState('')
  const [showRelations, setShowRelations] = useState(true)

  const journal = selectedJournalId ? getJournalById(selectedJournalId) : null

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(''), 2000)
    } catch {
      // fallback
    }
  }

  const exportJson = () => {
    if (!analysisResult) return
    const blob = new Blob([JSON.stringify({ ...analysisResult, journal: journal?.name }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'blueprint.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!analysisResult) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-violet-500" />
          </div>
          <h2 className="text-sm font-semibold text-gray-800 dark:text-white">蓝图输出</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-400 py-8">
            <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">上传论文后自动生成</p>
            <p className="text-xs mt-1 opacity-70">AI 蓝图和图表提示词将在此显示</p>
          </div>
        </div>
      </div>
    )
  }

  const { blueprintPrompt, entities, relations, suggestedFigureType } = analysisResult

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3 flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-violet-500" />
        </div>
        <h2 className="text-sm font-semibold text-gray-800 dark:text-white">蓝图输出</h2>
        {analysisResult && (
          <button
            onClick={exportJson}
            className="ml-auto flex items-center gap-1 px-2 py-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Download className="w-3 h-3" />
            导出 JSON
          </button>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto space-y-3">

        {/* Journal compliance badge */}
        {journal && (
          <div className="p-2 rounded-xl flex items-center gap-2"
            style={{ backgroundColor: journal.color + '15', border: `1px solid ${journal.color}40` }}>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: journal.color }} />
            <span className="text-xs font-medium" style={{ color: journal.color }}>
              符合 {journal.name} 图表规范
            </span>
          </div>
        )}

        {/* Suggested figure type */}
        {suggestedFigureType && (
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
            <p className="text-xs text-indigo-700 dark:text-indigo-400">
              💡 建议图类型：<strong>{suggestedFigureType}</strong>
            </p>
          </div>
        )}

        {/* Relations graph (text representation) */}
        {relations && relations.length > 0 && (
          <div className="p-3 bg-white dark:bg-slate-800/60 rounded-xl border border-gray-100 dark:border-slate-700/50">
            <button
              className="flex items-center justify-between w-full"
              onClick={() => setShowRelations(!showRelations)}
            >
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                🔗 实体关系图 ({relations.length})
              </p>
              {showRelations ? <ChevronUp className="w-3 h-3 text-gray-400" /> : <ChevronDown className="w-3 h-3 text-gray-400" />}
            </button>
            {showRelations && (
              <div className="mt-2 space-y-2">
                {relations.slice(0, 8).map((rel, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs">
                    <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-700 rounded text-gray-700 dark:text-gray-300 font-medium truncate max-w-[80px]">
                      {rel.from}
                    </span>
                    <span className={`font-bold flex-shrink-0 ${RELATION_COLORS[rel.type] || 'text-gray-500'}`}>
                      → {RELATION_LABELS[rel.type] || rel.type} →
                    </span>
                    <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-700 rounded text-gray-700 dark:text-gray-300 font-medium truncate max-w-[80px]">
                      {rel.to}
                    </span>
                  </div>
                ))}
                {relations.length > 8 && (
                  <p className="text-xs text-gray-400">...以及 {relations.length - 8} 个其他关系</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Entity summary stats */}
        {entities && entities.length > 0 && (
          <div className="p-3 bg-white dark:bg-slate-800/60 rounded-xl border border-gray-100 dark:border-slate-700/50">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">📊 实体统计</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(
                entities.reduce((acc: Record<string, number>, e) => {
                  acc[e.type] = (acc[e.type] || 0) + 1
                  return acc
                }, {})
              ).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between px-2 py-1 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{type}</span>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Prompt outputs */}
        {blueprintPrompt && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 px-1">🤖 AI 图表提示词</p>
            {Object.entries(blueprintPrompt).map(([platform, prompt]) => {
              const meta = PLATFORM_LABELS[platform]
              if (!meta || !prompt) return null
              return (
                <div key={platform} className="p-3 bg-white dark:bg-slate-800/60 rounded-xl border border-gray-100 dark:border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-semibold ${meta.color}`}>
                      {meta.icon} {meta.label}
                    </span>
                    <button
                      onClick={() => copyToClipboard(prompt, platform)}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      {copiedKey === platform ? (
                        <><Check className="w-3 h-3 text-green-500" /><span className="text-green-500">已复制</span></>
                      ) : (
                        <><Copy className="w-3 h-3" /><span>复制</span></>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-mono bg-gray-50 dark:bg-slate-700/50 p-2 rounded-lg">
                    {prompt}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
