# qeetrix-story

Storybook 10 workshop for the Qeetrix design system (`@qeetrix/stories`, private — not
published). It documents and tests the **`@qeetrix/ui` component library**, rendering every
component exactly as a consumer sees it, with light/dark driven by the `.dark` class strategy.

`@qeetrix/ui` is resolved from a sibling checkout's `src/`, not from `node_modules`, so clone
both side by side:

```
QG/qeetrix/
├── qeetrix-ui/      ← the design system (currently 2.1.0)
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
- **Components** — one story file per `@qeetrix/ui` component (147), grouped as actions,
  advanced, data display, data entry, feedback, forms, layout, media, navigation, overlays,
  typography and utilities.
- **Patterns** and **Recipes** — multi-component compositions (authentication, search,
  notification centre, …) and cross-cutting states (empty, error, loading, offline).
- **Guides** — getting started, design tokens, theming, foundation modes and accessibility.
- **Brand** — the adaptive `QeetLogo` and the brand icons shipped in `@qeetrix/ui/brand`.
- **Playground** — configure a component and copy the generated JSX.

Icons inside component demos come from `@qeetrix/icons`, imported from the package root
(`import { TrashIcon } from "@qeetrix/icons"`). The icon catalogue itself is not part of this
workshop — it is documented in the `qeetrix-icons` repo.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to add a story, and [`docs/`](./docs) for the
architecture, testing, accessibility and governance notes.
