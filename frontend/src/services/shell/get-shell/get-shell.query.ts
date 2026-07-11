import { getShell } from './get-shell.api'

export const queryGetShell = () => ({
  queryKey: ['getShell'],
  queryFn: () => getShell(),
  staleTime: 1000 * 60 * 30, // 30 minutes — shell rarely changes
})
