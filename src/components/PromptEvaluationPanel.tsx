'use client'

import React, { useState } from 'react'
import { Star, Send, Tag, MessageSquare, ThumbsUp, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingDimension {
  key: string
  label: string
  icon: string
  description: string
  color: string
}

const DIMENSIONS: RatingDimension[] = [
  { key: 'creativity',     label: '创意度',   icon: '💡', description: '提示词的创新性与独特性',   color: 'from-amber-400 to-orange-500' },
  { key: 'usability',      label: '实用性',   icon: '✅', description: '实际使用中的可操作性',     color: 'from-emerald-400 to-teal-500' },
  { key: 'relevance',      label: '针对性',   icon: '🎯', description: '是否精准匹配用户需求',     color: 'from-blue-400 to-indigo-500' },
  { key: 'executability',  label: '可执行性', icon: '⚙️', description: '模型能否正确理解和执行',   color: 'from-violet-400 to-purple-500' },
  { key: 'completeness',   label: '完整度',   icon: '📊', description: '覆盖需求的全面程度',       color: 'from-rose-400 to-pink-500' },
]

const QUICK_TAGS = [
  { label: '保存此提示词', icon: '💾' },
  { label: '分享到社区',   icon: '🔗' },
  { label: '效果很好',     icon: '👍' },
  { label: '不够满意',     icon: '😕' },
  { label: '需要改进',     icon: '🔧' },
  { label: '超出预期',     icon: '🎉' },
]

type Ratings = Record<string, number>

function StarSelector({ value, onChange, color }: { value: number; onChange: (v: number) => void; color: string }) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(i)}
          className="p-0.5 transition-transform hover:scale-125"
        >
          <Star
            className={cn(
              'w-5 h-5 transition-colors',
              i <= (hovered || value)
                ? 'fill-amber-400 text-amber-400'
                : 'text-gray-300 dark:text-slate-600'
            )}
          />
        </button>
      ))}
    </div>
  )
}

export function PromptEvaluationPanel() {
  const [ratings, setRatings] = useState<Ratings>(
    Object.fromEntries(DIMENSIONS.map(d => [d.key, 0]))
  )
  const [comment, setComment] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  const handleRating = (key: string, value: number) => {
    setRatings(prev => ({ ...prev, [key]: value }))
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const hasAnyRating = Object.values(ratings).some(v => v > 0)
  const avgRating = hasAnyRating
    ? (Object.values(ratings).reduce((a, b) => a + b, 0) / DIMENSIONS.length).toFixed(1)
    : '—'

  const handleSubmit = () => {
    // TODO: 提交到后端
    setSubmitted(true)
  }

  const handleReset = () => {
    setRatings(Object.fromEntries(DIMENSIONS.map(d => [d.key, 0])))
    setComment('')
    setSelectedTags([])
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">感谢你的评价！</h3>
            <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">
              你的反馈将帮助我们持续优化提示词编译体验
            </p>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              重新评价
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm font-medium mb-3">
            <ThumbsUp className="w-4 h-4" />
            提示词评价
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            为本次提示词编译打分
          </h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm">
            你的评价将帮助我们不断优化编译效果
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-gray-100 dark:border-slate-700/50 shadow-lg shadow-gray-200/30 dark:shadow-black/10 overflow-hidden">
          {/* Rating Dimensions */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                多维度评分
              </h3>
              <div className="text-sm text-gray-500 dark:text-slate-400">
                综合评分：<span className="font-bold text-indigo-600 dark:text-indigo-400">{avgRating}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DIMENSIONS.map(dim => (
                <div
                  key={dim.key}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-700/30 border border-gray-100 dark:border-slate-700/50 transition-colors hover:border-indigo-200 dark:hover:border-indigo-500/30"
                >
                  <span className="text-lg flex-shrink-0">{dim.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-slate-300">{dim.label}</span>
                      <StarSelector
                        value={ratings[dim.key]}
                        onChange={v => handleRating(dim.key, v)}
                        color={dim.color}
                      />
                    </div>
                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{dim.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-slate-700/50" />

          {/* Quick Tags */}
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-indigo-500" />
              快速标签
            </h3>
            <div className="flex flex-wrap gap-2">
              {QUICK_TAGS.map(tag => {
                const isActive = selectedTags.includes(tag.label)
                return (
                  <button
                    key={tag.label}
                    type="button"
                    onClick={() => toggleTag(tag.label)}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all duration-200',
                      isActive
                        ? 'bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
                        : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/50'
                    )}
                  >
                    <span>{tag.icon}</span>
                    {tag.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-slate-700/50" />

          {/* Comment */}
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              文字评论
              <span className="text-xs font-normal text-gray-400 dark:text-slate-500">（可选）</span>
            </h3>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="分享你的使用体验、改进建议或其他想法..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/30 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-300 dark:focus:border-indigo-500/50 resize-none transition-colors"
            />
          </div>

          {/* Action Bar */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-700/50 flex items-center justify-between">
            <button
              onClick={handleReset}
              className="text-sm text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 transition-colors"
            >
              重置
            </button>
            <button
              onClick={handleSubmit}
              disabled={!hasAnyRating}
              className={cn(
                'inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                hasAnyRating
                  ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5'
                  : 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed'
              )}
            >
              <Send className="w-4 h-4" />
              提交评价
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
