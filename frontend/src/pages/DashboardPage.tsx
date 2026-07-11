import { useAuth } from '@/app/AuthProvider'
import { useQueryGetDashboard } from '@/services/dashboard'
import { Card, PageHeader, Badge, Spinner, Avatar } from '@/components/ui'
import {
  Users,
  Building2,
  FolderKanban,
  Layers,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
} from 'lucide-react'
import type { AdminDashboard, ManagerDashboard, EmployeeDashboard } from '@/services/dashboard'

export default function DashboardPage() {
  const { user } = useAuth()
  const { dashboardData: data, isLoading } = useQueryGetDashboard()

  if (isLoading) {
    return (
      <div className="grid h-full place-items-center">
        <Spinner label="Loading dashboard..." />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="grid h-full place-items-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-fg">No dashboard data</p>
          <p className="mt-1 text-sm text-muted">Could not load your dashboard. Please try refreshing.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-8">
      <PageHeader
        title={`Good morning, ${user?.name?.split(' ')[0] ?? ''} 👋`}
        subtitle="Here's a snapshot of your day. Ask Zeva to take it from here."
      />

      {data?.type === 'admin' && <AdminView data={data} />}
      {data?.type === 'manager' && <ManagerView data={data} />}
      {data?.type === 'employee' && <EmployeeView data={data} />}
    </div>
  )
}

function AdminView({ data }: { data: AdminDashboard }) {
  const stats = [
    { label: 'Members', value: data.org.members, icon: Users, tone: 'primary' as const },
    { label: 'Departments', value: data.org.departments, icon: Building2, tone: 'info' as const },
    { label: 'Teams', value: data.org.teams, icon: Layers, tone: 'success' as const },
    { label: 'Projects', value: data.org.projects, icon: FolderKanban, tone: 'warning' as const },
  ]

  const taskTotal = Object.values(data.tasks).reduce((a, b) => a + b, 0)

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <s.icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-fg">{s.value}</p>
              <p className="text-sm text-muted">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card title="Tasks overview" subtitle={`${taskTotal} total tasks across all projects`}>
        <div className="flex flex-wrap gap-3">
          {Object.entries(data.tasks).map(([status, count]) => (
            <div key={status} className="flex items-center gap-2 rounded-lg bg-elevated px-4 py-2">
              <StatusIcon status={status} />
              <span className="text-sm font-medium text-fg">{count}</span>
              <span className="text-sm text-muted capitalize">{status.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}

function ManagerView({ data }: { data: ManagerDashboard }) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-muted mb-2">
            <Users size={16} />
            <span className="text-sm font-medium">Team</span>
          </div>
          <p className="text-2xl font-bold text-fg">{data.team.memberCount} members</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-muted mb-2">
            <AlertTriangle size={16} />
            <span className="text-sm font-medium">Blockers</span>
          </div>
          <p className="text-2xl font-bold text-red-500">{data.tasks.blockers}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-muted mb-2">
            <Clock size={16} />
            <span className="text-sm font-medium">Late tasks</span>
          </div>
          <p className="text-2xl font-bold text-amber-500">{data.tasks.lateTasks}</p>
        </Card>
      </div>

      <Card title="Team members">
        <div className="flex flex-wrap gap-3">
          {data.team.members.map((m) => (
            <div key={m.id} className="flex items-center gap-2 rounded-lg bg-elevated px-3 py-2">
              <Avatar name={m.name} src={m.photoUrl ?? undefined} sx={{ width: 28, height: 28, fontSize: 12 }} />
              <div>
                <p className="text-sm font-medium text-fg">{m.name}</p>
                <p className="text-xs text-muted">{m.jobTitle}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Task breakdown">
        <div className="flex flex-wrap gap-3">
          {Object.entries(data.tasks.byStatus).map(([status, count]) => (
            <div key={status} className="flex items-center gap-2 rounded-lg bg-elevated px-4 py-2">
              <StatusIcon status={status} />
              <span className="text-sm font-medium text-fg">{count}</span>
              <span className="text-sm text-muted capitalize">{status.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}

function EmployeeView({ data }: { data: EmployeeDashboard }) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card title="My tasks" subtitle={`${data.tasks.length} active`}>
          {data.tasks.length === 0 ? (
            <p className="text-sm text-muted">No active tasks — nice!</p>
          ) : (
            <ul className="space-y-2">
              {data.tasks.slice(0, 6).map((t) => (
                <li key={t.id} className="flex items-center gap-3">
                  <StatusIcon status={t.status} />
                  <span className="flex-1 text-sm text-fg">{t.title}</span>
                  <Badge tone={priorityTone(t.priority)}>{t.priority}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Today's meetings" subtitle={`${data.meetings.length} scheduled`}>
          {data.meetings.length === 0 ? (
            <p className="text-sm text-muted">No meetings today — focus time!</p>
          ) : (
            <ul className="space-y-2">
              {data.meetings.map((m) => (
                <li key={m.id} className="flex items-center gap-3">
                  <Calendar size={16} className="text-brand" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-fg">{m.title}</p>
                    <p className="text-xs text-muted">
                      {new Date(m.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {' – '}
                      {new Date(m.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  )
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'done':
      return <CheckCircle2 size={16} className="text-green-500" />
    case 'in_progress':
      return <Clock size={16} className="text-blue-500" />
    default:
      return <div className="h-4 w-4 rounded-full border-2 border-muted" />
  }
}

function priorityTone(p: string) {
  switch (p) {
    case 'critical':
      return 'danger' as const
    case 'high':
      return 'warning' as const
    case 'medium':
      return 'neutral' as const
    default:
      return 'info' as const
  }
}
