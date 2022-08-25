import { QueryCache, QueryClient } from 'vue-query'

export const queryCache = new QueryCache({
  onError (error, query) {
    if (error.code === 'ECONNABORTED') return
    // This is a global error handler for queries if we need it
    console.error('query error for', query.queryKey, error)
  },
})

export const queryClient = new QueryClient({
  queryCache,
  defaultOptions: {
    queries: {
      // I mainly put this here because on logout it tries to refetch a load of stuff multiple times (places, users)
      // (even though I have the "enabled" option to only do that if it's logged in
      retry: false,
    },
  },
})
