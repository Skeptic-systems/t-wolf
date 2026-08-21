import { useEffect, useState } from 'react'
import {
  FALLBACK_LOCALE,
  type Locale,
  content,
  readStoredLocale,
  resolveInitialLocale,
  writeStoredLocale,
} from '../i18n'

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>(FALLBACK_LOCALE)

  useEffect(() => {
    const nextLocale = resolveInitialLocale()
    setLocaleState(nextLocale)
    document.documentElement.lang = nextLocale
    document.documentElement.dataset.locale = nextLocale

    const onLocaleChange = () => {
      const storedLocale = readStoredLocale()
      if (!storedLocale) return
      setLocaleState(storedLocale)
      document.documentElement.lang = storedLocale
      document.documentElement.dataset.locale = storedLocale
    }

    window.addEventListener('t-wolf:localechange', onLocaleChange)
    return () =>
      window.removeEventListener('t-wolf:localechange', onLocaleChange)
  }, [])

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale)
    document.documentElement.lang = nextLocale
    document.documentElement.dataset.locale = nextLocale
    writeStoredLocale(nextLocale)
  }

  return {
    copy: content[locale],
    locale,
    setLocale,
  }
}
