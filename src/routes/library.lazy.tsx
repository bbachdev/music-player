import Library from '@/screens/Library';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/library')({
  component: LibraryRoute,
})

function LibraryRoute() {
  return <Library />
}