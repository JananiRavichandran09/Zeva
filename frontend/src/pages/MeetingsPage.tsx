import { useQueryGetMeetings } from '@/services/meetings'
import { Card, PageHeader, Badge, Spinner, Avatar } from '@/components/ui'
import { Calendar, MapPin, FileText } from 'lucide-react'

export default function MeetingsPage() {
  const { meetingsData: meetings, isLoading } = useQueryGetMeetings()

  if (isLoading) {
    return (
      <div className="grid h-full place-items-center">
        <Spinner label="Loading meetings..." />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-8">
      <PageHeader
        title="Meetings"
        subtitle={`${meetings?.length ?? 0} upcoming meetings`}
      />

      {!meetings || meetings.length === 0 ? (
        <Card className="p-8 text-center">
          <Calendar size={40} className="mx-auto mb-3 text-muted" />
          <p className="text-sm text-muted">No meetings scheduled. Enjoy the focus time!</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {meetings.map((meeting) => {
            const start = new Date(meeting.startsAt)
            const end = new Date(meeting.endsAt)
            const isPast = end < new Date()

            return (
              <Card key={meeting.id}>
                <div className="flex items-start gap-4">
                  {/* Date block */}
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <span className="text-xs font-medium uppercase">
                      {start.toLocaleDateString(undefined, { month: 'short' })}
                    </span>
                    <span className="text-lg font-bold leading-tight">
                      {start.getDate()}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-fg truncate">{meeting.title}</h3>
                      {isPast && <Badge tone="neutral">Past</Badge>}
                    </div>

                    <p className="mt-0.5 text-xs text-muted">
                      {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {' – '}
                      {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
                      {meeting.organizer && (
                        <div className="flex items-center gap-1.5">
                          <Avatar
                            name={meeting.organizer.name}
                            src={meeting.organizer.photoUrl ?? undefined}
                            sx={{ width: 18, height: 18, fontSize: 9 }}
                          />
                          <span>{meeting.organizer.name}</span>
                        </div>
                      )}
                      {meeting.location && (
                        <div className="flex items-center gap-1">
                          <MapPin size={12} />
                          <span>{meeting.location}</span>
                        </div>
                      )}
                      {meeting._count.actionItems > 0 && (
                        <div className="flex items-center gap-1">
                          <FileText size={12} />
                          <span>{meeting._count.actionItems} action items</span>
                        </div>
                      )}
                    </div>

                    {meeting.agenda && (
                      <p className="mt-2 text-xs text-muted line-clamp-2">{meeting.agenda}</p>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
