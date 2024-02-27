import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/setup')({
  component: Setup,
})

function Setup() {
  return <div className="p-2">Hello from Setup!</div>
}