'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

export type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')

  useEffect(() => {
    const saved = localStorage.getItem('prompt-optimizer-theme') as Theme
    if (saved && (saved === 'light' || saved === 'dark')) {
      setThemeState(saved)
      applyTheme(saved)
    } else {
      applyTheme('dark')
    }
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    // Add transition class for smooth switch
    root.classList.add('theme-transition')
    if (newTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    // Remove transition class after animation completes
    setTimeout(() => {
      root.classList.remove('theme-transition')
    }, 350)
  }

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('prompt-optimizer-theme', newTheme)
    applyTheme(newTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
