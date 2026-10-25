# Accessibility

Accessibility in this repo is a **gate**, not a report. It is also honest about what it
does not yet cover.

## The gate

`.storybook/preview.ts`:

```ts
a11y: {
  test: "error",
  options: { rules: { region: { enabled: false } } },
}
```

`test: "error"` means `@storybook/addon-a11y` runs **axe over every story** as part of
`bun run test`, and **any violation fails the run**. There is no separate a11y command to
remember and no separate suite to keep in sync: the a11y check rides on the component test
layer described in [testing.md](./testing.md), so every story is an a11y test for the same
reason every story is a render test.

| Value of `test` | Behaviour |
| --- | --- |
| `"off"` | axe does not run in the test layer |
| `"todo"` | violations are reported, not failed |
| `"error"` | **the project setting**: violations fail `bun run test` |

## What is excluded, and why

### `region`: a false positive by construction

axe's `region` rule requires every piece of page content to sit inside a landmark
(`<main>`, `<nav>`, …). A story renders **a single component into `#storybook-root`**, not
a full document. Landmark structure is the app shell's responsibility, not a primitive's,
so there is nothing to fix. The AppShell and pattern stories, which do render a page, bring
their own landmarks.

### Colour contrast: enforced

The old workshop excluded `color-contrast`, because its violations traced to token values in
`@qeetrix/ui`. `@qeetrix/react` and `@qeetrix/tokens` were designed against WCAG 2.2 AA
contrast, and their own suite already asserts it in both colour schemes. So the rule is on
here, and a contrast failure fails the run like any other.

When a story fails axe because of a **component or a token**, not because of the story:
1. mark that one story `parameters: { a11y: { test: "todo" } }`, with a code comment saying
   what fails and why;
2. raise it in qeetrix-react or qeetrix-tokens.

Never `"off"`, and never for a whole file: the rest of the file stays gated, and `"todo"`
keeps the violation visible in the Accessibility panel.

Find the current exceptions with:

```bash
grep -rn 'test: "todo"' stories
```

## What is *not* covered

axe is a **floor, not a grade.** It catches a minority of WCAG failures, roughly the
machine-checkable ones. A story passing the gate has not been audited.

| Not covered here | Note |
| --- | --- |
| Screen-reader announcement quality | no automated check exists for this anywhere |
| Keyboard flows | only where a `play` function asserts them; qeetrix-react's own tests assert every component's keys |
| RTL, Hindi | toolbar globals let a human check any story; nothing runs the suite that way |
| Dark scheme contrast | the suite runs the light scheme; qeetrix-react's tests check both |
| Responsive / zoom / reflow | five viewport presets exist in the toolbar; nothing runs stories at them |
| Forced colours, reduced motion | covered by qeetrix-react's own tests, not here |
| Audited conformance grade (VPAT) | belongs to qeetrix-react, not this repo |

This is why the story contract has **no `accessibility` field**. A declared grade like
`"AA"` would have to mean an audit happened; "axe passed" is not that, and conflating the two
is worse than having no field. See [governance.md](./governance.md#extending-the-contract).

## Writing an accessible story

The gate catches machine-checkable failures. These are the ones authors trip most:

- **Labels:**
  - Icon-only controls need an accessible name. `IconButton`'s `aria-label` is required by its type.
  - Images and decorative SVGs need `alt` or `aria-hidden="true"`.
  - Every form control needs a label: put it in a `Field` (which labels it), or give it `aria-label`.
- **Don't invent ARIA the component already provides.** `@qeetrix/react` is built on Base UI,
  which implements the WAI-ARIA APG behaviour; adding roles on top usually breaks it.
- **Query by role and accessible name** in `play` functions. An assertion that can only pass
  for a keyboard- and screen-reader-reachable element is worth more than one that reaches into
  the DOM; the test doubles as an accessibility assertion for free.
- If you can't reach it with Tab, it isn't done.

The narrative `Guides/Accessibility` page in `stories/guides/accessibility.mdx` covers the
design system's standards commitments. This document covers what *this repo* enforces.
