## Project Rules

- Use the i18n layer in `src/i18n.ts` for all user-facing language text. Do not
  hardcode German, English, or Italian copy directly in route components.
- Supported locales are `de`, `en`, and `it`. Do not put the language into the
  URL path. Language is resolved from `localStorage`, then browser language, then
  English fallback.
- Subpages must use clean English slugs without file extensions, for example
  `/privacy` and `/imprint`, not `/datenschutz.html` or `/it/privacy`.
- In-page navigation may scroll to element ids, but it must not leave hash
  fragments in the URL.
- Keep SEO metadata in sync when adding or changing visible copy.
- Use TanStack route `head` metadata for SEO fields so the TanStack Devtools SEO
  view can inspect previews during development.
- Use `pnpm lint` for Oxlint. Do not reintroduce ESLint configuration unless the
  project explicitly changes linting policy.
