import { useMutation } from '@tanstack/react-query'
import type { AixMutation } from '../../utils/aix-mutation'
import type { LoginRequest, LoginResponse } from './types'
import { login } from './login.api'

export function useMutationLogin({ onSuccess, onError }: AixMutation<LoginRequest, LoginResponse>) {
  return useMutation({
    mutationFn: (params: LoginRequest) => login(params),
    mutationKey: ['login'],
    onSuccess,
    onError,
  })
}
