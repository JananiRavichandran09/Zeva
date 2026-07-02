import { useQuery } from '@tanstack/react-query'
import { queryGetTasks } from './get-tasks.query'
import type { GetTasksParams, GetTasksResponse } from './types'

export const useQueryGetTasks = (params: GetTasksParams = {}, enabled = true) => {
  const { data, isLoading, error, isError, refetch } = useQuery<GetTasksResponse, Error>({
    ...queryGetTasks(params),
    enabled,
  })

  return {
    tasksData: data,
    isLoading,
    error,
    isError,
    refetch,
  }
}
