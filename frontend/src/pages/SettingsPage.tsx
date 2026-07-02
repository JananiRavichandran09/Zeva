import { Settings } from 'lucide-react'
import PagePlaceholder from '@/components/PagePlaceholder'

export default function SettingsPage() {
  return (
    <PagePlaceholder
      icon={Settings}
      title="Settings"
      description="Profile, workspace, appearance, AI preferences, and integrations."
    />
  )
}
