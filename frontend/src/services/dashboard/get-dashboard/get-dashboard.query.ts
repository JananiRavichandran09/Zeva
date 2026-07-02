import { getDashboard } from './get-dashboard.api'

export const queryGetDashboard = () => ({
  queryKey: ['getDashboard'],
  queryFn: () => getDashboard(),
  staleTime: 1000 * 60 * 2, // 2 minutes
})
