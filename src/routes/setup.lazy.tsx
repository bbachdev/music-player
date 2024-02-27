import Setup from '@/screens/Setup';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/setup')({
  component: SetupRoute,
})

function SetupRoute() {
  return <Setup />
}