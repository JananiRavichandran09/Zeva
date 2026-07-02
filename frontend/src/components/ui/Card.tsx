import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface CardProps {
  /** Optional heading shown in the card header. */
  title?: ReactNode
  /** Optional supporting text under the title. */
  subtitle?: ReactNode
  /** Optional content rendered on the right side of the header (e.g. a button). */
  actions?: ReactNode
  /** Card body. */
  children?: ReactNode
  /** Optional footer area. */
  footer?: ReactNode
  /** Extra classes for the outer container. */
  className?: string
  /** Removes the default body padding (useful for tables/lists). */
  noPadding?: boolean
}

/**
 * Surface container with an optional header (title/subtitle/actions) and footer.
 */
export function Card({
  title,
  subtitle,
  actions,
  children,
  footer,
  className,
  noPadding = false,
}: CardProps) {
  const hasHeader = Boolean(title || subtitle || actions)

  return (
    <div
      className={cn(
        'rounded-2xl border border-line bg-surface shadow-sm',
        className,
      )}
    >
      {hasHeader && (
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-fg">{title}</h3>
            )}
            {subtitle && (
              <p className="mt-0.5 text-sm text-muted">{subtitle}</p>
            )}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      )}

      {children && <div className={noPadding ? '' : 'p-5'}>{children}</div>}

      {footer && (
        <div className="border-t border-line px-5 py-3">{footer}</div>
      )}
    </div>
  )
}
