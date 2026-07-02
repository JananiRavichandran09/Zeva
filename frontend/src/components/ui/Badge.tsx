import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type BadgeTone =
  | 'neutral'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'

export interface BadgeProps {
  /** Color tone. Defaults to "neutral". */
  tone?: BadgeTone
  /** Badge content. */
  children: ReactNode
  /** Extra classes. */
  className?: string
}

const toneMap: Record<BadgeTone, string> = {
  neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-200',
  primary: 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
  success: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  danger: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
  info: 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300',
}

/**
 * Small pill for statuses, counts, and tags.
 */
export function Badge({ tone = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        toneMap[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
