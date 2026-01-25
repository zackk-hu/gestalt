'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, hover = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700',
          hover && 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = 'Card'

interface CardHeaderProps {
  className?: string
  children: React.ReactNode
}

export function CardHeader({ className, children }: CardHeaderProps) {
  return (
    <div className={cn('px-6 py-4 border-b border-slate-200 dark:border-slate-700', className)}>
      {children}
    </div>
  )
}

interface CardContentProps {
  className?: string
  children: React.ReactNode
}

export function CardContent({ className, children }: CardContentProps) {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  )
}

interface CardFooterProps {
  className?: string
  children: React.ReactNode
}

export function CardFooter({ className, children }: CardFooterProps) {
  return (
    <div className={cn('px-6 py-4 border-t border-slate-200 dark:border-slate-700', className)}>
      {children}
    </div>
  )
}
