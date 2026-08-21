import { useEffect } from 'react'
import {
  type Locale,
  type PageKey,
  content,
  pages,
  siteBaseUrl,
  socialImagePath,
} from '../i18n'

const metaSelectors = {
  description: 'meta[name="description"]',
  ogLocale: 'meta[property="og:locale"]',
  ogTitle: 'meta[property="og:title"]',
  ogDescription: 'meta[property="og:description"]',
  ogUrl: 'meta[property="og:url"]',
  twitterTitle: 'meta[name="twitter:title"]',
  twitterDescription: 'meta[name="twitter:description"]',
} as const

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let element = document.querySelector<HTMLMetaElement>(selector)

  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }

  Object.entries(attrs).forEach(([key, value]) =>
    element.setAttribute(key, value),
  )
}

function upsertCanonical(href: string) {
  let element = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')

  if (!element) {
    element = document.createElement('link')
    element.rel = 'canonical'
    document.head.appendChild(element)
  }

  element.href = href
}

export function useLocalizedSeo(page: PageKey, locale: Locale) {
  useEffect(() => {
    const seo = content[locale].seo[page]
    const url = `${siteBaseUrl}${pages[page].path}`
    const image = `${siteBaseUrl}${socialImagePath}`

    document.title = seo.title
    upsertCanonical(url)
    upsertMeta(metaSelectors.description, {
      name: 'description',
      content: seo.description,
    })
    upsertMeta(metaSelectors.ogLocale, {
      property: 'og:locale',
      content: locale,
    })
    upsertMeta(metaSelectors.ogTitle, {
      property: 'og:title',
      content: seo.title,
    })
    upsertMeta(metaSelectors.ogDescription, {
      property: 'og:description',
      content: seo.description,
    })
    upsertMeta(metaSelectors.ogUrl, {
      property: 'og:url',
      content: url,
    })
    upsertMeta('meta[property="og:image"]', {
      property: 'og:image',
      content: image,
    })
    upsertMeta(metaSelectors.twitterTitle, {
      name: 'twitter:title',
      content: seo.title,
    })
    upsertMeta(metaSelectors.twitterDescription, {
      name: 'twitter:description',
      content: seo.description,
    })
    upsertMeta('meta[name="twitter:image"]', {
      name: 'twitter:image',
      content: image,
    })
  }, [locale, page])
}
