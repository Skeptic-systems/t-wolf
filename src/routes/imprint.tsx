import { createFileRoute } from '@tanstack/react-router'
import { LegalPage } from '../components/LegalPage'
import { getRouteHead } from '../i18n'

export const Route = createFileRoute('/imprint')({
  head: () => getRouteHead('imprint'),
  component: Imprint,
})

function Imprint() {
  return <LegalPage page="imprint" />
}
