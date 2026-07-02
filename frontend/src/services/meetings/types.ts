export interface Meeting {
  id: string
  title: string
  startsAt: string
  endsAt: string
  location: string | null
  agenda: string | null
  organizer: { id: string; name: string; photoUrl: string | null } | null
  _count: { actionItems: number }
}
