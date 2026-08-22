/**
 * In-page navigation.
 *
 * The site never leaves a hash fragment in the URL, so scrolling to a section
 * is a scripted scroll plus a `replaceState` clean-up rather than an anchor.
 */

/** Height of the floating header, so a section never lands underneath it. */
function headerOffset() {
  const bar = document.querySelector<HTMLElement>('.bar')
  return bar ? bar.getBoundingClientRect().bottom + 16 : 0
}

export function cleanPath() {
  return `${window.location.pathname}${window.location.search}`
}

export function scrollToSection(id: string) {
  const element = document.getElementById(id)
  const shouldCleanHash = Boolean(window.location.hash)

  if (element) {
    const top = Math.max(
      0,
      element.getBoundingClientRect().top + window.scrollY - headerOffset(),
    )
    window.scrollTo({ top, behavior: 'smooth' })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (shouldCleanHash) {
    window.setTimeout(() => {
      window.history.replaceState(null, '', cleanPath())
    }, 0)
  }
}
