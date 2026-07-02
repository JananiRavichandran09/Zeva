import { FileText } from 'lucide-react'
import PagePlaceholder from '@/components/PagePlaceholder'

export default function DocumentsPage() {
  return (
    <PagePlaceholder
      icon={FileText}
      title="Documents"
      description="Files with AI summaries, versions, tags, and preview."
    />
  )
}
