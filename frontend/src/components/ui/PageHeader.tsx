import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface PageHeaderProps {
  /** Main page title. */
  title: ReactNode
  /** Optional supporting description. */
  subtitle?: ReactNode
  /** Optional actions aligned to the right (e.g. a primary button). */
  actions?: ReactNode
  /** Extra classes for the container. */
  className?: string
}

/**
 * Consistent page heading with an optional subtitle and right-aligned actions.
 */
export function PageHeader({
  title,
  subtitle,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-fg">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  )
}
