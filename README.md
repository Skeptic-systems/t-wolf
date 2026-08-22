# T-Wolf.it

Website for T-Wolf.it built with TanStack Start, current React tooling,
Tailwind CSS, Nitro Node output, and Docker support. This project intentionally
has no database, no API routes, and no server functions.

## Stack

- TanStack Start with file-based TanStack Router
- React 19
- Vite 8
- Tailwind CSS 4
- Local Google Fonts: Montserrat, Plus Jakarta Sans, Space Mono
- i18n for German, English, and Italian without locale URL prefixes
- TanStack route head SEO metadata with social previews
- Nitro Node server output
- pnpm
- Docker / Docker Compose
- Three.js / React Three Fiber for the scroll-driven 3D band
- Oxlint

## 3D signature band

The home page includes a scroll-driven 3D section between the hero and the
first content section. It is lazy loaded, so `three` never enters the initial
bundle, and it degrades to a rendered still for reduced-motion visitors and
browsers without WebGL.

Assets live in `public/assets/3d/` and are generated from
`tools/blender/` — see the README there to regenerate them.

## Development

```bash
pnpm install
pnpm dev
```

The dev server runs on `http://localhost:3000`.

Routes:

- Home: `http://localhost:3000/`
- Privacy: `http://localhost:3000/privacy`
- Imprint: `http://localhost:3000/imprint`

The language is resolved in this order:

1. Stored `localStorage` value at `t-wolf.locale`
2. Browser language when it is `de`, `en`, or `it`
3. English fallback

In development, click the TanStack icon in the bottom-right corner and open the
SEO view to inspect platform previews and route metadata.

## Production

```bash
pnpm build
pnpm start
```

The production entrypoint is `.output/server/index.mjs`.

## Docker

```bash
docker compose up --build
```

The container exposes the website on `http://localhost:3000`.

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm build
```
