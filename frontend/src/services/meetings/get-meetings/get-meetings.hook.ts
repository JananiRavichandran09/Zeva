import { useQuery } from '@tanstack/react-query'
import { queryGetMeetings } from './get-meetings.query'
import type { GetMeetingsResponse } from './types'

export const useQueryGetMeetings = (enabled = true) => {
  const { data, isLoading, error, isError, refetch } = useQuery<GetMeetingsResponse, Error>({
    ...queryGetMeetings(),
    enabled,
  })

  return {
    meetingsData: data,
    isLoading,
    error,
    isError,
    refetch,
  }
}
