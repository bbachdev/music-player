import Settings from '@/screens/Settings';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/settings')({
  component: SettingsRoute,
})

function SettingsRoute() {
  return <Settings />
}