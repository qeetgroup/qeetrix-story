# Governance — the story contract

147 component story files is past the point where a human can answer "which components
are still experimental?" by reading them. The **story contract** makes that question
answerable by tooling.

Source of truth: `stories/_contract.ts`. Validator: `scripts/verify-stories.mjs`
(`bun run verify:stories`).

## The contract

Every file in `stories/components/<category>/` declares this block on its meta:

```tsx
import { qx } from "../_contract";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    qeetrix: qx({ category: "actions", status: "stable" }),
  },
  tags: ["autodocs"],
};
```

### Why `qx()` and not a type annotation

Storybook types `parameters` as `{ [name: string]: any }`. Annotating it buys **no**
checking — a typo like `catgory` compiles fine. Passing the object through the identity
function `qx()` is what makes TypeScript check the contract at the point of authorship.
That is the helper's entire purpose.

## Vocabularies

Both are TypeScript string unions in `_contract.ts`. `verify-stories.mjs` parses the
unions out of the AST rather than duplicating them, so the validator cannot drift from the
type and start accepting values the compiler rejects.

### `QeetrixCategory` (12)

Mirrors the target sidebar taxonomy, so these values can later drive folder structure
rather than being re-derived.

| Category | For | Current count |
| --- | --- | --- |
| `actions` | buttons, toolbars, action bars | 10 |
| `forms` | form-level composition | 4 |
| `data-entry` | controls that **take** user input | 37 |
| `data-display` | components that **present** values back | 24 |
| `navigation` | breadcrumbs, sidebar, stepper, links | 10 |
| `feedback` | alerts, toasts, progress, skeletons | 13 |
| `overlays` | dialogs, popovers, menus, tooltips, drawers | 13 |
| `layout` | containers, grids, separators | 12 |
| `typography` | text primitives | 5 |
| `media` | images, avatars, icons | 6 |
| `advanced` | composed, application-level components (rich text editors, schedulers, org charts) that are not primitives in any real sense | 9 |
| `utilities` | non-visual helpers and providers | 4 |

`advanced` exists so the other buckets stay meaningful. Without it, a scheduler ends up
labelled `data-display` and that label stops telling you anything.

### `QeetrixStatus` (5)

```
experimental → beta → stable → deprecated → (removed)
```

`internal` sits outside that flow: shipped and supported, but not part of the public API
contract — consumers should not reach for it directly.

**All 147 components are currently `stable`.** That is a fact about the declaration, not
an independent judgement; the vocabulary exists so it can stop being true.

## What `verify:stories` enforces vs reports

It parses each story file with **Storybook's own CSF tooling** — no build, no browser,
runs in milliseconds. Regex is not an option: several story files contain fixture data
with its own `title:` / `parameters:` keys that a naive match picks up instead of the real
meta.

Output has three tiers, deliberately.

### ERRORS — fail the run (exit 1)

Applied to `stories/components/<category>/*.stories.tsx`:

| Check | Message |
| --- | --- |
| meta has a `title` | `meta is missing a title` |
| meta has `tags: ["autodocs"]` | `meta is missing the autodocs tag` |
| documented — either a meta `component` (gives autodocs a props table) **or** a `docs.description.component` string | `undocumented — needs a meta component or a docs description` |
| `parameters.qeetrix` block exists | `no parameters.qeetrix contract — add qx({ category, status })` |
| `category` present and in the vocabulary | `contract is missing "category"` / `unknown category "…"` |
| `status` present and in the vocabulary | `contract is missing "status"` / `unknown status "…"` |

Applied to `stories/*.stories.tsx`, `stories/brand/`, `stories/foundations/` — galleries
with no single component, so **only a title is required**.

> **Gap:** `stories/patterns/` and `stories/recipes/` are newer than the validator and are
> **not scanned at all** — not for the contract, not even for a title. Some of those files
> declare `qx({ … })` voluntarily; nothing checks that they do. Extend the directory list
> in `verify-stories.mjs` when deciding which tier those trees belong to.

The either/or on documentation matters: composite stories legitimately have no single
`component` (Chart documents ChartContainer/ChartTooltip; Sidebar documents
SidebarProvider/SidebarGroup/…), so there is no props table to generate. Those carry a
written description instead, and that is what makes them documented. 144 of 147 have a
props table; 3 are composite.

### WARNINGS — printed, never fail

| Check | Why it is only a warning |
| --- | --- |
| title segment contains a space (`Components/Radio Group`) | fixing it changes the story id, which breaks bookmarks and VRT baselines — a call to make deliberately, not a side effect of a metadata check |

Currently 2: `radio-group.stories.tsx`, `scroll-area.stories.tsx`.

### REPORT — measured coverage, never fails

Counts per category, counts per status, total stories, and interaction-test coverage.

Interaction coverage is computed **only against categories that have behaviour** —
`actions`, `overlays`, `navigation`, `data-entry`. A `Separator` or a `Skeleton` has
nothing to assert, so counting it in the denominator produces a number that can never
reach 100% and therefore never means anything.

Snapshot at time of writing (run the command for live figures):

```
147 components, 7 doc pages, 425 stories
interaction tests   22/70 interactive components (31%)

  actions       5/10   50%
  overlays      6/13   46%
  navigation    4/10   40%
  data-entry    7/37   19%
```

The report also names the *uncovered* components per category, so "what should I write
next?" has a printed answer.

## The declared-vs-measured rule

**The contract holds only what a human decides. It never holds what a tool can measure.**

| Kind | Example | Where it lives |
| --- | --- | --- |
| Decided | which category a component belongs to; whether it is beta or stable | declared in `qx({ … })` |
| Measured | whether a story has an interaction test; whether it passes axe; whether it has a visual baseline | derived at verify time |

This is the rule that keeps the contract honest. A declared `hasInteractionTest: true`
becomes a lie the moment someone deletes the `play` function, and nothing catches it.
A *measured* number cannot go stale — it is recomputed on every run from the file it
describes. Concretely, `verify-stories.mjs` detects interaction tests by looking for the
`play-fn` tag Storybook's CSF tooling attaches to stories that have a `play` function.

If you find yourself wanting to add a boolean to `qx()`, check first whether a script
could just look. If it could, write the script instead.

## Extending the contract

Fields are added **by the item that makes them true**, never speculatively. These are
reserved and deliberately absent until something verifies them:

| Field | Blocked on |
| --- | --- |
| `rtl`, `darkMode`, `responsive` | those test **matrices** existing. A Direction toolbar global and viewport presets now exist; a matrix that runs stories in RTL or at a given width does not, so there is still nothing for a declared flag to mean |
| `accessibility` | an audited grade, e.g. `"AA"`. **Not** "axe passes" — axe catches a minority of WCAG failures, so a clean run is not a grade |
| `visualCriticality` | `"critical" \| "standard" \| "low"`, added by the VRT tiering work, which will use it to decide snapshot coverage |
| `since` / `deprecatedSince` | per-component release metadata |

If you need one before its item lands, **add it to `_contract.ts` first** so there is one
contract rather than two competing conventions.

## Related verification

| Script | Command | Gate? | State |
| --- | --- | --- | --- |
| `verify-stories.mjs` | `bun run verify:stories` | **yes** (exit 1 on contract violation) | passing; runs in CI |
| `verify-a11y.mjs` | `bun run verify:a11y` | no — reports only, by design | reports violations, see [accessibility.md](./accessibility.md) |
| `verify-foundations.mjs` | `bun run verify:foundations` | **yes** (Node `assert`, throws) | **currently failing** — asserts a `comfortable` Button renders at 36px, which it no longer does, and also references a `Blocks/DashboardShell` story that is not in the current index |

`verify-foundations.mjs` is a different kind of check from the other two: it boots
`storybook-static` in Playwright and asserts *computed* foundation invariants — density
variables and real geometry, mobile `Container` gutters and reflow, the dark surface
hierarchy in OKLCH, the 8 distinct chart series colours, `--qx-z-*` stacking values, and
forced-colors semantics with keyboard focus. It is the only place those cross-cutting
guarantees are tested at all.

## Story ids are an interface

Story ids are derived from `title` + export name, and three separate systems consume
them: VRT baseline filenames (`tests/vrt.spec.ts-snapshots/<id>-<theme>.png`), the
`A11Y_GREP` / `VRT_GREP` scoping filters, and any bookmarked or linked docs URL. Renaming
a title or an export is an interface change, not a cosmetic one.
