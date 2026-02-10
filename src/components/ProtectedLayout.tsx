'use client'

import React, { useState, useEffect } from 'react'
import { isAuthenticated, getCurrentUser, logout } from '@/lib/auth'
import { LandingPage } from './LandingPage'
import { User, LogOut, Sun, Moon } from 'lucide-react'
import { Button } from './Button'
import { useI18n } from '@/lib/i18n'
import { useTheme } from '@/lib/theme'

interface ProtectedLayoutProps {
  children: React.ReactNode
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const [isAuthenticatedState, setIsAuthenticatedState] = useState<boolean | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const { t, locale, setLocale } = useI18n()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const checkAuth = () => {
      const auth = isAuthenticated()
      setIsAuthenticatedState(auth)
      if (auth) {
        const user = getCurrentUser()
        setCurrentUser(user)
      }
    }

    checkAuth()

    const handleStorageChange = () => {
      checkAuth()
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleAuthSuccess = (user: any) => {
    setCurrentUser(user)
    setIsAuthenticatedState(true)
    window.location.href = '/'
  }

  const handleLogout = () => {
    logout()
    setIsAuthenticatedState(false)
    setCurrentUser(null)
  }

  // Loading state
  if (isAuthenticatedState === null) {
    return (
      <div className="landing-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">{t('app.loading')}</p>
        </div>
      </div>
    )
  }

  // Unauthenticated — show landing page
  if (!isAuthenticatedState) {
    return <LandingPage onAuthSuccess={handleAuthSuccess} />
  }

  // Authenticated user — main app
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-[#F0F4FF] to-white dark:from-[#0F172A] dark:to-[#0F172A]">
      {/* Top nav */}
      <nav className="flex-none bg-white/70 dark:bg-[#0F172A]/80 backdrop-blur-xl border-b border-gray-100 dark:border-slate-700/50 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center">
              <h1 className="text-lg font-bold text-gray-800 dark:text-white">
                Gestalt Prompt Compiler——提示词编译器
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                title={theme === 'dark' ? t('theme.light') : t('theme.dark')}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Language toggle */}
              <button
                onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
                className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors border border-gray-200 dark:border-slate-700"
              >
                {locale === 'zh' ? 'EN' : '中文'}
              </button>

              <div className="w-px h-5 bg-gray-200 dark:bg-slate-700 mx-1" />

              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
                <User className="w-4 h-4" />
                <span>{currentUser?.name || currentUser?.email}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" />
                {t('app.logout')}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 min-h-0">
        {children}
      </main>
    </div>
  )
}
