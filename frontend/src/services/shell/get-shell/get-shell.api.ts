import type { GetShellResponse } from './types'

/**
 * In production this calls the backend shell endpoint.
 * For now it loads the local JSON data directly (no backend endpoint needed yet).
 */
export const getShell = async (): Promise<GetShellResponse> => {
  const data = await import('../data/shell-info.json')
  return data.default as GetShellResponse
}
