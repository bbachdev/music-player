import App from '@/screens/App';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <App />
  )
}