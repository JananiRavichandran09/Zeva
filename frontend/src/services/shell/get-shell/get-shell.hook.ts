import { useQuery } from '@tanstack/react-query'
import { queryGetShell } from './get-shell.query'
import type { GetShellResponse } from './types'

export const useQueryGetShell = (enabled = true) => {
  const { data, isLoading, error, isError } = useQuery<GetShellResponse, Error>({
    ...queryGetShell(),
    enabled,
  })

  return {
    shellData: data,
    isLoading,
    error,
    isError,
  }
}
