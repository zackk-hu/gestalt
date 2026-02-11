'use client'

import React, { useState } from 'react'
import { BookOpen, Star, ExternalLink, Sparkles, Lightbulb, Wrench, Book, Brain, Code2, GraduationCap, Cpu, MessageSquare, Layers, Workflow, FileCode2, Boxes, Network, Zap, Pen } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BookInfo {
  title: string
  author: string
  description: string
  coverUrl: string
  category: '推荐精选' | '实战技巧' | '工具与理论'
  rating: number
  link?: string
}

const BOOKS: BookInfo[] = [
  // ── 推荐精选 ──
  {
    title: 'Prompt Engineering for Generative AI',
    author: 'James Phoenix & Mike Taylor',
    description: 'O\'Reilly 出品，系统讲解面向 LLM/Diffusion 模型的提示词设计方法论与最佳实践。',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781098153427-L.jpg',
    category: '推荐精选',
    rating: 4.5,
    link: 'https://www.oreilly.com/library/view/prompt-engineering-for/9781098153427/',
  },
  {
    title: 'The Art of Prompt Engineering with ChatGPT',
    author: 'Nathan Hunter',
    description: '从零到一掌握 ChatGPT 提示词工程，涵盖角色扮演、链式思维、少样本提示等核心技巧。',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781835082706-L.jpg',
    category: '推荐精选',
    rating: 4.3,
    link: 'https://www.amazon.com/dp/B0C2JBZQLS',
  },
  {
    title: 'ChatGPT Prompt Engineering for Developers',
    author: 'Andrew Ng & Isa Fulford',
    description: 'DeepLearning.AI 联合 OpenAI 推出的开发者向提示词工程课程配套读物，聚焦 API 级实践。',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781835083963-L.jpg',
    category: '推荐精选',
    rating: 4.7,
    link: 'https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/',
  },
  {
    title: 'Build a Large Language Model (From Scratch)',
    author: 'Sebastian Raschka',
    description: 'Manning 出品，从底层理解 LLM 运作原理，帮助提示词工程师深入模型内核做出更好的 Prompt。',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781633437166-L.jpg',
    category: '推荐精选',
    rating: 4.8,
    link: 'https://www.manning.com/books/build-a-large-language-model-from-scratch',
  },
  // ── 实战技巧 ──
  {
    title: 'The Art of Asking ChatGPT for High-Quality Answers',
    author: 'Ibrahim John',
    description: '高质量提问的艺术：通过实例讲解如何向 ChatGPT 提出精准问题获得最佳输出。',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9798371539250-L.jpg',
    category: '实战技巧',
    rating: 4.2,
    link: 'https://www.amazon.com/dp/B0BT2JM737',
  },
  {
    title: 'AI-Powered Developer',
    author: 'Nathan B. Crocker',
    description: 'Manning 出品，面向开发者的 AI 辅助开发指南，提示词工程在软件开发中的深度实践。',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781633436558-L.jpg',
    category: '实战技巧',
    rating: 4.4,
    link: 'https://www.manning.com/books/ai-powered-developer',
  },
  {
    title: 'Prompt Engineering for ChatGPT',
    author: 'Jules White (Vanderbilt)',
    description: 'Coursera 热门课程教材，Vanderbilt 大学出品，从模式库到自动化 Prompt 管线。',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781098156749-L.jpg',
    category: '实战技巧',
    rating: 4.5,
    link: 'https://www.coursera.org/learn/prompt-engineering',
  },
  {
    title: 'Designing Large Language Model Applications',
    author: 'Suhas Pai',
    description: 'O\'Reilly 出品，专注 LLM 应用设计与提示词优化，含 RAG、Agent 等前沿实战模式。',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781098150488-L.jpg',
    category: '实战技巧',
    rating: 4.6,
    link: 'https://www.oreilly.com/library/view/designing-large-language/9781098150488/',
  },
  // ── 工具与理论 ──
  {
    title: 'Prompt Engineering for LLMs',
    author: 'John Berryman & Albert Ziegler',
    description: 'O\'Reilly 出品，深入 LLM 提示词工程的原理、模式与高级技巧，行业标杆级参考书。',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781098153137-L.jpg',
    category: '工具与理论',
    rating: 4.6,
    link: 'https://www.oreilly.com/library/view/prompt-engineering-for/9781098153137/',
  },
  {
    title: 'Natural Language Processing with Transformers',
    author: 'Lewis Tunstall, Leandro von Werra & Thomas Wolf',
    description: 'O\'Reilly + Hugging Face 团队合著，Transformer 架构与 NLP 理论基础，提示词设计的理论根基。',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781098136796-L.jpg',
    category: '工具与理论',
    rating: 4.7,
    link: 'https://www.oreilly.com/library/view/natural-language-processing/9781098136789/',
  },
  {
    title: 'Generative Deep Learning (2nd Ed.)',
    author: 'David Foster',
    description: 'O\'Reilly 经典，涵盖 VAE、GAN、GPT 等生成模型原理，为高级提示词设计提供理论支撑。',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781098134181-L.jpg',
    category: '工具与理论',
    rating: 4.5,
    link: 'https://www.oreilly.com/library/view/generative-deep-learning/9781098134174/',
  },
  {
    title: 'AI Engineering',
    author: 'Chip Huyen',
    description: 'O\'Reilly 出品，涵盖 AI 工程全流程，提示词编排、评估流水线与生产级 LLM 应用架构。',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781098166304-L.jpg',
    category: '工具与理论',
    rating: 4.8,
    link: 'https://www.oreilly.com/library/view/ai-engineering/9781098166298/',
  },
]

const CATEGORIES = [
  { key: '推荐精选' as const, icon: Sparkles, color: 'from-amber-500 to-orange-500' },
  { key: '实战技巧' as const, icon: Lightbulb, color: 'from-emerald-500 to-teal-500' },
  { key: '工具与理论' as const, icon: Wrench, color: 'from-violet-500 to-indigo-500' },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={cn(
            'w-3 h-3',
            i <= Math.floor(rating)
              ? 'fill-amber-400 text-amber-400'
              : i - 0.5 <= rating
              ? 'fill-amber-400/50 text-amber-400'
              : 'text-gray-300 dark:text-slate-600'
          )}
        />
      ))}
      <span className="ml-1 text-xs text-gray-500 dark:text-slate-400">{rating}</span>
    </div>
  )
}

// ── 分类别 Unsplash 回退图片（第二级） ──
const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  '推荐精选': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=280&fit=crop',
  '实战技巧': 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200&h=280&fit=crop',
  '工具与理论': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=280&fit=crop',
}

// ── 每本书独立的图标与渐变色配置（第三级） ──
const BOOK_PLACEHOLDER_STYLES: { icon: React.ElementType; gradient: string; iconColor: string }[] = [
  { icon: Brain,          gradient: 'from-rose-200 to-pink-100 dark:from-rose-900/40 dark:to-pink-900/30',       iconColor: 'text-rose-500 dark:text-rose-400' },
  { icon: MessageSquare,  gradient: 'from-sky-200 to-blue-100 dark:from-sky-900/40 dark:to-blue-900/30',         iconColor: 'text-sky-500 dark:text-sky-400' },
  { icon: Code2,          gradient: 'from-emerald-200 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/30', iconColor: 'text-emerald-500 dark:text-emerald-400' },
  { icon: Layers,         gradient: 'from-amber-200 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/30', iconColor: 'text-amber-500 dark:text-amber-400' },
  { icon: Zap,            gradient: 'from-violet-200 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/30', iconColor: 'text-violet-500 dark:text-violet-400' },
  { icon: Workflow,       gradient: 'from-cyan-200 to-teal-100 dark:from-cyan-900/40 dark:to-teal-900/30',       iconColor: 'text-cyan-500 dark:text-cyan-400' },
  { icon: Cpu,            gradient: 'from-indigo-200 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/30',   iconColor: 'text-indigo-500 dark:text-indigo-400' },
  { icon: FileCode2,      gradient: 'from-orange-200 to-red-100 dark:from-orange-900/40 dark:to-red-900/30',     iconColor: 'text-orange-500 dark:text-orange-400' },
  { icon: Network,        gradient: 'from-fuchsia-200 to-pink-100 dark:from-fuchsia-900/40 dark:to-pink-900/30', iconColor: 'text-fuchsia-500 dark:text-fuchsia-400' },
  { icon: GraduationCap,  gradient: 'from-lime-200 to-green-100 dark:from-lime-900/40 dark:to-green-900/30',     iconColor: 'text-lime-600 dark:text-lime-400' },
  { icon: Boxes,          gradient: 'from-blue-200 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/30',   iconColor: 'text-blue-500 dark:text-blue-400' },
  { icon: Pen,            gradient: 'from-teal-200 to-emerald-100 dark:from-teal-900/40 dark:to-emerald-900/30', iconColor: 'text-teal-500 dark:text-teal-400' },
]

// 类别对应的徽标渐变
const CATEGORY_BADGE: Record<string, string> = {
  '推荐精选': 'from-amber-500 to-orange-500',
  '实战技巧': 'from-emerald-500 to-teal-500',
  '工具与理论': 'from-violet-500 to-indigo-500',
}

/** 个性化占位符：每本书有独特的图标、颜色和首字母标识 */
function BookPlaceholder({ book, globalIndex }: { book: BookInfo; globalIndex: number }) {
  const style = BOOK_PLACEHOLDER_STYLES[globalIndex % BOOK_PLACEHOLDER_STYLES.length]
  const Icon = style.icon
  const initial = book.title.charAt(0).toUpperCase()
  const badgeGradient = CATEGORY_BADGE[book.category] || 'from-gray-500 to-gray-600'

  return (
    <div className={cn('flex flex-col items-center justify-center h-full p-3 bg-gradient-to-br', style.gradient)}>
      {/* 首字母圆形徽章 */}
      <div className={cn('w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-2 shadow-lg', badgeGradient)}>
        <span className="text-xl font-bold text-white drop-shadow">{initial}</span>
      </div>
      {/* 类别专属图标 */}
      <Icon className={cn('w-5 h-5 mb-1.5', style.iconColor)} strokeWidth={1.5} />
      {/* 书名摘要 */}
      <span className="text-[10px] text-center px-2 font-medium text-gray-600 dark:text-slate-300 line-clamp-2 leading-tight">
        {book.title.length > 35 ? book.title.slice(0, 35) + '…' : book.title}
      </span>
    </div>
  )
}

export function PromptBookRoom() {
  const [activeCategory, setActiveCategory] = useState<string>('推荐精选')
  // 0 = 原始URL, 1 = Unsplash回退, 2+ = 个性化占位符
  const [imageErrors, setImageErrors] = useState<Record<string, number>>({})

  const filteredBooks = BOOKS.filter(b => b.category === activeCategory)

  const handleImageError = (bookTitle: string) => {
    setImageErrors(prev => ({
      ...prev,
      [bookTitle]: (prev[bookTitle] || 0) + 1
    }))
  }

  // 获取书籍在全局列表中的索引（用于分配唯一占位符样式）
  const getGlobalIndex = (title: string) => BOOKS.findIndex(b => b.title === title)

  return (
    <section className="py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-3">
            <BookOpen className="w-4 h-4" />
            AI 书房
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            精选提示词工程书籍
          </h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm max-w-lg mx-auto">
            从入门到精通，精选 12 本行业公认的 Prompt Engineering 经典读物
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-3 mb-8">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon
            const isActive = activeCategory === cat.key
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300',
                  isActive
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-lg shadow-indigo-500/20`
                    : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-sm'
                )}
              >
                <Icon className="w-4 h-4" />
                {cat.key}
              </button>
            )
          })}
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredBooks.map((book, idx) => (
            <div
              key={book.title}
              className="group bg-white dark:bg-slate-800/80 rounded-2xl border border-gray-100 dark:border-slate-700/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              {/* Cover - 三级回退: Open Library → 分类别 Unsplash → 个性化占位符 */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center overflow-hidden">
                {(imageErrors[book.title] || 0) >= 2 ? (
                  <BookPlaceholder book={book} globalIndex={getGlobalIndex(book.title)} />
                ) : (
                  <img
                    src={
                      (imageErrors[book.title] || 0) === 0
                        ? book.coverUrl
                        : CATEGORY_FALLBACK_IMAGES[book.category] || CATEGORY_FALLBACK_IMAGES['推荐精选']
                    }
                    alt={book.title}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    className="h-40 w-auto object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
                    onError={() => handleImageError(book.title)}
                    loading="lazy"
                  />
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1 line-clamp-2 leading-snug min-h-[2.5rem]">
                  {book.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">{book.author}</p>
                <StarRating rating={book.rating} />
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {book.description}
                </p>
                {book.link && (
                  <a
                    href={book.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-3 text-xs text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 font-medium transition-colors"
                  >
                    查看详情 <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
