import { getUsers } from './get-users.api'

export const queryGetUsers = () => ({
  queryKey: ['getUsers'],
  queryFn: () => getUsers(),
  staleTime: 1000 * 60 * 5, // 5 minutes
})
