import { useQuery } from '@tanstack/react-query'
import { queryGetOrganization } from './get-organization.query'
import type { GetOrganizationResponse } from './types'

export const useQueryGetOrganization = (enabled = true) => {
  const { data, isLoading, error, isError, refetch } = useQuery<GetOrganizationResponse, Error>({
    ...queryGetOrganization(),
    enabled,
  })

  return {
    organizationData: data,
    isLoading,
    error,
    isError,
    refetch,
  }
}
