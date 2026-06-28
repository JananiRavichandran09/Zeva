import Paper from '@mui/material/Paper'

type Stat = {
  label: string
  value: string
  hint: string
}

const stats: Stat[] = [
  { label: 'Tasks today', value: '5', hint: '2 overdue' },
  { label: 'Meetings', value: '3', hint: 'next at 10:00 AM' },
  { label: 'Unread emails', value: '12', hint: '5 high priority' },
  { label: 'AI actions', value: '28', hint: 'this week' },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 overflow-y-auto p-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Good morning 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Here's a snapshot of your day. Ask Zeva to take it from here.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Paper
            key={stat.label}
            elevation={0}
            className="border border-slate-200"
            sx={{ p: 2.5, borderRadius: 3 }}
          >
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-slate-400">{stat.hint}</p>
          </Paper>
        ))}
      </section>

      <Paper
        elevation={0}
        className="border border-slate-200"
        sx={{ p: 3, borderRadius: 3 }}
      >
        <h2 className="text-lg font-semibold text-slate-900">Coming soon</h2>
        <p className="mt-1 text-sm text-slate-500">
          Task list, calendar, and productivity charts will live here. For now,
          head to Chat to try the assistant.
        </p>
      </Paper>
    </div>
  )
}
