import { getMeetings } from './get-meetings.api'

export const queryGetMeetings = () => ({
  queryKey: ['getMeetings'],
  queryFn: () => getMeetings(),
  staleTime: 1000 * 60 * 2, // 2 minutes
})
