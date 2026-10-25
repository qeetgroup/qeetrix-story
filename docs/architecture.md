# Architecture

How `qeetrix-story` fits into the Qeetrix stack, and where the boundary is.

## The boundary

**Storybook consumes Qeetrix. The design system does not live here.**

This repo (`@qeetrix/stories`, `private: true`, never published) contains documentation,
tests and governance for a component library that is developed and released somewhere
else. Nothing in `stories/**` defines a component; every story imports from
`@qeetrix/react` and renders it the way a product app would.

| Concern | Lives in | Not in |
| --- | --- | --- |
| Component source, styles, strings | `qeetrix-react` (`@qeetrix/react`) | here |
| Design tokens, fonts | `qeetrix-tokens` (`@qeetrix/tokens`) | here |
| Icons, the Qeet logo | `qeetrix-icons` (`@qeetrix/icons`) | here |
| Stories, docs pages, guides | here | — |
| Component tests (Vitest browser, every story) | here | — |
| Story contract + verification scripts | here (`stories/_contract.ts`, `scripts/`) | — |
| Unit, accessibility and visual tests for component internals | `qeetrix-react` | here |

The practical rule: if a story reveals a bug, the fix goes in `qeetrix-react` (or
`qeetrix-tokens`). This repo only ever changes how the bug is demonstrated.

## The layers

```
  @qeetrix/tokens        W3C DTCG source ──▶ --qx-* CSS custom properties (tokens.css),
                         the Qeet Sans and Fira Code faces, JS values, DTCG JSON
          │
          ▼
  @qeetrix/react         React 19 components on Base UI, styled by a precompiled
                         stylesheet (styles.css) that reads only the tokens;
                         stable at the root, newer parts at @qeetrix/react/experimental
          │
          ▼
  qeetrix-story          stories, docs, a11y gate, contract verification
```

| Specifier | Contents |
| --- | --- |
| `@qeetrix/tokens/tokens.css` | every runtime token: `:root` (light), `[data-qx-color-scheme="dark"]`, `[data-qx-density="compact" \| "default" \| "comfortable"]`, plus the font faces |
| `@qeetrix/tokens` (JS) and `@qeetrix/tokens/dtcg/*` | the same values as data, read by the Foundations pages |
| `@qeetrix/react/styles.css` | the component stylesheet, in the `qx.base` and `qx.components` cascade layers |
| `@qeetrix/react` | the stable components, `QeetrixProvider`, the formatters |
| `@qeetrix/react/experimental` | components in their first product |
| `@qeetrix/react/locales/hi` | the Hindi strings |

`.storybook/styles.css` loads them as the `@qeetrix/react` README tells a product to: the
tokens, then `styles.css` in the `components` layer. Tailwind is loaded too, for the
workshop's chrome only, and **without its preflight reset**: a global reset would hide what a
product without Tailwind sees. The chrome's theme names (`border-border`,
`text-muted-foreground`, …) are mapped to the tokens there.

## The workshop renders the published packages

`package.json` pins `@qeetrix/react`, and `bun.lock` installs it from npm. **That installed
package is what the workshop renders**, in `dev`, `build` and `test` alike. There are no source
aliases and no sibling checkout, so:
- what you see is exactly what a Qeet product installs;
- upgrading the library is a normal `package.json` change, and CI proves every story still
  renders on the new release;
- `tsc` and the workshop always read the same API.

The cost: an unreleased component change isn't visible here until it's released (or a local
build is linked into `node_modules` for a moment).

### Props tables come from the type declarations

Storybook's own docgen reads the source files it compiles. A dependency's published
JavaScript carries no types, so it would find no props. `scripts/docgen.mjs` reads
`@qeetrix/react`'s `.d.ts` files (root and `experimental`) with the TypeScript compiler. It
writes, per exported component:
- its description, from the component's JSDoc;
- the family folder it lives in, for the docs page's source link;
- its props as Storybook argTypes: description, type, default (from "Default `x`" in the
  JSDoc), required, and a control.

The props come in two groups. First the component's own; then those it takes straight from
the Base UI part it wraps (Dialog's `open`, Meter's `value`), under "Base UI". Inherited DOM
attributes and plumbing (`className`, `style`, `ref`) are left out, as every enterprise props
table does.

`.storybook/preview.ts` hands these to autodocs through `parameters.docs.extractArgTypes`
and `extractComponentDescription`. The output, `.storybook/docgen.json`, is generated and
not committed; `dev`, `storybook`, `build`, `test` and `typecheck` all run `docgen` first.

### Component names

The published build renames a component's function where it shares a name with the Base UI
part it wraps (`Button$1` for `Button`, about twenty of them), and React reads that name for
code snippets and DevTools. `preview.ts` gives every exported component its public name as
its `displayName`, so "Show code" says `<Button>` and the props lookup finds it. The real fix
belongs in qeetrix-react.

### Vite: one React, and the design system pre-bundled

`main.ts` dedupes `react` and `react-dom`, so the stories, Base UI and `@qeetrix/react` share
one React. It also pre-bundles `@qeetrix/react`, its `experimental` and `locales/hi` entries,
`@qeetrix/tokens` and every `@qeetrix/icons/icons/*` module. Discovered mid-run instead, Vite
would reload the page and fail the first Vitest run after a new import. Both live in `main.ts`,
not `vitest.config.ts`, because `vitest.config.ts` reuses `main.ts` wholesale: dev, build and
test resolve identically from one definition.

## Storybook composition

Storybook 10. Controls, actions, viewport and docs are core in SB10, so only four addons
are declared: `addon-docs`, `addon-a11y`, `addon-themes`, `addon-vitest`.

| File | Role |
| --- | --- |
| `.storybook/main.ts` | stories glob, addons, `staticDirs` (the tokens package's fonts at `/fonts`, for the chrome), `viteFinal` (Tailwind plugin, pre-bundling, dedupe) |
| `.storybook/preview.ts` | the decorators, the a11y gate, the docs page and container, the docgen props tables, the component names, the sidebar order, the table of contents |
| `.storybook/blocks/component-docs.tsx` | the docs page of every component (below) |
| `.storybook/blocks/docs-container.tsx` | switches the docs pages between the light and dark docs themes with the Theme toolbar |
| `.storybook/decorators/` | one module per toolbar global — each owns its `globalTypes` entry, its document-level side effect, and its decorator |
| `.storybook/manager.ts` | brands the Storybook chrome, renders the sidebar's Experimental pills, and keeps the chrome in lockstep with the Theme toggle |
| `.storybook/theme.ts` | the light and dark Storybook themes (chrome + docs), in the tokens' values converted to hex |
| `.storybook/manager-head.html` | the chrome's fonts (Qeet Sans, Fira Code), its dark restyling and the status pill |
| `.storybook/styles.css` | the package imports, the chrome's theme-name mapping, and the docs canvas in the design language (ruled sections, square corners, the library's own code colours) |
| `.storybook/public/` | `staticDirs` root: the Qeet logos |

### The component docs page

Every component's docs page has the same layout (`parameters.docs.page`), the one enterprise
design systems share. Everything on it comes from the story's meta and the package's types,
so it can't drift from the API. In order:
1. the category, the name, and a status badge (Stable or Experimental, from the story
   contract) with the package and version;
2. the description, from the component's JSDoc;
3. its import line, with a copy button;
4. a playground, with every prop as a control;
5. the examples, each story with its description;
6. accessibility notes, and links to the source, npm and the changelog.

An "On this page" table of contents follows the reader. Galleries (foundations, patterns,
recipes) get a plain page: title, description, stories.

### Toolbar globals

Each global is a module under `.storybook/decorators/`. `decorators/index.ts` assembles them;
`preview.ts` spreads the result.

| Global | Applied as | Module |
| --- | --- | --- |
| `theme` | `data-qx-color-scheme="light" \| "dark"` (and `color-scheme`) on `<html>`: the attribute `QeetrixProvider` sets in production and the tokens scope their colours to | `theme.decorator.tsx` |
| `density` | `data-qx-density="compact" \| "default" \| "comfortable"` on `<html>`, always written | `density.decorator.tsx` |
| `locale` | `QeetrixProvider locale`, with the `hi` pack for Hindi, and `<html lang>`: the components' own strings and number and date formats | `locale.decorator.tsx` |
| `direction` | `<html dir>` **plus** `QeetrixProvider direction`, which components read for arrow keys, submenus, sliders and drawers | `rtl.decorator.tsx` |
| `viewport` | nothing — **not a decorator**. Storybook 10 owns the tool; the module only supplies one device per `@qeetrix/react` window size class (390 / 768 / 1024 / 1440 / 1920) | `viewport.decorator.tsx` |

The document-level globals are applied **twice over**: from a decorator (first paint of a
story) *and* straight off the preview channel (`setGlobals`, `globalsUpdated`). The decorator
alone only fires when a *story* renders, which leaves pure-MDX pages stuck on whatever theme
loaded first. The channel alone would cost an event round-trip, so a story would paint one
frame in the previous theme. Both are needed.

These are **affordances, not coverage**. Nothing runs the whole suite in RTL, Hindi, dark
mode or at a non-default width; qeetrix-react's own tests cover those matrices for the
components.

## Story layout

| Path | Contents | Contract applies |
| --- | --- | --- |
| `stories/welcome.mdx` + `_welcome.tsx` | the front page | n/a |
| `stories/components/<category>/*.stories.tsx` | one file per `@qeetrix/react` component | **yes** — full contract |
| `stories/foundations/*` | the token galleries, generated from `@qeetrix/tokens` | title only |
| `stories/brand/brand.stories.tsx` | the Qeet logo, brand colour and tenant theming | title only |
| `stories/patterns/*.stories.tsx` | Qeet ID console screens built from the library | title only |
| `stories/recipes/*.stories.tsx` | cross-cutting states (loading, empty, error, offline) | title only |
| `stories/playground/*` | the catalogue of every component, built from the package's exports | title only |
| `stories/guides/*.mdx` | narrative guides | n/a |
| `stories/_contract.ts` | the story contract types + `qx()` helper | n/a |
| `stories/_helpers.tsx` | shared swatch and layout helpers for the galleries | n/a |

Files prefixed `_` are not matched by the stories glob (`*.mdx`, `*.stories.@(ts|tsx)`).

## Build outputs

| Command | Output |
| --- | --- |
| `bun run docgen` | `.storybook/docgen.json` (generated, not committed) |
| `bun run build` | `docgen`, then `storybook-static/` |
| `bun run shoot` | `screenshots/` (ad-hoc capture from `storybook-static`) |

## Known repo state

Documented so nobody burns an afternoon rediscovering it.

| Thing | State |
| --- | --- |
| CI and release | `ci.yml`, `version.yml`, `release.yml`, `rollback.yml` — the same four as `qeetrix-react`, `qeetrix-icons` and `qeetrix-docs`; see [testing.md](./testing.md#in-ci). They build from this repository alone. `rollback.yml` still checks out `qeetrix-ui` for tags up to v0.0.11, which rendered `@qeetrix/ui`. |
| `bun run lint` | passes, with warnings for the `!important`s in `.storybook/styles.css` that override Storybook's own docs styling; warnings don't fail it |
| MDX tables | the docs addon has no GFM plugin, so markdown tables in MDX don't render; the guides use lists |
