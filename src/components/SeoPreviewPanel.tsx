import { useEffect, useState } from 'react'
import { FALLBACK_LOCALE, content, isLocale } from '../i18n'

type SeoPreviewPanelProps = {
  theme?: 'light' | 'dark'
}

type SeoSnapshot = {
  title: string
  description: string
  canonical: string
  image: string
  url: string
}

const emptySnapshot: SeoSnapshot = {
  title: '',
  description: '',
  canonical: '',
  image: '',
  url: '',
}

function readMeta(selector: string) {
  return document.querySelector<HTMLMetaElement>(selector)?.content ?? ''
}

function readLink(selector: string) {
  return document.querySelector<HTMLLinkElement>(selector)?.href ?? ''
}

function readSeoSnapshot(): SeoSnapshot {
  return {
    title: readMeta('meta[property="og:title"]') || document.title,
    description:
      readMeta('meta[property="og:description"]') ||
      readMeta('meta[name="description"]'),
    canonical: readLink('link[rel="canonical"]'),
    image:
      readMeta('meta[property="og:image"]') ||
      readMeta('meta[name="twitter:image"]'),
    url: readMeta('meta[property="og:url"]') || window.location.href,
  }
}

function resolveImageUrl(image: string) {
  if (!image) return ''
  return new URL(image, window.location.href).toString()
}

export function SeoPreviewPanel({ theme }: SeoPreviewPanelProps) {
  const [snapshot, setSnapshot] = useState<SeoSnapshot>(emptySnapshot)
  const [locale, setLocale] = useState(FALLBACK_LOCALE)

  useEffect(() => {
    const sync = () => {
      setSnapshot(readSeoSnapshot())
      const currentLocale = document.documentElement.lang
      setLocale(isLocale(currentLocale) ? currentLocale : FALLBACK_LOCALE)
    }

    sync()

    const observer = new MutationObserver(sync)
    observer.observe(document.head, {
      attributes: true,
      childList: true,
      subtree: true,
    })
    window.addEventListener('popstate', sync)

    return () => {
      observer.disconnect()
      window.removeEventListener('popstate', sync)
    }
  }, [])

  const copy = content[locale].seoPanel
  const isDark = theme === 'dark'
  const colors = {
    bg: isDark ? '#111317' : '#fffdf7',
    border: isDark ? 'rgba(255,255,255,.15)' : 'rgba(21,21,21,.18)',
    muted: isDark ? 'rgba(255,255,255,.68)' : 'rgba(21,21,21,.65)',
    text: isDark ? '#fffdf7' : '#151515',
    panel: isDark ? '#191d24' : '#f6f5ef',
  }
  const image = resolveImageUrl(snapshot.image)

  return (
    <div
      style={{
        minHeight: '100%',
        padding: 18,
        background: colors.bg,
        color: colors.text,
        fontFamily: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <header style={{ marginBottom: 18 }}>
        <h2
          style={{
            margin: '0 0 4px',
            fontFamily: '"Montserrat", ui-sans-serif, system-ui, sans-serif',
            fontSize: 22,
            letterSpacing: 0,
          }}
        >
          {copy.title}
        </h2>
        <p style={{ margin: 0, color: colors.muted }}>{copy.description}</p>
      </header>

      <div
        style={{
          display: 'grid',
          gap: 14,
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        }}
      >
        <PreviewCard title={copy.google} colors={colors}>
          <p style={{ margin: '0 0 4px', color: '#1a0dab', fontSize: 18 }}>
            {snapshot.title || copy.missing}
          </p>
          <p style={{ margin: '0 0 6px', color: '#008000', fontSize: 13 }}>
            {snapshot.canonical || snapshot.url || copy.missing}
          </p>
          <p style={{ margin: 0, color: colors.muted, lineHeight: 1.45 }}>
            {snapshot.description || copy.missing}
          </p>
        </PreviewCard>

        <PreviewCard title={copy.x} colors={colors}>
          {image ? (
            <img
              alt=""
              src={image}
              style={{
                width: '100%',
                aspectRatio: '1.91 / 1',
                objectFit: 'cover',
                border: `1px solid ${colors.border}`,
              }}
            />
          ) : null}
          <p style={{ margin: '10px 0 4px', fontWeight: 700 }}>
            {snapshot.title || copy.missing}
          </p>
          <p style={{ margin: 0, color: colors.muted, lineHeight: 1.45 }}>
            {snapshot.description || copy.missing}
          </p>
        </PreviewCard>

        <PreviewCard title={copy.discord} colors={colors}>
          <div
            style={{
              overflow: 'hidden',
              borderLeft: '4px solid #5865f2',
              borderRadius: 6,
              background: isDark ? '#252832' : '#ffffff',
            }}
          >
            {image ? (
              <img
                alt=""
                src={image}
                style={{
                  display: 'block',
                  width: '100%',
                  aspectRatio: '1.91 / 1',
                  objectFit: 'cover',
                }}
              />
            ) : null}
            <div style={{ padding: 12 }}>
              <p style={{ margin: '0 0 5px', fontWeight: 700 }}>
                {snapshot.title || copy.missing}
              </p>
              <p style={{ margin: 0, color: colors.muted, lineHeight: 1.45 }}>
                {snapshot.description || copy.missing}
              </p>
            </div>
          </div>
        </PreviewCard>
      </div>

      <section style={{ marginTop: 16 }}>
        <h3
          style={{
            margin: '0 0 8px',
            fontFamily: '"Montserrat", ui-sans-serif, system-ui, sans-serif',
            fontSize: 15,
          }}
        >
          {copy.metadata}
        </h3>
        <dl
          style={{
            display: 'grid',
            gap: 8,
            margin: 0,
            fontFamily: '"Space Mono", ui-monospace, monospace',
            fontSize: 12,
          }}
        >
          {Object.entries(snapshot).map(([key, value]) => (
            <div key={key}>
              <dt style={{ color: colors.muted }}>{key}</dt>
              <dd style={{ margin: 0, overflowWrap: 'anywhere' }}>
                {value || copy.missing}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}

function PreviewCard({
  children,
  colors,
  title,
}: {
  children: React.ReactNode
  colors: {
    bg: string
    border: string
    muted: string
    text: string
    panel: string
  }
  title: string
}) {
  return (
    <article
      style={{
        minHeight: 230,
        padding: 14,
        border: `1px solid ${colors.border}`,
        background: colors.panel,
      }}
    >
      <h3
        style={{
          margin: '0 0 12px',
          fontFamily: '"Montserrat", ui-sans-serif, system-ui, sans-serif',
          fontSize: 14,
          letterSpacing: 0,
        }}
      >
        {title}
      </h3>
      {children}
    </article>
  )
}
