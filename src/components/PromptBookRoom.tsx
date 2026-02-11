'use client'

import React, { useState } from 'react'
import { BookOpen, Star, ExternalLink, Sparkles, Lightbulb, Wrench } from 'lucide-react'
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
    coverUrl: 'https://m.media-amazon.com/images/I/71dKDM4CbaL._SL1500_.jpg',
    category: '推荐精选',
    rating: 4.5,
    link: 'https://www.oreilly.com/library/view/prompt-engineering-for/9781098153427/',
  },
  {
    title: 'The Art of Prompt Engineering with ChatGPT',
    author: 'Nathan Hunter',
    description: '从零到一掌握 ChatGPT 提示词工程，涵盖角色扮演、链式思维、少样本提示等核心技巧。',
    coverUrl: 'https://m.media-amazon.com/images/I/71YaSoVJHBL._SL1500_.jpg',
    category: '推荐精选',
    rating: 4.3,
    link: 'https://www.amazon.com/dp/B0C2JBZQLS',
  },
  {
    title: 'ChatGPT Prompt Engineering for Developers',
    author: 'Andrew Ng & Isa Fulford',
    description: 'DeepLearning.AI 联合 OpenAI 推出的开发者向提示词工程课程配套读物，聚焦 API 级实践。',
    coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1682492178i/123204386.jpg',
    category: '推荐精选',
    rating: 4.7,
    link: 'https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/',
  },
  {
    title: 'Build a Large Language Model (From Scratch)',
    author: 'Sebastian Raschka',
    description: 'Manning 出品，从底层理解 LLM 运作原理，帮助提示词工程师深入模型内核做出更好的 Prompt。',
    coverUrl: 'https://m.media-amazon.com/images/I/71I3KFnGEDL._SL1500_.jpg',
    category: '推荐精选',
    rating: 4.8,
    link: 'https://www.manning.com/books/build-a-large-language-model-from-scratch',
  },
  // ── 实战技巧 ──
  {
    title: 'The Art of Asking ChatGPT for High-Quality Answers',
    author: 'Ibrahim John',
    description: '高质量提问的艺术：通过实例讲解如何向 ChatGPT 提出精准问题获得最佳输出。',
    coverUrl: 'https://m.media-amazon.com/images/I/61v4pCQhJoL._SL1499_.jpg',
    category: '实战技巧',
    rating: 4.2,
    link: 'https://www.amazon.com/dp/B0BT2JM737',
  },
  {
    title: 'AI-Powered Developer',
    author: 'Nathan B. Crocker',
    description: 'Manning 出品，面向开发者的 AI 辅助开发指南，提示词工程在软件开发中的深度实践。',
    coverUrl: 'https://m.media-amazon.com/images/I/71IEd+u4hQL._SL1500_.jpg',
    category: '实战技巧',
    rating: 4.4,
    link: 'https://www.manning.com/books/ai-powered-developer',
  },
  {
    title: 'Prompt Engineering for ChatGPT',
    author: 'Jules White (Vanderbilt)',
    description: 'Coursera 热门课程教材，Vanderbilt 大学出品，从模式库到自动化 Prompt 管线。',
    coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1697652860i/198747143.jpg',
    category: '实战技巧',
    rating: 4.5,
    link: 'https://www.coursera.org/learn/prompt-engineering',
  },
  {
    title: 'Designing Large Language Model Applications',
    author: 'Suhas Pai',
    description: 'O\'Reilly 出品，专注 LLM 应用设计与提示词优化，含 RAG、Agent 等前沿实战模式。',
    coverUrl: 'https://m.media-amazon.com/images/I/71cEqV3GKLL._SL1500_.jpg',
    category: '实战技巧',
    rating: 4.6,
    link: 'https://www.oreilly.com/library/view/designing-large-language/9781098150488/',
  },
  // ── 工具与理论 ──
  {
    title: 'Prompt Engineering for LLMs',
    author: 'John Berryman & Albert Ziegler',
    description: 'O\'Reilly 出品，深入 LLM 提示词工程的原理、模式与高级技巧，行业标杆级参考书。',
    coverUrl: 'https://m.media-amazon.com/images/I/71BW64yKTxL._SL1500_.jpg',
    category: '工具与理论',
    rating: 4.6,
    link: 'https://www.oreilly.com/library/view/prompt-engineering-for/9781098153137/',
  },
  {
    title: 'Natural Language Processing with Transformers',
    author: 'Lewis Tunstall, Leandro von Werra & Thomas Wolf',
    description: 'O\'Reilly + Hugging Face 团队合著，Transformer 架构与 NLP 理论基础，提示词设计的理论根基。',
    coverUrl: 'https://m.media-amazon.com/images/I/61IKfVuBC4L._SL1360_.jpg',
    category: '工具与理论',
    rating: 4.7,
    link: 'https://www.oreilly.com/library/view/natural-language-processing/9781098136789/',
  },
  {
    title: 'Generative Deep Learning (2nd Ed.)',
    author: 'David Foster',
    description: 'O\'Reilly 经典，涵盖 VAE、GAN、GPT 等生成模型原理，为高级提示词设计提供理论支撑。',
    coverUrl: 'https://m.media-amazon.com/images/I/71Dp5MbJGEL._SL1500_.jpg',
    category: '工具与理论',
    rating: 4.5,
    link: 'https://www.oreilly.com/library/view/generative-deep-learning/9781098134174/',
  },
  {
    title: 'AI Engineering',
    author: 'Chip Huyen',
    description: 'O\'Reilly 出品，涵盖 AI 工程全流程，提示词编排、评估流水线与生产级 LLM 应用架构。',
    coverUrl: 'https://m.media-amazon.com/images/I/71x5q+pX+hL._SL1500_.jpg',
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

export function PromptBookRoom() {
  const [activeCategory, setActiveCategory] = useState<string>('推荐精选')

  const filteredBooks = BOOKS.filter(b => b.category === activeCategory)

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
              {/* Cover */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center overflow-hidden">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="h-40 w-auto object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.parentElement!.innerHTML = `<div class="flex flex-col items-center justify-center h-full text-gray-400 dark:text-slate-500"><svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg><span class="text-xs">${book.title.slice(0, 20)}</span></div>`
                  }}
                />
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
