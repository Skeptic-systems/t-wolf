import { createFileRoute } from '@tanstack/react-router'
import { LegalPage } from '../components/LegalPage'
import { getRouteHead } from '../i18n'

export const Route = createFileRoute('/privacy')({
  head: () => getRouteHead('privacy'),
  component: Privacy,
})

function Privacy() {
  return <LegalPage page="privacy" />
}
