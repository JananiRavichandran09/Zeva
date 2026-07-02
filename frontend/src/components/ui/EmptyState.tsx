import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface EmptyStateProps {
  /** Optional icon shown above the title. */
  icon?: ReactNode
  /** Main message. */
  title: string
  /** Optional supporting description. */
  description?: string
  /** Optional action (e.g. a "Create" button). */
  action?: ReactNode
  /** Extra classes. */
  className?: string
}

/**
 * Placeholder shown when a list or view has no content yet.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 px-6 py-12 text-center',
        className,
      )}
    >
      {icon && <div className="text-muted/60">{icon}</div>}
      <div>
        <p className="text-base font-medium text-fg">{title}</p>
        {description && (
          <p className="mt-1 text-sm text-muted">{description}</p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}
