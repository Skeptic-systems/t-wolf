import { Link } from '@tanstack/react-router'
import { LOCALES, localeLabels } from '../i18n'
import type { LegalSection, Locale, PageKey, SiteCopy } from '../i18n'
import { useLocale } from '../hooks/useLocale'
import { useLocalizedSeo } from '../hooks/useLocalizedSeo'

type LegalPageProps = {
  page: Extract<PageKey, 'privacy' | 'imprint'>
}

export function LegalPage({ page }: LegalPageProps) {
  const { copy, locale, setLocale } = useLocale()
  const title =
    page === 'privacy' ? copy.legal.privacyTitle : copy.legal.imprintTitle
  const eyebrow =
    page === 'privacy' ? copy.legal.privacyEyebrow : copy.legal.imprintEyebrow
  const stand =
    page === 'privacy' ? copy.legal.privacyStand : copy.legal.imprintStand
  const sections =
    page === 'privacy' ? copy.legal.privacySections : copy.legal.imprintSections

  useLocalizedSeo(page, locale)

  return (
    <>
      <header className="legal-header">
        <div className="wrap legal-bar">
          <Link className="logo" to="/">
            <img
              src="/assets/img/logo-wortmarke.png"
              alt="T-Wolf.it Digitalwerkstatt"
            />
          </Link>
          <Link className="zurueck" to="/">
            {copy.legal.back}
          </Link>
          <LegalLanguageSwitcher
            copy={copy}
            locale={locale}
            setLocale={setLocale}
          />
        </div>
      </header>
      <main className="legal-page">
        <div className="wrap legal-wrap">
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p className="stand">{stand}</p>
          {sections.map((section) => (
            <LegalSectionView key={section.title} section={section} />
          ))}
        </div>
      </main>
      <footer>
        <div className="wrap foot">
          <span>{copy.footer.copyright}</span>
          <span className="sp" />
          <Link to="/imprint">{copy.footer.imprint}</Link>
          <Link to="/privacy">{copy.footer.privacy}</Link>
        </div>
      </footer>
    </>
  )
}

function LegalLanguageSwitcher({
  copy,
  locale,
  setLocale,
}: {
  copy: SiteCopy
  locale: Locale
  setLocale: (locale: Locale) => void
}) {
  return (
    <div className="langs" aria-label={copy.nav.language}>
      {LOCALES.map((language, index) => (
        <span className="lang-item" key={language}>
          {index > 0 ? <span aria-hidden="true">/</span> : null}
          <button
            aria-current={language === locale ? 'true' : undefined}
            onClick={() => setLocale(language)}
            type="button"
          >
            {localeLabels[language]}
          </button>
        </span>
      ))}
    </div>
  )
}

function LegalSectionView({ section }: { section: LegalSection }) {
  return (
    <section className="legal-section">
      <h2>{section.title}</h2>
      {section.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      {section.list ? (
        <ul>
          {section.list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
