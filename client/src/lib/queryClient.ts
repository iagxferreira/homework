import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: unknown) => {
        if ((error as { status?: number })?.status === 401) return false;
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});