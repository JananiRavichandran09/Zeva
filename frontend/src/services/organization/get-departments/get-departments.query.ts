import { getDepartments } from './get-departments.api'

export const queryGetDepartments = () => ({
  queryKey: ['getDepartments'],
  queryFn: () => getDepartments(),
  staleTime: 1000 * 60 * 10,
})
