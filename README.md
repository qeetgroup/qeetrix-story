# qeetrix-story

Storybook 10 workshop for the Qeetrix design system (`@qeetrix/stories`, private — not
published). It documents and tests the **`@qeetrix/ui` component library**, rendering every
component exactly as a consumer sees it, with light/dark driven by the `.dark` class strategy.

`@qeetrix/ui` is resolved from a sibling checkout's `src/`, not from `node_modules`, so clone
both side by side:

```
QG/qeetrix/
├── qeetrix-ui/      ← the design system, on the release package.json installs (2.1.4)
└── qeetrix-story/   ← this repo
```

```bash
bun install
bun run dev      # workshop on http://localhost:6006
bun run test     # every story as a test in headless Chromium, axe gate included
bun run build    # llms.txt + static build → storybook-static/
```

## Contents

- **Foundations** — Colors, Typography, Spacing & Radius, Borders, Elevation, Motion, Focus,
  Opacity, Density, Breakpoints, Z-index, Token Layers and Iconography, driven by the live
  `@qeetrix/ui` token CSS so they react to the Theme toolbar.
- **Components** — one story file per `@qeetrix/ui` component (139), grouped as actions,
  advanced, data display, data entry, feedback, forms, layout, media, navigation, overlays,
  typography and utilities.
- **Patterns** and **Recipes** — multi-component compositions (authentication, search,
  notification centre, …) and cross-cutting states (empty, error, loading, offline).
- **Guides** — getting started, design tokens, theming, foundation modes and accessibility.
- **Brand** — `QeetLogo` and the identity icons Qeet products draw, from `@qeetrix/icons`.
- **Playground** — configure a component and copy the generated JSX.

Icons inside component demos come from `@qeetrix/icons`, imported from the package root
(`import { TrashIcon } from "@qeetrix/icons"`). The icon catalogue itself is not part of this
workshop — it is documented in the `qeetrix-icons` repo.

## Release

The same flow as `qeetrix-ui`, `qeetrix-icons` and `qeetrix-docs`. Open a PR from `develop`
into `main` and `version.yml` bumps the patch version on it; merge it and `release.yml` runs
every CI gate, deploys the built workshop to Vercel production and tags `vX.Y.Z`.
`rollback.yml` redeploys an earlier tag. Deploying needs the `VERCEL_TOKEN` secret and the
`VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` variables — see the header of
[`release.yml`](./.github/workflows/release.yml).

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to add a story, and [`docs/`](./docs) for the
architecture, testing, accessibility and governance notes.
