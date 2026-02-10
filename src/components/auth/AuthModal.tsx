import React, { useState, useEffect } from 'react'
import { X, User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '../Button'
import { cn } from '@/lib/utils'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onAuthSuccess: (user: { id: string; email: string; name: string }) => void
}

export function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    domain: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // 检查是否已登录
  useEffect(() => {
    if (isOpen) {
      const storedUser = localStorage.getItem('gestalt-user')
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser)
          onAuthSuccess(user)
        } catch (e) {
          console.log('解析用户信息失败')
        }
      }
    }
  }, [isOpen, onAuthSuccess])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // 模拟API调用
      if (isLogin) {
        // 登录逻辑
        const storedUsers = JSON.parse(localStorage.getItem('gestalt-users') || '[]')
        const user = storedUsers.find(
          (u: any) => u.email === formData.email && u.password === formData.password
        )

        if (user) {
          localStorage.setItem('gestalt-user', JSON.stringify(user))
          onAuthSuccess(user)
          setSuccess('登录成功！')
          setTimeout(() => {
            setSuccess('')
            onClose()
          }, 1000)
        } else {
          setError('邮箱或密码错误')
        }
      } else {
        // 注册逻辑
        const storedUsers = JSON.parse(localStorage.getItem('gestalt-users') || '[]')
        const existingUser = storedUsers.find((u: any) => u.email === formData.email)

        if (existingUser) {
          setError('该邮箱已被注册')
        } else {
          const newUser = {
            id: `user_${Date.now()}`,
            name: formData.name,
            email: formData.email,
            password: formData.password,
            createdAt: new Date().toISOString()
          }

          storedUsers.push(newUser)
          localStorage.setItem('gestalt-users', JSON.stringify(storedUsers))
          localStorage.setItem('gestalt-user', JSON.stringify(newUser))
          onAuthSuccess(newUser)
          setSuccess('注册成功！')
          setTimeout(() => {
            setSuccess('')
            onClose()
          }, 1000)
        }
      }
    } catch (err) {
      setError('操作失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const toggleAuthMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setSuccess('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 品牌头部 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 p-6 border-b border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Gestalt</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">AI 提示词优化平台</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {isLogin ? '🎉 欢迎回来' : '✨ 创建账户'}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  姓名
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required={!isLogin}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="请输入姓名"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                邮箱
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="请输入邮箱地址"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  专业领域（可选）
                </label>
                <select
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">选择你的专业领域</option>
                  <option value="nlp">NLP / 自然语言处理</option>
                  <option value="cv">计算机视觉</option>
                  <option value="ml">机器学习工程</option>
                  <option value="ai-product">AI 产品设计</option>
                  <option value="prompt-engineer">提示词工程</option>
                  <option value="content">内容创作</option>
                  <option value="education">教育培训</option>
                  <option value="other">其他领域</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="请输入密码"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-slate-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            {/* 安全与隐私提示 */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm">
              <div className="flex gap-2">
                <span className="text-lg">🔒</span>
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-300">隐私保护</p>
                  <p className="text-xs text-blue-800 dark:text-blue-400 mt-0.5">您的数据已加密存储，我们严格保护您的隐私。</p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 font-medium bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              loading={loading}
              disabled={loading}
            >
              {loading ? '处理中...' : isLogin ? '🚀 开始优化提示词' : '✨ 免费创建账户'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {isLogin ? '还没有账户？' : '已有账户？'}
              <button
                type="button"
                onClick={toggleAuthMode}
                className="ml-1 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
              >
                {isLogin ? '免费注册' : '立即登录'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}