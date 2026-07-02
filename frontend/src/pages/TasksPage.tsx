import { ListChecks } from 'lucide-react'
import PagePlaceholder from '@/components/PagePlaceholder'

export default function TasksPage() {
  return (
    <PagePlaceholder
      icon={ListChecks}
      title="Tasks"
      description="Kanban, table, and timeline views with priorities and dependencies."
    />
  )
}
