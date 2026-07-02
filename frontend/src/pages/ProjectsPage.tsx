import { FolderKanban } from 'lucide-react'
import PagePlaceholder from '@/components/PagePlaceholder'

export default function ProjectsPage() {
  return (
    <PagePlaceholder
      icon={FolderKanban}
      title="Projects"
      description="Project health, sprint progress, milestones, and AI summaries."
    />
  )
}
