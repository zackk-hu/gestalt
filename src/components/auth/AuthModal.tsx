import React, { useState, useEffect } from 'react'
import { X, User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '../Button'
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'

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
  const { t } = useI18n()

  useEffect(() => {
    if (isOpen) {
      const storedUser = localStorage.getItem('prompt-optimizer-user')
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser)
          onAuthSuccess(user)
        } catch (e) {
          console.log('Failed to parse user info')
        }
      }
    }
  }, [isOpen, onAuthSuccess])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isLogin) {
        const storedUsers = JSON.parse(localStorage.getItem('prompt-optimizer-users') || '[]')
        const user = storedUsers.find(
          (u: any) => u.email === formData.email && u.password === formData.password
        )

        if (user) {
          localStorage.setItem('prompt-optimizer-user', JSON.stringify(user))
          onAuthSuccess(user)
          setSuccess(t('auth.loginSuccess'))
          setTimeout(() => {
            setSuccess('')
            onClose()
          }, 1000)
        } else {
          setError(t('auth.wrongCredentials'))
        }
      } else {
        const storedUsers = JSON.parse(localStorage.getItem('prompt-optimizer-users') || '[]')
        const existingUser = storedUsers.find((u: any) => u.email === formData.email)

        if (existingUser) {
          setError(t('auth.emailExists'))
        } else {
          const newUser = {
            id: `user_${Date.now()}`,
            name: formData.name,
            email: formData.email,
            password: formData.password,
            createdAt: new Date().toISOString()
          }

          storedUsers.push(newUser)
          localStorage.setItem('prompt-optimizer-users', JSON.stringify(storedUsers))
          localStorage.setItem('prompt-optimizer-user', JSON.stringify(newUser))
          onAuthSuccess(newUser)
          setSuccess(t('auth.registerSuccess'))
          setTimeout(() => {
            setSuccess('')
            onClose()
          }, 1000)
        }
      }
    } catch (err) {
      setError(t('auth.operationFailed'))
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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl shadow-gray-300/50 dark:shadow-black/30 w-full max-w-md border border-gray-100 dark:border-slate-700/50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 品牌头部 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 p-6 border-b border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Prompt Optimizer</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">AI 提示词优化平台</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {isLogin ? t('auth.welcomeBack') : t('auth.createAccount')}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl text-sm border border-red-100 dark:border-red-800/30">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-xl text-sm border border-green-100 dark:border-green-800/30">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-slate-300 mb-2">
                  {t('auth.name')}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required={!isLogin}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder={t('auth.namePlaceholder')}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-slate-300 mb-2">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder={t('auth.emailPlaceholder')}
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
              <label className="block text-sm font-medium text-gray-600 dark:text-slate-300 mb-2">
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder={t('auth.passwordPlaceholder')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
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
              {loading ? t('auth.processing') : isLogin ? t('auth.login') : t('auth.register')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-slate-400">
              {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}
              <button
                type="button"
                onClick={toggleAuthMode}
                className="ml-1 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
              >
                {isLogin ? t('auth.registerNow') : t('auth.loginNow')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
