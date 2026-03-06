'use client'

import React from 'react'
import { BookOpen, Check } from 'lucide-react'
import { JOURNALS, JournalSpec, buildJournalPromptSpec } from '@/lib/journal-knowledge-base'

interface JournalSelectorPanelProps {
  selectedJournalId: string
  onSelect: (journalId: string) => void
}

export function JournalSelectorPanel({ selectedJournalId, onSelect }: JournalSelectorPanelProps) {
  const selectedJournal = JOURNALS.find(j => j.id === selectedJournalId)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3 flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-amber-500" />
        </div>
        <h2 className="text-sm font-semibold text-gray-800 dark:text-white">期刊规范</h2>
        {selectedJournal && (
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium text-white"
            style={{ backgroundColor: selectedJournal.color }}>
            {selectedJournal.name}
          </span>
        )}
      </div>

      {/* Journal grid */}
      <div className="flex-shrink-0 grid grid-cols-2 gap-2 mb-3">
        {JOURNALS.map((journal) => (
          <button
            key={journal.id}
            onClick={() => onSelect(journal.id === selectedJournalId ? '' : journal.id)}
            className={`relative p-2.5 rounded-xl border text-left transition-all duration-200
              ${selectedJournalId === journal.id
                ? 'border-2 shadow-sm'
                : 'border border-gray-100 dark:border-slate-700/50 hover:border-gray-200 dark:hover:border-slate-600 bg-white dark:bg-slate-800/40'
              }`}
            style={selectedJournalId === journal.id ? {
              borderColor: journal.color,
              backgroundColor: journal.color + '15'
            } : {}}
          >
            {selectedJournalId === journal.id && (
              <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: journal.color }}>
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
            )}
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: journal.color }} />
              <span className="text-xs font-bold text-gray-800 dark:text-white truncate">{journal.name}</span>
            </div>
            <span className="text-xs text-gray-400">{journal.field}</span>
          </button>
        ))}
      </div>

      {/* Selected journal specs */}
      {selectedJournal ? (
        <div className="flex-1 min-h-0 overflow-y-auto space-y-3">
          {/* Specs card */}
          <div className="p-3 bg-white dark:bg-slate-800/60 rounded-xl border border-gray-100 dark:border-slate-700/50">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">📐 图表规格</p>
            <div className="space-y-1.5">
              <SpecRow label="最大宽度" value={`${selectedJournal.figureSpecs.maxWidthMm} mm`} />
              <SpecRow label="最大高度" value={`${selectedJournal.figureSpecs.maxHeightMm} mm`} />
              <SpecRow label="分辨率" value={`${selectedJournal.figureSpecs.resolutionDpi} DPI`} />
              <SpecRow label="文件格式" value={selectedJournal.figureSpecs.formats.join(', ')} />
              <SpecRow label="色彩模式" value={selectedJournal.figureSpecs.colorMode.join(', ')} />
              <SpecRow
                label="字体大小"
                value={`${selectedJournal.figureSpecs.fontSizePt.min}–${selectedJournal.figureSpecs.fontSizePt.max} pt`}
              />
            </div>
          </div>

          {/* Color palette */}
          <div className="p-3 bg-white dark:bg-slate-800/60 rounded-xl border border-gray-100 dark:border-slate-700/50">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">🎨 推荐配色</p>
            <div className="flex gap-2">
              {selectedJournal.colorPalette.map((color, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-lg shadow-sm cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Design guidelines */}
          <div className="p-3 bg-white dark:bg-slate-800/60 rounded-xl border border-gray-100 dark:border-slate-700/50">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">📋 设计指南</p>
            <ul className="space-y-1.5">
              {selectedJournal.designGuidelines.map((guide, i) => (
                <li key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1">
                  <span className="text-amber-500 flex-shrink-0 mt-0.5">•</span>
                  <span>{guide}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Prompt prefix */}
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/50">
            <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-1">🤖 AI提示词前缀</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-mono">
              {buildJournalPromptSpec(selectedJournal)}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-400 py-4">
            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-xs">选择期刊查看详细规范</p>
          </div>
        </div>
      )}
    </div>
  )
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{value}</span>
    </div>
  )
}
