import { useQuery } from '@tanstack/react-query'
import { queryGetDepartments } from './get-departments.query'
import type { GetDepartmentsResponse } from './types'

export const useQueryGetDepartments = (enabled = true) => {
  const { data, isLoading, error, isError, refetch } = useQuery<GetDepartmentsResponse, Error>({
    ...queryGetDepartments(),
    enabled,
  })

  return {
    departmentsData: data,
    isLoading,
    error,
    isError,
    refetch,
  }
}
