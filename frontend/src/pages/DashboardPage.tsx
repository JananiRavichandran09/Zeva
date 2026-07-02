import { PageHeader } from '@/components/ui'

export default function DashboardPage() {
  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-8">
      <PageHeader
        title="Good morning 👋"
        subtitle="Here's a snapshot of your day. Ask Zeva to take it from here."
      />
    </div>
  )
}
