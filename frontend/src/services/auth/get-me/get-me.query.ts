import { getMe } from './get-me.api'

export const queryGetMe = () => ({
  queryKey: ['getMe'],
  queryFn: () => getMe(),
  staleTime: 1000 * 60 * 5, // 5 minutes
})
