import { useState } from 'react'
import { useQueryGetTasks, useMutationUpdateTask } from '@/services/tasks'
import { Card, PageHeader, Badge, Spinner, Avatar } from '@/components/ui'
import { CheckCircle2, Clock, Circle, AlertTriangle } from 'lucide-react'

const STATUS_OPTIONS = ['all', 'todo', 'in_progress', 'review', 'done'] as const

export default function TasksPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const { tasksData: tasks, isLoading } = useQueryGetTasks(
    statusFilter === 'all' ? undefined : { status: statusFilter },
  )
  const updateTask = useMutationUpdateTask({
    onSuccess: () => {},
    onError: () => {},
  })

  if (isLoading) {
    return (
      <div className="grid h-full place-items-center">
        <Spinner label="Loading tasks..." />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-8">
      <PageHeader
        title="Tasks"
        subtitle={`${tasks?.length ?? 0} tasks across all projects`}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === s
                ? 'bg-brand text-white'
                : 'bg-elevated text-muted hover:text-fg'
            }`}
          >
            {s === 'all' ? 'All' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Task list */}
      <Card noPadding>
        {!tasks || tasks.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted">
            No tasks match the current filter.
          </div>
        ) : (
          <div className="divide-y divide-line">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-4 px-5 py-3.5">
                {/* Status toggle */}
                <button
                  onClick={() => {
                    const next = task.status === 'done' ? 'todo' : task.status === 'todo' ? 'in_progress' : 'done'
                    updateTask.mutate({ id: task.id, status: next })
                  }}
                  className="shrink-0"
                  aria-label={`Toggle status for ${task.title}`}
                >
                  <TaskStatusIcon status={task.status} />
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${task.status === 'done' ? 'text-muted line-through' : 'text-fg'}`}>
                    {task.title}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                    {task.project && <span>{task.project.key}</span>}
                    {task.dueDate && (
                      <span>
                        Due {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>

                {/* Priority */}
                <Badge tone={priorityTone(task.priority)}>{task.priority}</Badge>

                {/* Assignee */}
                {task.assignee && (
                  <Avatar
                    name={task.assignee.name}
                    src={task.assignee.photoUrl ?? undefined}
                    sx={{ width: 28, height: 28, fontSize: 11 }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

function TaskStatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'done':
      return <CheckCircle2 size={18} className="text-green-500" />
    case 'in_progress':
      return <Clock size={18} className="text-blue-500" />
    case 'review':
      return <AlertTriangle size={18} className="text-amber-500" />
    default:
      return <Circle size={18} className="text-muted" />
  }
}

function priorityTone(p: string) {
  switch (p) {
    case 'critical': return 'danger' as const
    case 'high': return 'warning' as const
    case 'medium': return 'neutral' as const
    default: return 'info' as const
  }
}
