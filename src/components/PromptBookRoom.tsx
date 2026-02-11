'use client'

import React, { useState } from 'react'
import { BookOpen, Star, ExternalLink, Sparkles, Lightbulb, Wrench, Book, Brain, Code2, Cpu, GraduationCap } from 'lucide-react'
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
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781098153434-L.jpg',
    category: '推荐精选',
    rating: 4.5,
    link: 'https://www.oreilly.com/library/view/prompt-engineering-for/9781098153427/',
  },
  {
    title: 'The Art of Prompt Engineering with ChatGPT',
    author: 'Nathan Hunter',
    description: '从零到一掌握 ChatGPT 提示词工程，涵盖角色扮演、链式思维、少样本提示等核心技巧。',
    coverUrl: 'https://books.google.com/books/content?id=Z0-hzwEACAAJ&printsec=frontcover&img=1&zoom=1',
    category: '推荐精选',
    rating: 4.3,
    link: 'https://www.amazon.com/dp/B0C2JBZQLS',
  },
  {
    title: 'ChatGPT Prompt Engineering for Developers',
    author: 'Andrew Ng & Isa Fulford',
    description: 'DeepLearning.AI 联合 OpenAI 推出的开发者向提示词工程课程配套读物，聚焦 API 级实践。',
    coverUrl: 'https://img1.od-cdn.com/ImageType-400/2858-1/{37C3A0D3-BBAB-4BC2-AB65-0322190C045E}IMG400.JPG',
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
    coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1675428883i/96369596.jpg',
    category: '实战技巧',
    rating: 4.2,
    link: 'https://www.amazon.com/dp/B0BT2JM737',
  },
  {
    title: 'AI-Powered Developer',
    author: 'Nathan B. Crocker',
    description: 'Manning 出品，面向开发者的 AI 辅助开发指南，提示词工程在软件开发中的深度实践。',
    coverUrl: 'https://images.manning.com/264/352/resize/book/4/a71f55e-fc21-4c21-9bbd-a84e291973a3/Crocker-HI.png',
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
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781098150501-L.jpg',
    category: '实战技巧',
    rating: 4.6,
    link: 'https://www.oreilly.com/library/view/designing-large-language/9781098150495/',
  },
  // ── 工具与理论 ──
  {
    title: 'Prompt Engineering for LLMs',
    author: 'John Berryman & Albert Ziegler',
    description: 'O\'Reilly 出品，深入 LLM 提示词工程的原理、模式与高级技巧，行业标杆级参考书。',
    coverUrl: 'https://books.google.com/books/content?id=9EQvEQAAQBAJ&printsec=frontcover&img=1&zoom=1',
    category: '工具与理论',
    rating: 4.6,
    link: 'https://www.oreilly.com/library/view/prompt-engineering-for/9781098156145/',
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

// ── 第二级回退：每个分类使用不同的 Unsplash 主题图片 ──
const CATEGORY_FALLBACK_COVERS: Record<string, string> = {
  '推荐精选': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=280&fit=crop',
  '实战技巧': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200&h=280&fit=crop',
  '工具与理论': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=200&h=280&fit=crop',
}

// ── 第三级回退：每本书独有的渐变色 ──
const BOOK_GRADIENTS = [
  'from-rose-400 to-pink-600',
  'from-amber-400 to-orange-600',
  'from-sky-400 to-blue-600',
  'from-emerald-400 to-teal-600',
  'from-violet-400 to-purple-600',
  'from-cyan-400 to-teal-500',
  'from-fuchsia-400 to-pink-500',
  'from-lime-400 to-green-600',
  'from-indigo-400 to-blue-500',
  'from-yellow-400 to-amber-600',
  'from-teal-400 to-emerald-500',
  'from-red-400 to-rose-600',
]

// ── 分类专属图标映射 ──
const CATEGORY_PLACEHOLDER_ICONS: Record<string, typeof Book> = {
  '推荐精选': Sparkles,
  '实战技巧': Lightbulb,
  '工具与理论': Wrench,
}

// ── 个性化占位符组件 ──
function BookPlaceholder({ book }: { book: BookInfo }) {
  const bookIdx = BOOKS.findIndex(b => b.title === book.title)
  const gradient = BOOK_GRADIENTS[bookIdx % BOOK_GRADIENTS.length]
  const CategoryIcon = CATEGORY_PLACEHOLDER_ICONS[book.category] || Book
  const initial = book.title.charAt(0).toUpperCase()

  return (
    <div className={`w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center p-3 relative overflow-hidden`}>
      {/* 装饰性背景圆 */}
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-white/10" />
      <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/10" />
      {/* 分类图标 */}
      <CategoryIcon className="w-5 h-5 text-white/70 mb-1 relative z-10" strokeWidth={1.5} />
      {/* 书名首字母 */}
      <span className="text-4xl font-black text-white/90 my-1 relative z-10 drop-shadow-md">{initial}</span>
      {/* 截断书名 */}
      <span className="text-[10px] text-white/80 text-center leading-tight line-clamp-2 px-2 relative z-10 font-medium">
        {book.title}
      </span>
    </div>
  )
}

export function PromptBookRoom() {
  const [activeCategory, setActiveCategory] = useState<string>('推荐精选')
  // 0 = Open Library, 1 = Unsplash分类回退, 2+ = 个性化占位符
  const [imageErrors, setImageErrors] = useState<Record<string, number>>({})

  const filteredBooks = BOOKS.filter(b => b.category === activeCategory)

  const handleImageError = (bookTitle: string) => {
    setImageErrors(prev => ({
      ...prev,
      [bookTitle]: (prev[bookTitle] || 0) + 1
    }))
  }

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
              {/* Cover - 三级回退: Open Library → Unsplash(分类) → 个性化占位符 */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center overflow-hidden">
                {(imageErrors[book.title] || 0) >= 2 ? (
                  <BookPlaceholder book={book} />
                ) : (
                  <img
                    src={
                      (imageErrors[book.title] || 0) === 0
                        ? book.coverUrl
                        : CATEGORY_FALLBACK_COVERS[book.category]
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
