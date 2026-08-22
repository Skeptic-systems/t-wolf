import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { LOCALES, localeLabels } from '../i18n'
import type { Locale, SiteCopy } from '../i18n'
import { useScrollSpy } from '../hooks/useScrollSpy'
import { scrollToSection } from '../scroll'

/** Section ids the header tracks, in page order. Module-level so the scroll
 *  spy's effect is not re-registered on every render. */
const NAV_SECTIONS = ['erkennen', 'leistungen', 'ablauf', 'referenzen', 'team']
const SHRINK_AT = 16
const EXPAND_AT = 1

/**
 * The floating header.
 *
 * At the top of the page it is a full-width, borderless bar that lets the hero
 * run right up under it. Past the fold it contracts into a blurred pill that
 * hovers over the content, which keeps the navigation reachable without the
 * permanent slab a sticky header usually costs.
 *
 * All of the motion is CSS: the component only publishes state (`data-shrunk`,
 * `data-open`) and the measured position of the indicator, so scrolling never
 * runs a JavaScript animation loop.
 */
export function SiteHeader({
  copy,
  locale,
  setLocale,
}: {
  copy: SiteCopy
  locale: Locale
  setLocale: (locale: Locale) => void
}) {
  const [shrunk, setShrunk] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const active = useScrollSpy(NAV_SECTIONS)

  const labels: Record<string, string> = {
    erkennen: copy.nav.known,
    leistungen: copy.nav.services,
    ablauf: copy.nav.process,
    referenzen: copy.nav.references,
    team: copy.nav.team,
  }

  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0
      const scrolled = window.scrollY
      setShrunk((isShrunk) =>
        scrolled > (isShrunk ? EXPAND_AT : SHRINK_AT),
      )

      const travel =
        document.documentElement.scrollHeight - window.innerHeight || 1
      setProgress(Math.min(1, Math.max(0, scrolled / travel)))
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Collapsing the sheet on resize avoids it being left open, and orphaned,
  // when the layout crosses back over to the desktop breakpoint.
  useEffect(() => {
    if (!menuOpen) return

    const close = () => setMenuOpen(false)
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    window.addEventListener('resize', close)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('resize', close)
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const go = (id: string) => {
    scrollToSection(id)
    setMenuOpen(false)
  }

  return (
    <header className="site-header" data-shrunk={shrunk} data-open={menuOpen}>
      <div className="bar-shell">
        <div className="bar">
          <button
            className="logo logo-button"
            onClick={() => go('top')}
            type="button"
            aria-label="T-Wolf.it"
          >
            <img src="/assets/img/logo-wortmarke.png" alt="T-Wolf.it" />
          </button>

          <NavLinks
            active={active}
            labels={labels}
            onSelect={go}
            sections={NAV_SECTIONS}
          />

          <LanguageSwitcher copy={copy} locale={locale} setLocale={setLocale} />

          <button
            className="btn btn-p btn-sm hdr-cta"
            onClick={() => go('kontakt')}
            type="button"
          >
            {copy.nav.cta}
          </button>

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
            aria-expanded={menuOpen}
          >
            <span className="menu-bars" aria-hidden="true">
              <i />
              <i />
            </span>
            <span className="menu-label">{copy.nav.menu}</span>
          </button>

          {/* Reading progress, drawn on the pill's own edge so it costs no
              extra layout and disappears with the pill at the top. */}
          <span
            className="bar-progress"
            aria-hidden="true"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      </div>

      <div className="nav-sheet" aria-label="Main" role="navigation">
        <div className="nav-sheet-clip">
          <div className="nav-sheet-inner">
            {NAV_SECTIONS.map((id) => (
              <button
                key={id}
                onClick={() => go(id)}
                type="button"
                aria-current={active === id ? 'true' : undefined}
              >
                {labels[id]}
              </button>
            ))}
            <button
              className="btn btn-p nav-cta"
              onClick={() => go('kontakt')}
              type="button"
            >
              {copy.nav.cta}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

/**
 * Desktop links with a single sliding indicator.
 *
 * One shared pill that is moved to the hovered — or, failing that, the current
 * — item, rather than a background on each link. That is what makes the
 * highlight travel between items instead of blinking from one to the next.
 */
function NavLinks({
  active,
  labels,
  onSelect,
  sections,
}: {
  active: string | null
  labels: Record<string, string>
  onSelect: (id: string) => void
  sections: Array<string>
}) {
  const items = useRef<Array<HTMLButtonElement | null>>([])
  const [hovered, setHovered] = useState<string | null>(null)
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null)

  const target = hovered ?? active

  // Layout effect, not effect: the indicator is positioned from measured
  // geometry, and reading it after paint would show it a frame behind.
  useLayoutEffect(() => {
    const index = target ? sections.indexOf(target) : -1
    const node = index >= 0 ? items.current[index] : null

    if (!node) {
      setPill(null)
      return
    }
    setPill({ left: node.offsetLeft, width: node.offsetWidth })
  }, [target, sections])

  return (
    <nav
      className="nav-links"
      aria-label="Main"
      onMouseLeave={() => setHovered(null)}
    >
      <span
        className="nav-pill"
        aria-hidden="true"
        data-visible={pill !== null}
        style={
          pill
            ? { transform: `translateX(${pill.left}px)`, width: pill.width }
            : undefined
        }
      />
      {sections.map((id, index) => (
        <button
          key={id}
          ref={(node) => {
            items.current[index] = node
          }}
          onClick={() => onSelect(id)}
          onMouseEnter={() => setHovered(id)}
          onFocus={() => setHovered(id)}
          onBlur={() => setHovered(null)}
          type="button"
          aria-current={active === id ? 'true' : undefined}
        >
          {labels[id]}
        </button>
      ))}
    </nav>
  )
}

function LanguageSwitcher({
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
