'use client'

import React, { useState, useEffect } from 'react'
import { Users, MessageSquare, Heart, Send, Share2, Clock, Flame, User, ChevronDown, ChevronUp, Reply, Hash } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── 类型定义 ──
interface Author {
  id: string
  nickname: string
  role: string
  avatar?: string
}

interface Comment {
  id: string
  author: Author
  content: string
  time: string
  likes: number
  likedBy: string[]
}

interface Post {
  id: string
  author: Author
  content: string
  topic: string
  likes: number
  likedBy: string[]
  comments: Comment[]
  createdAt: string
}

// ── 角色徽章 ──
const ROLE_STYLES: Record<string, { label: string; color: string }> = {
  'expert': { label: '专家', color: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' },
  'senior': { label: '资深', color: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' },
  'member': { label: '成员', color: 'bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-slate-300' },
}

// ── 话题标签 ──
const TOPICS = [
  '提示词技巧', '模型对比', 'RAG实践', 'Agent开发',
  '效果优化', '行业应用', '求助提问', '经验分享',
]

// ── 示例帖子 ──
const SAMPLE_POSTS: Post[] = [
  {
    id: 'p1',
    author: { id: 'u1', nickname: 'PromptMaster', role: 'expert' },
    content: '分享一个实用的提示词技巧：在 System Prompt 中使用「你是一位具有 10 年经验的 XX 专家」比直接说「你擅长 XX」效果好很多。\n\n原因：角色设定会激活模型在训练数据中对应领域的知识分布，让输出更专业。\n\n大家有类似的发现吗？',
    topic: '提示词技巧',
    likes: 42,
    likedBy: [],
    comments: [
      {
        id: 'c1', author: { id: 'u2', nickname: 'AI开发者小王', role: 'senior' },
        content: '确实！我还发现加上「请一步一步思考」（Chain-of-Thought）能显著提升逻辑推理的准确率。',
        time: '2026-02-01T10:30:00Z', likes: 15, likedBy: []
      },
      {
        id: 'c2', author: { id: 'u3', nickname: '提示词新手', role: 'member' },
        content: '学到了！请问这个技巧对 Claude 和 GPT 都适用吗？',
        time: '2026-02-01T11:00:00Z', likes: 3, likedBy: []
      }
    ],
    createdAt: '2026-02-01T09:00:00Z'
  },
  {
    id: 'p2',
    author: { id: 'u4', nickname: 'RAG架构师', role: 'senior' },
    content: '最近在做 RAG 项目，发现一个关键问题：检索质量 > 生成质量。\n\n很多人花大量时间调 Prompt，但其实检索到的上下文不对的话，Prompt 再好也没用。\n\n建议大家先把 Embedding 和检索策略优化好，再来调 Prompt。',
    topic: 'RAG实践',
    likes: 38,
    likedBy: [],
    comments: [
      {
        id: 'c3', author: { id: 'u1', nickname: 'PromptMaster', role: 'expert' },
        content: '完全同意。我们项目中 Reranker 的引入让检索质量提升了 30%，比调 Prompt 效果明显多了。',
        time: '2026-01-31T16:00:00Z', likes: 22, likedBy: []
      }
    ],
    createdAt: '2026-01-31T14:00:00Z'
  },
  {
    id: 'p3',
    author: { id: 'u5', nickname: '全栈小李', role: 'member' },
    content: '请教各位：在构建 Agent 时，如何让 LLM 准确选择正确的工具？\n\n我的 Agent 有 8 个工具可用，但模型经常选错或者幻觉出不存在的工具名。目前用的是 GPT-4，试过 few-shot 但效果不稳定。\n\n有什么好的方案吗？',
    topic: 'Agent开发',
    likes: 25,
    likedBy: [],
    comments: [],
    createdAt: '2026-01-30T20:00:00Z'
  },
]

// ── 工具函数 ──
function getTimeAgo(date: Date): string {
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diff < 60) return '刚刚'
  if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`
  if (diff < 604800) return `${Math.floor(diff / 86400)} 天前`
  return date.toLocaleDateString('zh-CN')
}

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

// ── 头像组件 ──
function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  const colors = [
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-violet-500 to-purple-600',
    'from-cyan-500 to-sky-600',
  ]
  const idx = name.charCodeAt(0) % colors.length
  const sizeClass = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'
  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br ${colors[idx]} flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

// ── 角色徽章组件 ──
function RoleBadge({ role }: { role: string }) {
  const style = ROLE_STYLES[role] || ROLE_STYLES['member']
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${style.color}`}>
      {style.label}
    </span>
  )
}

// ── 评论组件 ──
function CommentItem({ comment, onLike }: { comment: Comment; onLike: (id: string) => void }) {
  return (
    <div className="bg-gray-50 dark:bg-slate-700/30 rounded-xl p-3 border-l-2 border-indigo-400 dark:border-indigo-500">
      <div className="flex items-center gap-2 mb-1.5">
        <Avatar name={comment.author.nickname} size="sm" />
        <span className="font-semibold text-xs text-gray-800 dark:text-slate-200">{comment.author.nickname}</span>
        <RoleBadge role={comment.author.role} />
        <span className="text-[10px] text-gray-400 dark:text-slate-500 ml-auto">{getTimeAgo(new Date(comment.time))}</span>
      </div>
      <p className="text-sm text-gray-600 dark:text-slate-300 ml-10 leading-relaxed">{comment.content}</p>
      <div className="flex items-center gap-3 ml-10 mt-1.5">
        <button onClick={() => onLike(comment.id)} className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-slate-500 hover:text-rose-500 transition-colors">
          <Heart className={cn('w-3 h-3', comment.likedBy.length > 0 && 'fill-rose-500 text-rose-500')} />
          {comment.likes > 0 && <span>{comment.likes}</span>}
        </button>
      </div>
    </div>
  )
}

// ── 帖子卡片组件 ──
function PostCard({
  post, currentUserId, onLike, onComment, onCommentLike,
}: {
  post: Post; currentUserId: string
  onLike: (postId: string) => void
  onComment: (postId: string, content: string) => void
  onCommentLike: (postId: string, commentId: string) => void
}) {
  const [showAllComments, setShowAllComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [showCommentInput, setShowCommentInput] = useState(false)
  const isLiked = post.likedBy.includes(currentUserId)
  const previewComments = showAllComments ? post.comments : post.comments.slice(0, 2)

  const handleSubmitComment = () => {
    if (!commentText.trim()) return
    onComment(post.id, commentText.trim())
    setCommentText('')
    setShowCommentInput(false)
  }

  return (
    <article className="bg-white dark:bg-slate-800/80 rounded-2xl border border-gray-100 dark:border-slate-700/50 p-5 transition-all hover:shadow-lg hover:shadow-indigo-500/5">
      {/* 作者信息 */}
      <div className="flex gap-3 mb-3">
        <Avatar name={post.author.nickname} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm text-gray-900 dark:text-white">{post.author.nickname}</span>
            <RoleBadge role={post.author.role} />
            {post.topic && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded text-[10px] font-medium">
                <Hash className="w-2.5 h-2.5" />{post.topic}
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">{getTimeAgo(new Date(post.createdAt))}</p>
        </div>
      </div>

      {/* 内容 */}
      <div className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mb-4 whitespace-pre-line">
        {post.content}
      </div>

      {/* 操作栏 */}
      <div className="flex items-center gap-5 text-xs text-gray-400 dark:text-slate-500 border-t border-gray-100 dark:border-slate-700/50 pt-3">
        <button
          onClick={() => onLike(post.id)}
          className={cn('flex items-center gap-1.5 transition-colors hover:text-rose-500', isLiked && 'text-rose-500')}
        >
          <Heart className={cn('w-4 h-4', isLiked && 'fill-rose-500')} />
          <span>{post.likes}</span>
        </button>
        <button
          onClick={() => setShowCommentInput(!showCommentInput)}
          className="flex items-center gap-1.5 hover:text-indigo-500 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{post.comments.length}</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-indigo-500 transition-colors ml-auto">
          <Share2 className="w-4 h-4" />
          <span>分享</span>
        </button>
      </div>

      {/* 评论区 */}
      {post.comments.length > 0 && (
        <div className="mt-3 space-y-2">
          {previewComments.map(c => (
            <CommentItem key={c.id} comment={c} onLike={(cId) => onCommentLike(post.id, cId)} />
          ))}
          {post.comments.length > 2 && (
            <button
              onClick={() => setShowAllComments(!showAllComments)}
              className="flex items-center gap-1 text-xs text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 font-medium mt-1"
            >
              {showAllComments ? (
                <><ChevronUp className="w-3 h-3" />收起评论</>
              ) : (
                <><ChevronDown className="w-3 h-3" />查看全部 {post.comments.length} 条评论</>
              )}
            </button>
          )}
        </div>
      )}

      {/* 评论输入框 */}
      {showCommentInput && (
        <div className="mt-3 flex gap-2">
          <input
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmitComment()}
            placeholder="写下你的评论..."
            className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-colors"
          />
          <button
            onClick={handleSubmitComment}
            disabled={!commentText.trim()}
            className="px-3 py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      )}
    </article>
  )
}

// ── 主组件 ──
export function PromptCommunity() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filter, setFilter] = useState<'latest' | 'hot'>('latest')
  const [newPostContent, setNewPostContent] = useState('')
  const [newPostTopic, setNewPostTopic] = useState('')
  const [currentUserId] = useState(() => `user_${Date.now()}`)

  // 初始化数据
  useEffect(() => {
    const saved = localStorage.getItem('prompt-optimizer-community-posts')
    if (saved) {
      try {
        setPosts(JSON.parse(saved))
      } catch { setPosts(SAMPLE_POSTS) }
    } else {
      setPosts(SAMPLE_POSTS)
    }
  }, [])

  // 持久化
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem('prompt-optimizer-community-posts', JSON.stringify(posts))
    }
  }, [posts])

  // 发帖
  const handleSubmitPost = () => {
    if (!newPostContent.trim()) return
    const newPost: Post = {
      id: generateId(),
      author: {
        id: currentUserId,
        nickname: JSON.parse(localStorage.getItem('prompt-optimizer-user') || '{}').name || '匿名用户',
        role: 'member'
      },
      content: newPostContent.trim(),
      topic: newPostTopic,
      likes: 0,
      likedBy: [],
      comments: [],
      createdAt: new Date().toISOString(),
    }
    setPosts(prev => [newPost, ...prev])
    setNewPostContent('')
    setNewPostTopic('')
  }

  // 点赞帖子
  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      const isLiked = p.likedBy.includes(currentUserId)
      return {
        ...p,
        likes: isLiked ? p.likes - 1 : p.likes + 1,
        likedBy: isLiked ? p.likedBy.filter(id => id !== currentUserId) : [...p.likedBy, currentUserId],
      }
    }))
  }

  // 评论
  const handleComment = (postId: string, content: string) => {
    const newComment: Comment = {
      id: generateId(),
      author: {
        id: currentUserId,
        nickname: JSON.parse(localStorage.getItem('prompt-optimizer-user') || '{}').name || '匿名用户',
        role: 'member'
      },

      content,
      time: new Date().toISOString(),
      likes: 0,
      likedBy: [],
    }
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
    ))
  }

  // 点赞评论
  const handleCommentLike = (postId: string, commentId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      return {
        ...p,
        comments: p.comments.map(c => {
          if (c.id !== commentId) return c
          const isLiked = c.likedBy.includes(currentUserId)
          return {
            ...c,
            likes: isLiked ? c.likes - 1 : c.likes + 1,
            likedBy: isLiked ? c.likedBy.filter(id => id !== currentUserId) : [...c.likedBy, currentUserId],
          }
        }),
      }
    }))
  }

  // 排序
  const sortedPosts = [...posts].sort((a, b) => {
    if (filter === 'hot') return b.likes - a.likes
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return (
    <section className="py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium mb-3">
            <Users className="w-4 h-4" />
            社区讨论
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Prompt 工程师社区
          </h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm">
            交流提示词技巧，分享实战经验，共同进步
          </p>
        </div>

        {/* 发帖区 */}
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-gray-100 dark:border-slate-700/50 p-5 mb-6">
          <div className="flex gap-3">
            <Avatar name={JSON.parse(localStorage.getItem('prompt-optimizer-user') || '{"name":"U"}').name || 'U'} />
            <div className="flex-1">
              <textarea
                value={newPostContent}
                onChange={e => setNewPostContent(e.target.value)}
                placeholder="分享你的提示词技巧、使用心得或提问..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/30 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none transition-colors"
              />
              <div className="flex items-center justify-between mt-3">
                <select
                  value={newPostTopic}
                  onChange={e => setNewPostTopic(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/30 text-sm text-gray-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-colors"
                >
                  <option value="">选择话题</option>
                  {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <button
                  onClick={handleSubmitPost}
                  disabled={!newPostContent.trim()}
                  className={cn(
                    'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all',
                    newPostContent.trim()
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:-translate-y-0.5'
                      : 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed'
                  )}
                >
                  <Send className="w-4 h-4" />
                  发布
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 过滤标签 */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setFilter('latest')}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all',
              filter === 'latest'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:border-indigo-300'
            )}
          >
            <Clock className="w-3.5 h-3.5" />最新
          </button>
          <button
            onClick={() => setFilter('hot')}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all',
              filter === 'hot'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:border-indigo-300'
            )}
          >
            <Flame className="w-3.5 h-3.5" />热门
          </button>
          <span className="text-xs text-gray-400 dark:text-slate-500 ml-auto">{posts.length} 条讨论</span>
        </div>

        {/* 帖子列表 */}
        <div className="space-y-4">
          {sortedPosts.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-800/80 rounded-2xl border border-gray-100 dark:border-slate-700/50">
              <MessageSquare className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-700 dark:text-slate-300 mb-1">暂无讨论</h3>
              <p className="text-sm text-gray-400 dark:text-slate-500">成为第一个分享观点的人吧！</p>
            </div>
          ) : (
            sortedPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={currentUserId}
                onLike={handleLikePost}
                onComment={handleComment}
                onCommentLike={handleCommentLike}
              />
            ))
          )}
        </div>
      </div>
    </section>
  )
}
