import { getOrganization } from './get-organization.api'

export const queryGetOrganization = () => ({
  queryKey: ['getOrganization'],
  queryFn: () => getOrganization(),
  staleTime: 1000 * 60 * 10, // 10 minutes
})
