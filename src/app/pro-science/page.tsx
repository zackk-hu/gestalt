'use client'

import { useState } from 'react'
import { PdfUploadPanel } from '@/components/professional/PdfUploadPanel'
import { JournalSelectorPanel } from '@/components/professional/JournalSelectorPanel'
import { BlueprintPanel } from '@/components/professional/BlueprintPanel'

export interface AnalysisResult {
  title?: string
  authors?: string[]
  journal?: string
  entities?: Array<{ name: string; type: string; role: string }>
  relations?: Array<{ from: string; to: string; type: string; evidence: string }>
  blueprintPrompt?: { midjourney: string; dalle: string; stable_diffusion: string }
  suggestedFigureType?: string
  mainFindings?: string[]
  mode?: string
  fileName?: string
  numPages?: number
  textLength?: number
  abstract?: string
  keywords?: string[]
  researchType?: string
  extractedText?: string
  summary?: string
}

export default function ProSciencePage() {
  const [selectedJournalId, setSelectedJournalId] = useState('')
  const [analysisMode, setAnalysisMode] = useState<'basic' | 'deep'>('deep')
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)

  return (
    <main className="h-full flex flex-col overflow-hidden">
      {/* Sub-header */}
      <div className="flex-none px-4 pt-3 pb-2 border-b border-gray-100 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-800 dark:text-white">🔬 科研专业模式</h2>
            <p className="text-xs text-gray-400 mt-0.5">PDF 论文解析 · 期刊规范 · AI 蓝图生成</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">分析模式：</span>
            <div className="flex bg-gray-100 dark:bg-slate-700 rounded-lg p-0.5">
              <button
                onClick={() => setAnalysisMode('basic')}
                className={`px-3 py-1 text-xs rounded-md transition-all ${
                  analysisMode === 'basic'
                    ? 'bg-white dark:bg-slate-600 text-gray-800 dark:text-white shadow-sm font-medium'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}
              >
                📄 基础
              </button>
              <button
                onClick={() => setAnalysisMode('deep')}
                className={`px-3 py-1 text-xs rounded-md transition-all ${
                  analysisMode === 'deep'
                    ? 'bg-white dark:bg-slate-600 text-gray-800 dark:text-white shadow-sm font-medium'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}
              >
                🧠 深度
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Three-column layout */}
      <div className="flex-1 min-h-0 px-4 py-4">
        <div className="max-w-7xl mx-auto h-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">

            {/* Left: PDF Upload */}
            <div className="min-h-0 bg-white dark:bg-slate-800/60 rounded-2xl border border-gray-100 dark:border-slate-700/50 p-4 flex flex-col shadow-sm">
              <PdfUploadPanel
                onAnalysisComplete={(result) => setAnalysisResult(result)}
                selectedJournalId={selectedJournalId}
                analysisMode={analysisMode}
              />
            </div>

            {/* Center: Journal Selector */}
            <div className="min-h-0 bg-white dark:bg-slate-800/60 rounded-2xl border border-gray-100 dark:border-slate-700/50 p-4 flex flex-col shadow-sm overflow-y-auto">
              <JournalSelectorPanel
                selectedJournalId={selectedJournalId}
                onSelect={setSelectedJournalId}
              />
            </div>

            {/* Right: Blueprint Output */}
            <div className="min-h-0 bg-white dark:bg-slate-800/60 rounded-2xl border border-gray-100 dark:border-slate-700/50 p-4 flex flex-col shadow-sm">
              <BlueprintPanel
                analysisResult={analysisResult}
                selectedJournalId={selectedJournalId}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
