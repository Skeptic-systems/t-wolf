import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '../components/HomePage'
import { getRouteHead } from '../i18n'

export const Route = createFileRoute('/')({
  head: () => getRouteHead('home'),
  component: Home,
})

function Home() {
  return <HomePage />
}
