import { useQuery } from '@tanstack/react-query'
import { queryGetMe } from './get-me.query'
import type { GetMeResponse } from './types'

export const useQueryGetMe = (enabled = true) => {
  const { data, isLoading, error, isError, refetch } = useQuery<GetMeResponse, Error>({
    ...queryGetMe(),
    enabled,
  })

  return {
    meData: data,
    isLoading,
    error,
    isError,
    refetch,
  }
}
