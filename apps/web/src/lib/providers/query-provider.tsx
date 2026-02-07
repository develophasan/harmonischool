"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState } from "react"

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 dakika - veriler 1 dakika boyunca fresh kalır
            gcTime: 5 * 60 * 1000, // 5 dakika - cache'de tutulma süresi (eski cacheTime)
            refetchOnWindowFocus: false, // Pencere focus olduğunda otomatik refetch yapma
            refetchOnReconnect: true, // İnternet bağlantısı geldiğinde refetch yap
            retry: 1, // Hata durumunda 1 kez daha dene
            refetchOnMount: true, // Component mount olduğunda refetch yap
          },
          mutations: {
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

