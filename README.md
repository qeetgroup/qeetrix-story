# qeetrix-story

Storybook 10 workshop for the Qeetrix design system (`@qeetrix/stories`, private — not
published). It documents and tests **`@qeetrix/react`**, the Qeetrix React components, and
**`@qeetrix/tokens`**, rendering every component exactly as a Qeet product sees it.

The workshop renders the **published packages** that `bun.lock` installs, not a source
checkout: what you see here is what ships. Upgrading `@qeetrix/react` is a change to
`package.json` like any other, and CI proves every story still renders, passes its interaction
tests and passes axe on the new release.

```bash
bun install
bun run dev        # workshop on http://localhost:6006
bun run test       # every story as a test in headless Chromium, axe gate included
bun run build      # static build → storybook-static/
```

Each of those first runs `bun run docgen`, which reads the props and descriptions of every
component from `@qeetrix/react`'s type declarations into `.storybook/docgen.json` (generated,
not committed). That's what fills the props tables and controls: the published JavaScript
carries no types for Storybook's own docgen to read.

## Contents

- **Welcome:** the front page: what Qeetrix is, the install line, where to start.
- **Guides:** Getting started, and Theming (colour scheme, density, language, right to left,
  tenant brand).
- **Foundations:** Colour, Typography, Spacing, Elevation, Motion, Iconography and Brand.
  They're generated from the live `@qeetrix/tokens`, so they follow the Theme and Density
  toolbars.
- **Components:** an Overview of every component, then one page per `@qeetrix/react`
  component, stable (the root export) or experimental (`@qeetrix/react/experimental`, marked
  in the sidebar). Each page has the import line, the live example with every prop as a
  control, and a few focused examples.
- **Patterns:** Qeet ID console screens built only from the library: sign-in, account
  settings, the dashboard header, the users table toolbar, search.

Interaction tests and the Hindi checks are stories too. They're tagged `!dev` and `!autodocs`,
so they stay out of the sidebar and the docs pages, and still run in every `bun run test`.

The toolbar drives the same attributes a product sets:
- Theme → `data-qx-color-scheme` on `<html>`;
- Density (compact, default, comfortable) → `data-qx-density`;
- Language (English, हिन्दी) → `QeetrixProvider locale`, with the `hi` strings, and `<html lang>`;
- Direction → `<html dir>` and `QeetrixProvider`.

Icons in component demos come from `@qeetrix/icons`, one import per icon
(`import { PlusIcon } from "@qeetrix/icons/icons/plus"`).

## Release

The same flow as `qeetrix-react`, `qeetrix-icons` and `qeetrix-docs`:
1. Open a PR from `develop` into `main`. `version.yml` bumps the patch version on it.
2. Merge it. `release.yml` runs every CI gate, deploys the built workshop to Vercel production
   and tags `vX.Y.Z`.

`rollback.yml` redeploys an earlier tag; tags up to v0.0.11 still rebuild against the
`@qeetrix/ui` release they shipped with.

Deploying needs the `VERCEL_TOKEN` secret and the `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID`
variables. See the header of [`release.yml`](./.github/workflows/release.yml).

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to add a story, and [`docs/`](./docs) for the
architecture, testing, accessibility and governance notes.
