import type { LucideIcon } from 'lucide-react'
import { PageHeader, Button } from '@/components/ui'

interface PagePlaceholderProps {
  title: string
  description: string
  icon: LucideIcon
}

/**
 * Temporary scaffold for sections that will be built in later prompts.
 * Keeps routing and the shell looking intentional while pages are pending.
 */
export default function PagePlaceholder({
  title,
  description,
  icon: Icon,
}: PagePlaceholderProps) {
  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-8">
      <PageHeader title={title} subtitle={description} />

      <div className="grid flex-1 place-items-center">
        <div className="flex max-w-md flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 text-brand">
            <Icon size={30} strokeWidth={1.75} />
          </span>
          <h3 className="mt-5 text-lg font-semibold text-fg">
            {title} is coming together
          </h3>
          <p className="mt-1.5 text-sm text-muted">
            This section is part of the Zeva build and will be designed next.
            The layout, theme, and AI panel are ready around it.
          </p>
          <div className="mt-5">
            <Button variant="outline" size="sm">
              Notify me when ready
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
