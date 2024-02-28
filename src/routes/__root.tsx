import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className={`min-h-dvh dark:bg-slate-800 dark:text-white flex`}>
        <Outlet />
        {/* <TanStackRouterDevtools /> */}
      </div>
    </ThemeProvider>
  ),
})