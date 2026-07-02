import { useQuery } from '@tanstack/react-query'
import { queryGetDashboard } from './get-dashboard.query'
import type { GetDashboardResponse } from './types'

export const useQueryGetDashboard = (enabled = true) => {
  const { data, isLoading, error, isError, refetch } = useQuery<GetDashboardResponse, Error>({
    ...queryGetDashboard(),
    enabled,
  })

  return {
    dashboardData: data,
    isLoading,
    error,
    isError,
    refetch,
  }
}
