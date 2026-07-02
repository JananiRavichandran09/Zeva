import { useQuery } from '@tanstack/react-query'
import { queryGetUsers } from './get-users.query'
import type { GetUsersResponse } from './types'

export const useQueryGetUsers = (enabled = true) => {
  const { data, isLoading, error, isError, refetch } = useQuery<GetUsersResponse, Error>({
    ...queryGetUsers(),
    enabled,
  })

  return {
    usersData: data,
    isLoading,
    error,
    isError,
    refetch,
  }
}
