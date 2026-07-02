import { getTeams } from './get-teams.api'

export const queryGetTeams = () => ({
  queryKey: ['getTeams'],
  queryFn: () => getTeams(),
  staleTime: 1000 * 60 * 10,
})
