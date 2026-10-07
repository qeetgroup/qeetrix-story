# Architecture

How `qeetrix-story` fits into the Qeetrix stack, and where the boundary is.

## The boundary

**Storybook consumes Qeetrix. The design system does not live here.**

This repo (`@qeetrix/stories`, `private: true`, never published) contains documentation,
tests and governance for a component library that is developed and released somewhere
else. Nothing in `stories/**` defines a component; every story imports from
`@qeetrix/ui` and renders it the way a product app would.

| Concern | Lives in | Not in |
| --- | --- | --- |
| Component source, tokens, brand assets | `qeetrix-ui` | here |
| Stories, docs pages, guides | here | — |
| Component tests (Vitest browser) | here | — |
| Visual regression baselines | here (`tests/`) | — |
| Story contract + verification scripts | here (`stories/_contract.ts`, `scripts/`) | — |
| Unit tests for component internals | `qeetrix-ui` | here |

The practical rule: if a story reveals a bug, the fix goes in `qeetrix-ui`. This repo
only ever changes how the bug is demonstrated. `scripts/verify-a11y.mjs` says the same
thing in its output — *"These are @qeetrix/ui token values — do not patch them from this
repo."*

## The layers

```
  design tokens          W3C DTCG JSON  ──Style Dictionary──▶  --qx-* CSS custom properties
  (inside qeetrix-ui)                                          + tokens.json + typed constants
          │
          ▼
  @qeetrix/ui            React components (Base UI + Tailwind v4), brand, hooks
          │              published to npm as @qeetrix/ui (v2.x)
          ▼
  qeetrix-story          stories, docs, a11y gate, VRT, contract verification
```

There is **no separate `@qeetrix/tokens` package**. Tokens are a layer *inside*
`@qeetrix/ui`, surfaced through subpath exports:

| Specifier | Contents |
| --- | --- |
| `@qeetrix/ui` | component barrel, hooks, `cn`, typed token constants (`CHART_COLOR`, `Z_INDEX`, `SHADOW`, …) |
| `@qeetrix/ui/styles.css` | the full app layer — *semantic* tokens (`--background`, `--foreground`), fonts, base |
| `@qeetrix/ui/tokens.css` | the raw primitive ramp (`--qx-color-*`), which apps do not normally load |
| `@qeetrix/ui/qeetrix.css` | the semantic token layer on its own |
| `@qeetrix/ui/tokens.json` | the same values as data (used by `Foundations/Colors`) |
| `@qeetrix/ui/brand` | `QeetLogo` + brand icons |

`.storybook/styles.css` imports both `styles.css` and `tokens.css` — the second only so
the Foundations swatch galleries can resolve the primitive ramp, which a real app would
never pull in.

## `@qeetrix/ui` is resolved from a sibling checkout

This is the single most surprising thing about the repo.

`package.json` lists `"@qeetrix/ui": "^2.1.0"` as a dependency, and it *is* installed into
`node_modules`. **It is not what the workshop renders.** `.storybook/main.ts` rewrites
every `@qeetrix/ui` specifier to `../qeetrix-ui/src` — a sibling git checkout on disk:

```
QG/qeetrix/
├── qeetrix-ui/      ← the design system, resolved from src/
└── qeetrix-story/   ← this repo
```

**Without `../qeetrix-ui` checked out next to this repo, nothing works** — not `dev`, not
`build`, not `test`. `scripts/gen-llms.mjs` fails loudly with clone instructions; the Vite
aliases fail less loudly.

### The alias table (`.storybook/main.ts` → `viteFinal`)

Order matters: specific subpaths must precede the generic rule, which must precede the
bare specifier.

| Pattern | Resolves to | Why it needs its own rule |
| --- | --- | --- |
| `@qeetrix/ui/styles.css` | `src/styles/styles.css` | the full entry: core (`index.css`) plus the host-global `base.css`, which carries the reduced-motion collapse and the forced-colors remapping. `index.css` alone is the opt-out core entry |
| `@qeetrix/ui/tokens.css` | `src/styles/tokens.raw.css` | published export is renamed |
| `@qeetrix/ui/qeetrix.css` | `src/styles/tokens.css` | published export is renamed |
| `@qeetrix/ui/tokens.json` | `src/styles/tokens.json` | generated file, not in `dist` layout |
| `@qeetrix/ui/<anything>` | `src/<anything>` | the generic catch-all: `brand/`, `components/*`, `providers/*`, `lib/*`, `hooks/*`, `fonts/*` |
| `@qeetrix/ui` | `src/index.ts` | the barrel |
| `@/<anything>` | `src/<anything>` | `@qeetrix/ui`'s *own* internal path alias, which its source uses and this repo never does |
| `@qeetrix/icons` | `node_modules/@qeetrix/icons/dist/generated/icon-index.js` | not a sibling-checkout rule: the package's real root also re-exports ~7,400 brand logos, and Vite pre-bundles a dependency's whole root (~50 s and ~2.8 GB on a cold start). Stories still write the root import; only the bundler is pointed at the icons-only index. Temporary: needed only while pinned to `@qeetrix/icons` 1.0.10, since 2.0 drops the third-party logos |

Why source rather than `dist`: the workshop gets live HMR against the library, and never
depends on a `dist/` that a `tsc --watch` dev loop can leave holding unresolved `@/`
aliases.

### The react / react-dom dedupe is load-bearing

```ts
dedupe: [...(cfg.resolve?.dedupe ?? []), "react", "react-dom"]
```

Because the aliases pull `@qeetrix/ui` out of a sibling checkout, everything *it* imports
— React itself, and Base UI's hooks — resolves against `../qeetrix-ui/node_modules`. That
is a **second physical copy of React**, even though the version numbers match. Two copies
means two hook dispatchers, and the first hook call inside any Base UI component throws:

```
Cannot read properties of null (reading 'useRef')
```

The Vite dev server hides this, because pre-bundling collapses everything into one
optimized copy. **Vitest browser mode does not.** So the dedupe is what makes
`bun run test` work at all. It lives in `.storybook/main.ts` rather than
`vitest.config.ts` deliberately: `vitest.config.ts` reuses `main.ts` wholesale, so dev,
build and test all resolve identically from one definition.

### `server.fs.allow`

Setting `fs.allow` explicitly *replaces* Vite's automatic workspace-root discovery, so
`main.ts` re-adds both the Storybook project root and the `qeetrix-ui` sibling. Drop
either one and the dev server refuses to serve half the files it needs.

## Storybook composition

Storybook 10. Controls, actions, viewport and docs are core in SB10, so only four addons
are declared: `addon-docs`, `addon-a11y`, `addon-themes`, `addon-vitest`.

| File | Role |
| --- | --- |
| `.storybook/main.ts` | stories glob, addons, `viteFinal` (Tailwind plugin + the alias/dedupe/fs block above) |
| `.storybook/preview.ts` | assembles the decorators, declares the a11y gate and the parameters that belong to no single global |
| `.storybook/decorators/` | one module per toolbar global — each owns its `globalTypes` entry, its document-level side effect, and its decorator |
| `.storybook/manager.ts` | brands the Storybook chrome and keeps it in lockstep with the Theme toggle by polling the top-window URL |
| `.storybook/theme.ts` | the shared Qeetrix Storybook theme object (manager + autodocs) |
| `.storybook/styles.css` | Qeetrix layer import + `@source "../stories"` + the docs-canvas restyling |
| `.storybook/public/` | `staticDirs` root — where `llms.txt` / `llms-full.txt` are emitted |

### Toolbar globals

Each global is a module under `.storybook/decorators/`, owning its `globalTypes` entry,
its document-level side effect, and its decorator. `decorators/index.ts` assembles them;
`preview.ts` spreads the result.

| Global | Applied as | Module |
| --- | --- | --- |
| `theme` | `.dark` class on `<html>` — the same class strategy `ThemeProvider` uses in production, so stories look identical to apps | `theme.decorator.tsx` |
| `density` | `data-qx-density="comfortable" \| "compact"` on `<html>` (`legacy` removes the attribute) | `density.decorator.tsx` |
| `direction` | `<html dir>` **plus** `@qeetrix/ui`'s own `DirectionProvider` — `dir` is always written, never removed, so a component cannot inherit a stale `rtl` from a previous toolbar selection in the same iframe | `rtl.decorator.tsx` |
| `viewport` | nothing — **not a decorator**. Storybook 10 owns the tool, the global and the iframe resizing; the module only supplies `parameters.viewport.options`, replacing the 28 stock devices with four canonical Qeetrix breakpoints (390 / 768 / 1440 / 1920) | `viewport.decorator.tsx` |

The document-level globals are applied **twice over**: from a decorator (first paint of a
story) *and* straight off the preview channel (`setGlobals`, `globalsUpdated`). The
decorator alone only fires when a *story* renders, which leaves pure-MDX pages —
`Foundations/Introduction` has live components but no story exports — stuck on whatever
theme loaded first. The channel alone would cost an event round-trip, so a story would
paint one frame in the previous theme. Both are needed. `withDirection` additionally
supplies a React context that no DOM attribute can.

These are **affordances, not coverage**. There is a Direction toolbar and a viewport
preset list; nothing runs the suite in RTL or at a non-default width.

## Story layout

| Path | Contents | Contract applies |
| --- | --- | --- |
| `stories/components/<category>/*.stories.tsx` | one file per `@qeetrix/ui` component | **yes** — full contract |
| `stories/foundations/*.stories.tsx` | Colors, Typography, Spacing & Radius, Density, Token Layers, Elevation, Motion | title only |
| `stories/brand/brand.stories.tsx` | adaptive `QeetLogo` | title only |
| `stories/patterns/*.stories.tsx` | multi-component patterns (e.g. `Patterns/AuthenticationForm`) | not scanned — see [governance.md](./governance.md) |
| `stories/recipes/*.stories.tsx` | cross-cutting recipes (loading states, empty states) | not scanned — see [governance.md](./governance.md) |
| `stories/guides/*.mdx` | narrative guides (5) | n/a |
| `stories/_contract.ts` | the story contract types + `qx()` helper | n/a |
| `stories/_helpers.tsx` | shared swatch/copy helpers for the galleries | n/a |

Files prefixed `_` are not matched by the stories glob (`*.mdx`, `*.stories.@(ts|tsx)`).

## Build outputs

| Command | Output |
| --- | --- |
| `bun run llms` | `.storybook/public/llms.txt`, `llms-full.txt` (llmstxt.org convention) |
| `bun run build` | `llms` step, then `storybook-static/` |
| `bun run shoot` | `screenshots/` (ad-hoc capture, not the VRT layer) |

`bun run build` is `node scripts/gen-llms.mjs && storybook build`, so the llms step gates
the whole build. That step reads the **sibling checkout**, not `node_modules` — the
published `@qeetrix/ui` tarball ships `dist/` only (no `src/`, no `tokens.json`), so
reading `node_modules` cannot work. If `bun run build` fails at `gen-llms`, a missing or
misplaced `../qeetrix-ui` checkout is the reason.

## Known repo state

Documented so nobody burns an afternoon rediscovering it.

| Thing | State |
| --- | --- |
| `bun run lint` | fails — all pre-existing, all in `.storybook/styles.css` (`noImportantStyles`, `noDescendingSpecificity`) plus a Biome CSS parse error on Tailwind's `@source` directive — 2 errors + 24 warnings |
| `bun run typecheck` · `build` · `verify:stories` · `verify:foundations` · `test` | pass |
| CI | `.github/workflows/ci.yml` — checks out **both repos side by side**, builds `@qeetrix/ui`'s generated tokens, then runs lint · typecheck · verify:stories · test · build. `lint` is expected red (see above) and is deliberately **not** `continue-on-error`; every gate runs even after an earlier failure so one run reports the whole picture. VRT is not in CI. |
| RTL / dark-mode / responsive test matrices | **do not exist.** There is now a Direction toolbar global, a `DirectionProvider` decorator and four viewport presets — those are affordances for a human clicking around, not automated coverage. Nothing runs the suite in RTL, in dark mode, or at a non-default width. |
