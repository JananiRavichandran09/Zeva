import { useQueryGetUsers } from '@/services/users'
import { Card, PageHeader, Badge, Spinner, Avatar } from '@/components/ui'
import { Mail } from 'lucide-react'

export default function TeamPage() {
  const { usersData: users, isLoading } = useQueryGetUsers()

  if (isLoading) {
    return (
      <div className="grid h-full place-items-center">
        <Spinner label="Loading team..." />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-8">
      <PageHeader
        title="Team"
        subtitle={`${users?.length ?? 0} members in your organization`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users?.map((member) => (
          <Card key={member.id} className="flex items-start gap-4 p-5">
            <Avatar
              name={member.name}
              src={member.photoUrl ?? undefined}
              sx={{ width: 44, height: 44, fontSize: 16 }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-fg">{member.name}</p>
              <p className="truncate text-xs text-muted">{member.jobTitle ?? 'Team member'}</p>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge tone={roleTone(member.role)}>{member.roleName}</Badge>
                {member.department && (
                  <Badge tone="neutral">{member.department}</Badge>
                )}
              </div>

              <div className="mt-2 flex items-center gap-1 text-xs text-muted">
                <Mail size={12} />
                <span className="truncate">{member.email}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function roleTone(role: string) {
  switch (role) {
    case 'admin': return 'danger' as const
    case 'manager': return 'warning' as const
    case 'lead': return 'primary' as const
    case 'developer': return 'info' as const
    case 'qa': return 'success' as const
    case 'hr': return 'neutral' as const
    default: return 'neutral' as const
  }
}
