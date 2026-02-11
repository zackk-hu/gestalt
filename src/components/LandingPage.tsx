'use client'

import React, { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, User, Zap, Brain, Layers, Play, ArrowRight, Sun, Moon } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/utils'
import { PromptBookRoom } from './PromptBookRoom'

interface LandingPageProps {
  onAuthSuccess: (user: any) => void
}

export function LandingPage({ onAuthSuccess }: LandingPageProps) {
  const { t, locale, setLocale } = useI18n()
  const { theme, toggleTheme } = useTheme()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })

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
      if (isLogin) {
        const storedUsers = JSON.parse(localStorage.getItem('gestalt-users') || '[]')
        const user = storedUsers.find(
          (u: any) => u.email === formData.email && u.password === formData.password
        )
        if (user) {
          localStorage.setItem('gestalt-user', JSON.stringify(user))
          onAuthSuccess(user)
          setSuccess(t('auth.loginSuccess'))
        } else {
          setError(t('auth.wrongCredentials'))
        }
      } else {
        const storedUsers = JSON.parse(localStorage.getItem('gestalt-users') || '[]')
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
          localStorage.setItem('gestalt-users', JSON.stringify(storedUsers))
          localStorage.setItem('gestalt-user', JSON.stringify(newUser))
          onAuthSuccess(newUser)
          setSuccess(t('auth.registerSuccess'))
        }
      }
    } catch {
      setError(t('auth.operationFailed'))
    } finally {
      setLoading(false)
    }
  }

  const features = [
    { key: '1', icon: <Zap className="w-5 h-5" />, neon: 'neon-green', iconColor: 'text-green-600 dark:text-green-400' },
    { key: '2', icon: <Brain className="w-5 h-5" />, neon: 'neon-pink', iconColor: 'text-pink-600 dark:text-pink-400' },
    { key: '3', icon: <Layers className="w-5 h-5" />, neon: 'neon-purple', iconColor: 'text-purple-600 dark:text-purple-400' },
    { key: '4', icon: <Play className="w-5 h-5" />, neon: 'neon-cyan', iconColor: 'text-cyan-600 dark:text-cyan-400' },
  ]

  const stats = [
    { key: '1', color: 'text-gradient-green' },
    { key: '2', color: 'text-gradient-purple' },
    { key: '3', color: 'text-gradient-cyan' },
    { key: '4', color: 'text-gradient-pink' },
  ]

  return (
    <div className="landing-bg overflow-y-auto overflow-x-hidden relative">
      {/* Background glow orbs */}
      <div className="glow-orb w-[500px] h-[500px] bg-primary-500/20 top-[-100px] left-[-100px]" />
      <div className="glow-orb w-[400px] h-[400px] bg-accent-500/15 bottom-[200px] right-[-100px]" />
      <div className="glow-orb w-[300px] h-[300px] bg-emerald-500/10 top-[60%] left-[30%]" />

      {/* Top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-white/60 dark:bg-transparent backdrop-blur-md dark:backdrop-blur-none border-b border-gray-100 dark:border-transparent">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-sm font-bold text-gray-800 dark:text-white/80 tracking-wider uppercase">Gestalt</span>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors border border-gray-200 dark:border-white/10"
            >
              {locale === 'zh' ? 'EN' : '中文'}
            </button>
          </div>
        </div>
      </nav>

      {/* ======== HERO SECTION ======== */}
      <section className="min-h-screen flex items-center relative px-6 pt-20 pb-10">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Headline + Login Form */}
          <div className="space-y-8">
            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
                {t('landing.headline')}
                <span className="block text-gradient text-3xl sm:text-4xl lg:text-4xl font-bold mt-2">
                  —— {t('landing.subheadline')}
                </span>
              </h1>
              <p className="text-lg text-gray-500 dark:text-slate-400 max-w-lg leading-relaxed">
                {t('landing.tagline')}
              </p>
            </div>

            {/* Performance Metrics */}
            <div className="glass-card rounded-xl p-5 space-y-3 max-w-lg">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 mt-2 flex-shrink-0" />
                <p className="text-gray-700 dark:text-slate-300 text-sm leading-relaxed">
                  <span className="font-semibold text-gray-900 dark:text-white">效率提升：</span>用户平均交互轮数从 6.4 轮降低至 1.2 轮。
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 mt-2 flex-shrink-0" />
                <p className="text-gray-700 dark:text-slate-300 text-sm leading-relaxed">
                  <span className="font-semibold text-gray-900 dark:text-white">成本降低：</span>减少 40% 以上的无效 Token 往复消耗。
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 mt-2 flex-shrink-0" />
                <p className="text-gray-700 dark:text-slate-300 text-sm leading-relaxed">
                  <span className="font-semibold text-gray-900 dark:text-white">准确率：</span>复杂逻辑任务的意图对齐准确率从 55% 提升至 92%。
                </p>
              </div>
            </div>

            {/* Glassmorphism Login Form */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 max-w-md">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
                {isLogin ? t('auth.welcomeBack') : t('auth.createAccount')}
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400 rounded-xl text-sm">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required={!isLogin}
                      className="glass-input w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                      placeholder={t('auth.namePlaceholder')}
                    />
                  </div>
                )}

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="glass-input w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                    placeholder={t('auth.emailPlaceholder')}
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="glass-input w-full pl-10 pr-12 py-3 rounded-xl text-sm"
                    placeholder={t('auth.passwordPlaceholder')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-neon w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {isLogin ? t('auth.login') : t('auth.register')}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-5 text-center text-sm text-gray-400 dark:text-slate-500">
                {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}
                <button
                  type="button"
                  onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess('') }}
                  className="ml-1 text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 font-medium transition-colors"
                >
                  {isLogin ? t('auth.registerNow') : t('auth.loginNow')}
                </button>
              </p>
            </div>
          </div>

          {/* Right: 3D Visual */}
          <div className="hidden lg:flex items-center justify-center relative">
            <div className="animate-float relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero-gestalt.jpg"
                alt="Gestalt Prompt Compiler"
                className="w-full max-w-lg rounded-2xl"
                style={{ filter: 'drop-shadow(0 0 60px rgba(99, 102, 241, 0.2))' }}
              />
            </div>
            {/* Decorative floating elements */}
            <div className="absolute top-10 right-10 w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-primary-500/20 animate-float-delayed backdrop-blur-sm" />
            <div className="absolute bottom-20 left-10 w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 animate-float backdrop-blur-sm" />
          </div>
        </div>
      </section>

      {/* ======== FEATURES SECTION ======== */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('landing.featuresTitle')}</h2>
            <p className="text-gray-500 dark:text-slate-400 text-lg">{t('landing.featuresSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.key} className={cn('feature-card p-6', f.neon)}>
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-gray-100 dark:bg-white/5', f.iconColor)}>
                  {f.icon}
                </div>
                <h3 className="text-gray-800 dark:text-white font-semibold text-base mb-2">
                  {t(`landing.feature${f.key}Title` as any)}
                </h3>
                <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed">
                  {t(`landing.feature${f.key}Desc` as any)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== STATS SECTION ======== */}
      <section className="py-20 px-6 border-t border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('landing.statsTitle')}</h2>
            <p className="text-gray-500 dark:text-slate-400 text-lg">{t('landing.statsSubtitle')}</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.key} className="text-center">
                <div className={cn('text-5xl sm:text-6xl font-extrabold mb-2', s.color)}>
                  {t(`landing.stat${s.key}Value` as any)}
                </div>
                <div className="text-gray-400 dark:text-slate-500 text-sm font-medium">
                  {t(`landing.stat${s.key}Label` as any)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== AI 书房 SECTION ======== */}
      <PromptBookRoom />

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto text-center text-gray-400 dark:text-slate-600 text-xs">
          Gestalt Prompt Compiler &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  )
}
