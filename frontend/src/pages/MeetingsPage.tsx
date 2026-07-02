import { Video } from 'lucide-react'
import PagePlaceholder from '@/components/PagePlaceholder'

export default function MeetingsPage() {
  return (
    <PagePlaceholder
      icon={Video}
      title="Meetings"
      description="Upcoming, completed, and AI-suggested meetings with summaries."
    />
  )
}
