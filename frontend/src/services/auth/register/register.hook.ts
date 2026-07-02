import { useMutation } from '@tanstack/react-query'
import type { AixMutation } from '../../utils/aix-mutation'
import type { RegisterRequest, RegisterResponse } from './types'
import { register } from './register.api'

export function useMutationRegister({ onSuccess, onError }: AixMutation<RegisterRequest, RegisterResponse>) {
  return useMutation({
    mutationFn: (params: RegisterRequest) => register(params),
    mutationKey: ['register'],
    onSuccess,
    onError,
  })
}
