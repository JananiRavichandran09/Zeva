import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AixMutation } from '../../utils/aix-mutation'
import type { UpdateTaskRequest, UpdateTaskResponse } from './types'
import { updateTask } from './update-task.api'

export function useMutationUpdateTask({ onSuccess, onError }: AixMutation<UpdateTaskRequest, UpdateTaskResponse>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: UpdateTaskRequest) => updateTask(params),
    mutationKey: ['updateTask'],
    onSuccess: (data, variables, context) => {
      void queryClient.invalidateQueries({ queryKey: ['getTasks'] })
      void queryClient.invalidateQueries({ queryKey: ['getDashboard'] })
      onSuccess(data, variables, context)
    },
    onError,
  })
}
