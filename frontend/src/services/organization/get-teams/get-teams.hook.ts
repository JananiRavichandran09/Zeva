import { useQuery } from '@tanstack/react-query'
import { queryGetTeams } from './get-teams.query'
import type { GetTeamsResponse } from './types'

export const useQueryGetTeams = (enabled = true) => {
  const { data, isLoading, error, isError, refetch } = useQuery<GetTeamsResponse, Error>({
    ...queryGetTeams(),
    enabled,
  })

  return {
    teamsData: data,
    isLoading,
    error,
    isError,
    refetch,
  }
}
