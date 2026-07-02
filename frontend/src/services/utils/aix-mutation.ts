/**
 * Standardized callback signatures for useMutation hooks.
 * P = request params type, R = response type.
 */
export interface AixMutation<P, R> {
  onSuccess: (data: R, variables: P, context: unknown) => Promise<unknown> | unknown
  onError: (error: Error, variables: P, context: unknown) => Promise<unknown> | unknown
}
