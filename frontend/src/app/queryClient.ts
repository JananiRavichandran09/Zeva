import { QueryClient } from '@tanstack/react-query'

// Single shared TanStack Query client for the app.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
