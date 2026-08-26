# Accessibility

Accessibility in this repo is a **gate**, not a report. It is also honest about what it
does not yet cover.

## The gate

`.storybook/preview.ts`:

```ts
a11y: {
  test: "error",
  options: { rules: { region: { enabled: false }, "color-contrast": { enabled: false } } },
}
```

`test: "error"` means `@storybook/addon-a11y` runs **axe over every story** as part of
`bun run test`, and **any violation fails the run**. There is no separate a11y command to
remember and no separate suite to keep in sync — the a11y check rides on the component
test layer described in [testing.md](./testing.md), so every story is an a11y test for the
same reason every story is a render test.

The three values `test` can take, for orientation:

| Value | Behaviour |
| --- | --- |
| `"off"` | axe does not run in the test layer |
| `"todo"` | violations are reported, not failed |
| `"error"` | **current setting** — violations fail `bun run test` |

The setting moved from `"todo"` to `"error"` once the existing violation set had been
triaged. Some documentation in the repo still describes the `"todo"` behaviour; `preview.ts`
is authoritative.

## What is excluded, and why

Two axe rules are disabled. Both exclusions are narrow and both are justified — neither is
"this was noisy so we turned it off".

### `region` — a false positive by construction

axe's `region` rule requires every piece of page content to sit inside a landmark
(`<main>`, `<nav>`, …). A story renders **a single component into `#storybook-root`** —
not a full document. Landmark structure is the app shell's responsibility, not a
primitive's. Left enabled, it flags roughly 85 violations across nearly every story and
drowns out the real ones.

This one is genuinely not applicable here, and there is nothing to fix.

### `color-contrast` — excluded from the gate, *not* resolved

This is the one to understand properly.

The violations are not distributed across the library — they are **a handful of semantic
token pairs, repeated everywhere those tokens are used.** The ten worst pairs account for
the large majority of the total:

| × | Ratio | Foreground on background | Reading |
| --- | --- | --- | --- |
| 42 | 4.34:1 | `#737373` on `#f5f5f5` | `muted-foreground` on `muted` — near-miss |
| 20 | 4.37:1 | `#bb4d00` on `#f8ede6` | warning text on warning surface — near-miss |
| 18 | **2.88:1** | `#ff6900` on `#ffffff` | brand orange on white — a real failure for body text |
| 15 | 3.98:1 | `#e7000b` on `#fde5e7` | `destructive` on `bg-destructive/10` |
| 15 | 4.25:1 | `#737373` on `#fff0e6` | muted text on a tinted surface |
| 10 | **1.15:1** | `#ffffff` on `#e5f0f6` | white text on a light info surface — a real failure |

So the shorthand "they are all near-misses" — which an inline comment in `preview.ts` still
repeats — is **not accurate**. Most are (3.98–4.47 against a 4.5 threshold), but there is a
tail of genuine failures: brand orange on white at 2.88:1, and white-on-tinted-surface pairs
around 1.15:1.

What *is* true, and is the reason for the exclusion, is that these are **token decisions in
`@qeetrix/ui`**, not N independent story bugs. Six pairs cause over 70% of the count. They
cannot be fixed from this repo — patching a story's classes to dodge the rule would hide
the token problem rather than solve it, and would make the stories stop reflecting what
real apps render.

Excluding it from the gate must not make it invisible. So it is **reported separately**.

## `bun run verify:a11y` — the contrast report

`scripts/verify-a11y.mjs` runs axe with **only** `color-contrast` enabled, scoped to
`#storybook-root` so its numbers stay comparable to what the Vitest a11y run would report.

It **never fails**. It is a measurement, not a gate — deliberately, so that the excluded
rule has a live number attached to it instead of a stale comment.

```bash
bun run build                        # needs storybook-static
bun run verify:a11y                  # light theme — the recorded baseline
A11Y_THEME=dark bun run verify:a11y  # dark is a separate risk surface
A11Y_GREP=button bun run verify:a11y # scope to matching story ids
```

`A11Y_PORT` (default 6180) if 6180 is taken. A full pass is 400+ page loads and several
minutes; progress goes to stderr so the report on stdout stays pipeable.

The report gives you:

- the total, and how many stories are affected,
- the **worst colour pairings ranked by frequency** — the actionable output, because these
  are token pairs, so fixing ten pairs fixes a hundred violations,
- the most affected stories,
- and, if the count ever reaches zero, an explicit instruction to re-enable the rule in
  `.storybook/preview.ts` and delete the script.

## Current honest state

Measured with `bun run verify:a11y` against the light theme:

| Metric | Value |
| --- | --- |
| Contrast violations | **162** |
| Stories affected | **85** (of 433) |
| Distribution | 6 token pairs account for >70% of the count |
| Severity | mostly near-misses (3.98–4.47:1 against 4.5:1), with a tail of real failures at 2.88:1 and ~1.15:1 |
| Worst-affected stories | `schedulecalendar--month` (7), `alert--variants` (6), `callout--variants` (6), `statuspill--all-statuses` (6) |
| Root cause | semantic token values in `@qeetrix/ui` |
| Fixable from this repo | **no** |
| Dark theme | separate surface, not part of the recorded baseline — run `A11Y_THEME=dark` |

These numbers move as stories are added and as `@qeetrix/ui` tokens change. **Run the
script rather than trusting this table.** Inline comments elsewhere in the repo quote
different figures (e.g. "149 violations across 47 story files") because they were measured
at a different time and counted story *files* rather than story ids.

The path to closing this: correct the token values in `qeetrix-ui`, re-run
`verify:a11y` until it reports zero, then re-enable `color-contrast` in the gate and
retire the script.

## What is *not* covered

axe is a **floor, not a grade.** It catches a minority of WCAG failures — roughly the
machine-checkable ones. A story passing the gate has not been audited.

| Not covered | Note |
| --- | --- |
| Screen-reader announcement quality | no automated check exists for this anywhere |
| Keyboard flows | only where a `play` function asserts them — 22 of 70 interactive components |
| Focus order and focus-trap correctness | partially, via overlay `play` tests |
| RTL | a Direction toolbar global and a `DirectionProvider` decorator exist; there is **no** RTL test matrix — nothing runs axe, or anything else, in RTL |
| Dark theme contrast | reportable via `A11Y_THEME=dark`, not gated, not baselined |
| Responsive / zoom / reflow | four viewport presets exist in the toolbar; the only automated assertion is the single mobile `Container` check in `verify-foundations.mjs` |
| Forced colors / high contrast | one assertion in `verify-foundations.mjs` (currently failing earlier in that script) |
| Reduced motion | not tested here |
| Audited conformance grade (VPAT) | belongs to `qeetrix-ui`, not this repo |

This is why the story contract has **no `accessibility` field**. A declared grade like
`"AA"` would have to mean an audit happened; "axe passed" is not that, and conflating the
two is worse than having no field. See [governance.md](./governance.md#extending-the-contract).

## Writing an accessible story

The gate catches machine-checkable failures. These are the ones authors trip most:

- Icon-only controls need an accessible name (`aria-label`) — `IconButton`, `CloseButton`.
- Images and decorative SVGs need `alt` or `aria-hidden="true"`.
- Every form control needs an associated label (`FieldLabel` + `htmlFor`, or `aria-label`).
- Don't invent ARIA the component already provides — `@qeetrix/ui` is built on Base UI,
  which implements the WAI-ARIA APG behaviour. Adding roles on top usually breaks it.
- Query by **role and accessible name** in `play` functions. An assertion that can only
  pass for a keyboard- and screen-reader-reachable element is worth more than one that
  reaches into the DOM — the test doubles as an accessibility assertion for free.
- If you can't reach it with Tab, it isn't done.

The narrative `Guides/Accessibility` page in `stories/guides/accessibility.mdx` covers the
design system's standards commitments and the `qeetrix-ui`-side tooling. This document
covers what *this repo* enforces.
