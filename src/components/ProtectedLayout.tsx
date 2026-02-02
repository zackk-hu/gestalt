'use client'

import React, { useState, useEffect } from 'react'
import { isAuthenticated, getCurrentUser, logout } from '@/lib/auth'
import { AuthModal } from './auth/AuthModal'
import { User, LogOut } from 'lucide-react'
import { Button } from './Button'

interface ProtectedLayoutProps {
  children: React.ReactNode
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const [isAuthenticatedState, setIsAuthenticatedState] = useState<boolean | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    // 初始化认证状态
    const checkAuth = () => {
      const auth = isAuthenticated()
      setIsAuthenticatedState(auth)
      if (auth) {
        const user = getCurrentUser()
        setCurrentUser(user)
      }
    }

    checkAuth()

    // 监听storage变化，以便在其他标签页登录/登出时更新状态
    const handleStorageChange = () => {
      checkAuth()
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleAuthSuccess = (user: any) => {
    setCurrentUser(user)
    setIsAuthenticatedState(true)
    // 认证成功后刷新页面以跳转到主界面
    window.location.href = '/'
  }

  const handleLogout = () => {
    logout()
    setIsAuthenticatedState(false)
    setCurrentUser(null)
  }

  if (isAuthenticatedState === null) {
    // 加载状态
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">加载中...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticatedState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-8 h-8 text-primary-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              欢迎使用 Gestalt
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              请先登录或注册以开始使用提示词编译器
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowAuthModal(true)}
              className="w-full py-3"
            >
              开始使用
            </Button>
          </div>
        </div>
        
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      </div>
    )
  }

  // 已认证用户，显示主要内容
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* 顶部导航栏 */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Gestalt Prompt Compiler
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
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
                登出
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pb-8">
        {children}
      </main>
    </div>
  )
}