import { Card, Badge, Button, Avatar, PageHeader } from '@/components/ui'
import { currentUser } from '@/lib/user'

type DetailRow = {
  label: string
  value: string
}

export default function ProfilePage() {
  const details: DetailRow[] = [
    { label: 'Full name', value: currentUser.name },
    { label: 'Email', value: currentUser.email },
    { label: 'Role', value: currentUser.role },
    { label: 'Timezone', value: currentUser.timezone },
    { label: 'Member since', value: currentUser.joinedAt },
  ]

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-8">
      <PageHeader
        title="Profile"
        subtitle="Manage your account information and preferences."
        actions={<Button variant="outline" size="sm">Edit profile</Button>}
      />

      {/* Identity card */}
      <Card>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Avatar
            name={currentUser.name}
            src={currentUser.avatarUrl}
            sx={{ width: 72, height: 72, bgcolor: 'primary.main', fontSize: 26 }}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-fg">
                {currentUser.name}
              </h2>
              <Badge tone="primary">{currentUser.plan}</Badge>
            </div>
            <p className="mt-0.5 text-sm text-muted">{currentUser.email}</p>
            <p className="text-sm text-muted">{currentUser.role}</p>
          </div>
        </div>
      </Card>

      {/* Account details */}
      <Card title="Account details" noPadding>
        <dl className="divide-y divide-line">
          {details.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-1 gap-1 px-5 py-3 sm:grid-cols-3"
            >
              <dt className="text-sm text-muted">{row.label}</dt>
              <dd className="text-sm font-medium text-fg sm:col-span-2">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  )
}
