import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'

const queryClient = new QueryClient()

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <div className={`min-h-dvh dark:bg-slate-800 dark:text-white flex`}>
          <Outlet />
          {/* <TanStackRouterDevtools /> */}
        </div>
      </QueryClientProvider>
    </ThemeProvider>
  ),
})