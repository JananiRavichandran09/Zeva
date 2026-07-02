import { Bell } from 'lucide-react'
import PagePlaceholder from '@/components/PagePlaceholder'

export default function NotificationsPage() {
  return (
    <PagePlaceholder
      icon={Bell}
      title="Notifications"
      description="Grouped reminders, due tasks, AI suggestions, and project risks."
    />
  )
}
