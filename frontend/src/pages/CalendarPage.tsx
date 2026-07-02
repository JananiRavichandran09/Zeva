import { Calendar } from 'lucide-react'
import PagePlaceholder from '@/components/PagePlaceholder'

export default function CalendarPage() {
  return (
    <PagePlaceholder
      icon={Calendar}
      title="Calendar"
      description="Your schedule across day, week, and month views."
    />
  )
}
