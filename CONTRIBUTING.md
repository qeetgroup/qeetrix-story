# Contributing to qeetrix-story

This is the Storybook workshop for the Qeetrix design system. It **documents and tests**
`@qeetrix/ui`; it does not contain it.

> **If your change is to a component's behaviour or styling, it belongs in `qeetrix-ui`,
> not here.** This repo only changes how that component is demonstrated and verified.

Deeper background: [`docs/architecture.md`](./docs/architecture.md) ·
[`docs/testing.md`](./docs/testing.md) ·
[`docs/accessibility.md`](./docs/accessibility.md) ·
[`docs/governance.md`](./docs/governance.md)

---

## Setup

**`@qeetrix/ui` is resolved from a sibling checkout, not from `node_modules`.** Nothing
works without it.

```
QG/qeetrix/
├── qeetrix-ui/      ← `bun run setup:ui` clones it if it is missing
└── qeetrix-story/   ← you are here
```

```bash
bun install          # bun, not pnpm or npm — bun >= 1.3, node >= 20
bun run setup:ui     # ../qeetrix-ui: cloned at the release bun.lock installs if missing, then tokens built
bun run dev          # workshop on http://localhost:6006
```

## Local commands

Only these exist. Do not assume a script that isn't in `package.json`.

| Command | Does |
| --- | --- |
| `bun run setup:ui` | clones `../qeetrix-ui` at the release `bun.lock` installs if it is missing, installs it, builds its generated tokens |
| `bun run dev` | dev server on :6006, no auto-open |
| `bun run storybook` | dev server on :6006, opens a browser |
| `bun run build` | `gen-llms` + `storybook build` → `storybook-static/` |
| `bun run llms` | regenerate `llms.txt` / `llms-full.txt` only |
| `bun run test` | component tests — every story, headless Chromium, includes the axe gate |
| `bun run test:watch` | watch mode, with links back into the running workshop |
| `bun run test:coverage` | v8 coverage over the `@qeetrix/ui` source the stories exercise |
| `bun run verify:stories` | story-contract validation + measured coverage report |
| `bun run verify:a11y` | colour-contrast report (never fails; needs `storybook-static`) |
| `bun run verify:foundations` | computed foundation invariants (needs `storybook-static`) |
| `bun run lint` | Biome check |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run shoot` | ad-hoc screenshot capture into `screenshots/` |
| `bun run clean` | remove build + test artefacts |

Every command above passes. `lint` also prints 24 warnings — `!important` and selector order
in `.storybook/styles.css`, which restyles Storybook's own chrome — and warnings do not fail it.

**CI** runs lint · typecheck · `verify:stories` · `test` · `build` on every PR and on push to
`main`, and a merge to `main` deploys — [`docs/testing.md`](./docs/testing.md#in-ci) describes
all four workflows. Each checks out the `qeetrix-ui` release that `bun.lock` installs alongside
this repo and builds its generated tokens first. Every gate runs even when an earlier one
fails, so one CI run reports the state of all of them.

---

## Adding a component story

Copy **`stories/components/actions/button.stories.tsx`**. It is the reference template: its
`argTypes` block doubles as a usage cheat-sheet, and its `ClickInteraction` export is the
reference interaction test.

One file per component: `stories/components/<category>/<kebab-case-name>.stories.tsx`.

`stories/patterns/` (multi-component patterns) and `stories/recipes/` (cross-cutting
recipes) also exist. Note that **`verify:stories` does not scan them yet** — declare
`qx({ category, status })` there anyway so nothing has to be retrofitted when it does.

### Required metadata

`bun run verify:stories` fails the run without all of these:

```tsx
import { Widget } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../_contract";

const meta: Meta<typeof Widget> = {
  title: "Components/Widget",          // required — no spaces after the slash
  component: Widget,                   // required*
  parameters: {
    qeetrix: qx({ category: "…", status: "…" }),   // required
    layout: "centered",
    docs: { description: { component: "…" } },     // required* (see below)
  },
  tags: ["autodocs"],                  // required
};
export default meta;
type Story = StoryObj<typeof Widget>;
```

| Field | Rule |
| --- | --- |
| `title` | `Components/<Name>`. **No spaces** in the name segment — it warns, and it makes the story id ugly |
| `component` | required *unless* the story is composite (documents several exports, e.g. Chart, Sidebar) — in that case a `docs.description.component` string is required instead |
| `parameters.qeetrix` | `qx({ category, status })`. Vocabularies in [`stories/_contract.ts`](./stories/_contract.ts) — see [`docs/governance.md`](./docs/governance.md) |
| `tags` | must include `"autodocs"` |

Wrapping in `qx()` is what makes TypeScript check the block — `parameters` is typed
`any`, so a bare object literal would let `catgory: "actions"` compile.

Do **not** add fields the contract doesn't define (`rtl`, `darkMode`, `accessibility`,
`visualCriticality`, …). If you need one, add it to `_contract.ts` first so there is one
convention rather than two.

### Required states

Every component story should show the states a consumer has to make a decision about.
Prefer named exports over control-only variation — a state that only exists behind a
control is not in the docs and not in the test suite.

| State | When |
| --- | --- |
| `Default` | always — the shape a consumer should reach for first |
| `Variants` | the component has a `variant` prop |
| `Sizes` | the component has a `size` prop |
| `Disabled` | the component can be disabled |
| `Loading` | the component has an async/pending state |
| `Empty` | the component can render with no data |
| Error / invalid | the component has a validation or error state |
| `Interaction: …` | the component has behaviour — see below |

Give each story a `docs.description.story` when the *reason* it exists isn't obvious from
its name. `dialog.stories.tsx` is a good example of description-per-story.

### Interaction tests

Required for anything in `actions`, `overlays`, `navigation` or `data-entry` — those are
the categories `verify:stories` measures coverage against.

```tsx
export const ClickInteraction: Story = {
  name: "Interaction: click focuses",
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole("button", { name: "Continue" });
    await userEvent.click(button);
    await expect(button).toHaveFocus();
  },
};
```

- Import `expect` / `screen` / `waitFor` from **`storybook/test`**, never
  `@testing-library/*`.
- Take `canvas` and `userEvent` from the play context; don't import them.
- Query by **accessible role and name**, not test ids.
- **Overlay content is portalled to `document.body` and is not in `canvas` — use
  `screen`.** In-canvas content uses `canvas`. Getting this wrong is the most common
  cause of a failing interaction test. `dialog.stories.tsx` is the reference: trigger via
  `canvas`, dialog via `screen`.
- Overlays animate in from `opacity: 0` — poll with `waitFor` rather than asserting on
  the first frame.
- Assert what breaks silently. For overlays that is **dismissal** (Escape closes it), not
  opening. Poll for absence — `await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())`
  — rather than `waitForElementToBeRemoved`, which throws if the overlay is already gone by
  the time it runs, and `@qeetrix/ui` 2.1 overlays can close within the same frame.

The `play` function runs in both the Interactions panel and as a real Vitest case under
`bun run test` — one definition, two consumers.

### Accessibility requirements

The axe gate is set to **`test: "error"`** in `.storybook/preview.ts`. **Any axe violation
fails `bun run test`.** A new story that trips axe does not merge.

- Every image/icon needs a text alternative, or `aria-hidden` if decorative.
- Icon-only controls need an accessible name (`aria-label`).
- Every form control needs an associated `<label>` / `FieldLabel`.
- If you can't reach it with Tab, it isn't done.
- Two rules are excluded from the gate — `region` and `color-contrast`. Read
  [`docs/accessibility.md`](./docs/accessibility.md) before assuming a contrast problem is
  yours to fix; the current ones are `@qeetrix/ui` token decisions and cannot be fixed
  from this repo.
- axe is a floor, not a grade. It catches a minority of WCAG failures. A clean run does
  not mean the component is accessible.

---

## PR checklist

- [ ] The change belongs in this repo, not in `qeetrix-ui`.
- [ ] `bun run verify:stories` passes (no new contract errors, no new title warnings).
- [ ] `bun run test` passes for the stories you touched — including the axe gate.
- [ ] New component stories declare `qx({ category, status })`, `tags: ["autodocs"]`, and
      a `component` or a prose `docs.description.component`.
- [ ] Required states are covered as named exports, not control-only variation.
- [ ] Interactive components (`actions` / `overlays` / `navigation` / `data-entry`) have a
      `play` interaction test, using `screen` for portalled content.
- [ ] Icon-only controls have accessible names; form controls have labels.
- [ ] `bun run lint` and `bun run typecheck` pass.
- [ ] No new fields invented on `parameters.qeetrix` — extend `stories/_contract.ts` first.
- [ ] Story `title` / export names unchanged, or the id change is intentional (ids are an
      interface — grep filters, bookmarked URLs).

## Conventions

- **Bun**, not pnpm or npm.
- Biome for formatting and linting: 2-space indent, 100-column lines, double quotes,
  semicolons, trailing commas. Imports are auto-organised.
- Files prefixed `_` (`_contract.ts`, `_helpers.tsx`, `_intro.tsx`) are not matched by the
  stories glob — that is how shared helpers stay out of the sidebar.
- **Icons come from `@qeetrix/icons`**, imported from the package root with their `…Icon`
  names: `import { PlusIcon, TrashIcon } from "@qeetrix/icons";` — not deep
  `@qeetrix/icons/icons/<id>` paths, not another icon set. Icons appear here only inside
  component demos; the icon catalogue itself is documented in the `qeetrix-icons` repo, not
  in this workshop.
- Comments in this repo explain *why*, not *what*. The existing config files are unusually
  well commented on purpose; match that bar when you change one.
