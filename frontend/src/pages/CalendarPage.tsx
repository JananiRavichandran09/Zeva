import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, PageHeader, Spinner } from '@/components/ui'
import { ChevronLeft, ChevronRight, Video, ListChecks, Shield, Globe } from 'lucide-react'
import { httpGet } from '@/services/utils'

interface CalendarEvent {
  id: string
  title: string
  startsAt: string
  endsAt: string
  type: 'meeting' | 'task_due' | 'focus' | 'other'
  source: string
  color: string
  meta?: Record<string, unknown>
}

export default function CalendarPage() {
  const [weekOffset, setWeekOffset] = useState(0)

  const { monday, sunday, label } = useMemo(() => {
    const now = new Date()
    const day = now.getDay()
    const diff = now.getDate() - day + (day === 0 ? -6 : 1) + weekOffset * 7
    const mon = new Date(now.getFullYear(), now.getMonth(), diff)
    mon.setHours(0, 0, 0, 0)
    const sun = new Date(mon)
    sun.setDate(mon.getDate() + 6)
    sun.setHours(23, 59, 59, 999)

    const monthLabel = mon.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    return { monday: mon, sunday: sun, label: monthLabel }
  }, [weekOffset])

  const { data: events, isLoading } = useQuery<CalendarEvent[]>({
    queryKey: ['calendar', weekOffset],
    queryFn: async () => {
      const res = await httpGet<CalendarEvent[]>('/api/calendar', {
        from: monday.toISOString(),
        to: sunday.toISOString(),
      })
      return res.data
    },
  })

  const days = useMemo(() => {
    const result: { date: Date; events: CalendarEvent[] }[] = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      const dayEvents = (events ?? []).filter((e) => {
        const eventDate = new Date(e.startsAt)
        return eventDate.toDateString() === date.toDateString()
      })
      result.push({ date, events: dayEvents })
    }
    return result
  }, [monday, events])

  const isToday = (date: Date) => date.toDateString() === new Date().toDateString()

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-8">
      <PageHeader
        title="Calendar"
        subtitle="Unified view — meetings, tasks, and focus time from all your tools in one place"
      />

      {/* Source legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <span className="text-muted font-medium">Sources:</span>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full" style={{ background: '#6c63ff' }} />
          <span className="text-muted">Meetings (Outlook/Teams)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full" style={{ background: '#f59e0b' }} />
          <span className="text-muted">Task due dates (Jira)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full" style={{ background: '#3ddc97' }} />
          <span className="text-muted">Focus blocks (Zeva)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full" style={{ background: '#ef4444' }} />
          <span className="text-muted">High priority due</span>
        </div>
      </div>

      {/* Week navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setWeekOffset((w) => w - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-elevated text-muted hover:text-fg transition-colors"
          aria-label="Previous week"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="text-center">
          <p className="text-sm font-semibold text-fg">{label}</p>
          <p className="text-xs text-muted">
            {monday.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} –{' '}
            {sunday.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {weekOffset !== 0 && (
            <button
              onClick={() => setWeekOffset(0)}
              className="rounded-lg bg-elevated px-3 py-1.5 text-xs font-medium text-muted hover:text-fg transition-colors"
            >
              Today
            </button>
          )}
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-elevated text-muted hover:text-fg transition-colors"
            aria-label="Next week"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      {isLoading ? (
        <div className="grid place-items-center py-20">
          <Spinner label="Loading calendar..." />
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-3">
          {days.map(({ date, events: dayEvents }) => (
            <div key={date.toISOString()} className="min-h-[180px]">
              {/* Day header */}
              <div
                className={`mb-2 rounded-lg px-3 py-2 text-center ${
                  isToday(date)
                    ? 'bg-brand text-white'
                    : 'bg-elevated text-muted'
                }`}
              >
                <p className="text-xs font-medium uppercase">
                  {date.toLocaleDateString(undefined, { weekday: 'short' })}
                </p>
                <p className={`text-lg font-bold ${isToday(date) ? '' : 'text-fg'}`}>
                  {date.getDate()}
                </p>
              </div>

              {/* Events */}
              <div className="space-y-1.5">
                {dayEvents.length === 0 ? (
                  <p className="text-center text-xs text-muted py-4 opacity-50">—</p>
                ) : (
                  dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-lg border border-line bg-surface px-2.5 py-2 transition-all hover:shadow-sm"
                      style={{ borderLeftWidth: 3, borderLeftColor: event.color }}
                    >
                      <p className="text-xs font-medium text-fg leading-snug line-clamp-2">
                        {event.title}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5 text-[10px] text-muted">
                        <EventTypeIcon type={event.type} />
                        <span>
                          {new Date(event.startsAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span className="opacity-50">•</span>
                        <span className="capitalize">{event.source}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Coordination message */}
      <Card className="border-brand/20 bg-brand/5 p-4">
        <div className="flex items-start gap-3">
          <Globe size={18} className="text-brand shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-fg">
              Zeva coordinates — it doesn't replace your tools
            </p>
            <p className="mt-1 text-xs text-muted">
              Meetings from Outlook/Teams, task deadlines from Jira, focus blocks from Zeva, and PR reviews from GitHub — 
              all appear here so you never have to switch between 6 apps to understand your day.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

function EventTypeIcon({ type }: { type: string }) {
  switch (type) {
    case 'meeting':
      return <Video size={10} />
    case 'task_due':
      return <ListChecks size={10} />
    case 'focus':
      return <Shield size={10} />
    default:
      return <Globe size={10} />
  }
}
