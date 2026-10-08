# Testing

Every story is a test. Vitest renders each one in a real browser, runs its `play` function,
and runs axe over the result.

| Question | Runner | Config | Command |
| --- | --- | --- | --- |
| Does every story render, behave, and pass axe? | Vitest 4, browser mode | `vitest.config.ts` | `bun run test` |

---

## Component tests (Vitest browser mode)

### Every story is a test

`@storybook/addon-vitest`'s `storybookTest` plugin turns **every export under
`stories/**`** into a Vitest case. No test file is written by hand. Each case:

1. mounts the component in a real headless Chromium page,
2. fails on any error thrown during render,
3. runs the story's `play` function, if it has one,
4. runs axe over the result (via `addon-a11y`) and fails on violations — see
   [accessibility.md](./accessibility.md).

Adding a story therefore adds a test. Deleting one deletes a test. There is no separate
list to keep in sync.

### Commands

| Command | Does |
| --- | --- |
| `bun run test` | the whole suite, headless (`vitest run`) |
| `bun run test:storybook` | same, pinned to the `storybook` project |
| `bun run test:watch` | watch mode; also boots the workshop so failures get a clickable link into it |
| `bun run test:coverage` | v8 coverage over the `@qeetrix/ui` source the stories exercise |
| `bunx vitest run stories/components/actions/button.stories.tsx` | a single file |

### Three things to know before editing `vitest.config.ts`

**1. It reuses `.storybook/main.ts` wholesale.** The plugin applies our `viteFinal`, so
`@qeetrix/ui` resolves to `../qeetrix-ui/src` in tests exactly as it does in the dev
server — including the `react`/`react-dom` dedupe, without which every Base UI component
throws on its first hook. Tests exercise the same source the workshop renders. See
[architecture.md](./architecture.md#the-react--react-dom-dedupe-is-load-bearing).

**2. There is deliberately no `.storybook/vitest.setup.ts`.** Most Storybook + Vitest
tutorials tell you to create one that calls `setProjectAnnotations(...)`. **Do not.**
Since **Storybook 10.3** the addon applies preview annotations automatically; a setup file
now *double-applies* them and logs a warning. Its absence is a decision, not an omission —
if you are here because a tutorial said the file should exist, this paragraph is why it
does not.

**3. Vitest 4, not 3.** This repo is on Vite 8, which Vitest 3 does not support. Vitest 4
also moved browser providers into their own package, hence the `@vitest/browser-playwright`
devDependency and `provider: playwright()` in the browser block.

### Browser matrix

Headless **Chromium only**. Firefox and WebKit are not run.

### Coverage

`bun run test:coverage` → v8, `text` + `html`, into `coverage/`.

The interesting question is *which `@qeetrix/ui` components the stories actually exercise* —
and that source lives outside this repo, so the config sets `allowExternal: true` and
points `include` at `../qeetrix-ui/src/**/*.{ts,tsx}`.

Coverage is **deliberately un-thresholded**. It reports a number; it does not gate on one.

---

## Interaction tests (`play`)

A `play` function runs in two places from one definition: the **Interactions panel** in the
running workshop, and as a real **Vitest case** in headless Chromium under `bun run test`.

`stories/components/actions/button.stories.tsx` is the reference — copy that shape:

```tsx
import { expect } from "storybook/test";

export const ClickInteraction: Story = {
  name: "Interaction: click focuses",
  args: { children: "Continue" },
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole("button", { name: "Continue" });
    await userEvent.click(button);
    await expect(button).toHaveFocus();
  },
};
```

Rules that come out of the existing 22 interaction tests:

| Rule | Why |
| --- | --- |
| Take `canvas` and `userEvent` from the play context — don't import them | they are scoped to the story's own render |
| Import `expect`, `screen`, `waitFor` from `storybook/test` | not from `@testing-library/*` |
| Query by **accessible role and name**, not test ids | an assertion that can only pass for a keyboard- and screen-reader-reachable element is worth more than one that reaches into the DOM |
| Name the export `…Interaction` and give it a human `name: "Interaction: …"` | the story list stays readable, and the intent is visible in the sidebar |
| Assert the thing most likely to break silently | for overlays that is *dismissal*, not opening |

### `canvas` vs `screen` — the portal rule

**This is the single most common way an interaction test fails.**

| Content | Query with | Because |
| --- | --- | --- |
| Rendered inside the story | `canvas` | `canvas` is scoped to the story's root element |
| Rendered into a **portal** — dialogs, popovers, menus, tooltips, selects, sheets, comboboxes, date pickers | `screen` | portalled content mounts on `document.body`, **outside** `canvas`, so `canvas` will never find it |

Overlays also **animate in from `opacity: 0`**, so visibility must be *polled*, not asserted
on the first frame. jsdom would never surface this; a real browser does.

`stories/components/overlays/dialog.stories.tsx` is the reference overlay test:

```tsx
import { expect, screen, waitFor } from "storybook/test";

play: async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole("button", { name: "Edit profile" }));

  // Dialog content is portalled to document.body, so it is outside `canvas`.
  const dialog = await screen.findByRole("dialog");
  await waitFor(() => expect(dialog).toBeVisible());

  await userEvent.keyboard("{Escape}");

  // Poll for absence. `waitForElementToBeRemoved` throws if the dialog is already gone when
  // it first checks, and @qeetrix/ui 2.1 overlays can close within the same frame.
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
},
```

Note the shape: the **trigger** is in-canvas (`canvas.getByRole`), the **overlay** is
portalled (`screen.findByRole`). One test, both queries. Eleven story files currently
import `screen`, and every one of them is an overlay.

---

## In CI

The workflows are the same four as `qeetrix-ui`, `qeetrix-icons` and `qeetrix-docs`:

| Workflow | Runs on | Does |
| --- | --- | --- |
| `ci.yml` | every PR, push to `main` | the gates below |
| `version.yml` | PR into `main` | bumps the patch version on the PR branch, unless it is already raised |
| `release.yml` | push to `main` | gates, builds and deploys Storybook to Vercel production, then tags `vX.Y.Z` |
| `rollback.yml` | manual, with a tag | redeploys exactly the commit a release tag names |

Each one checks out **two repos side by side** (`qeetrix-story/` and `qeetrix-ui/`) to
reproduce the `../qeetrix-ui` relative path, for the reason described in
[architecture.md](./architecture.md#qeetrixui-is-resolved-from-a-sibling-checkout). The
`qeetrix-ui` checkout is the release tag of the `@qeetrix/ui` version `bun.lock` installs, so
the type check (which reads `node_modules`) and the stories (which render the checkout) see
the same API. Both repos are installed, and `bun run build:tokens` runs in `qeetrix-ui` — its
`tokens.css` / `tokens.json` / `token-values.ts` are generated and gitignored, so a fresh
clone does not contain them.

| Gate | Command |
| --- | --- |
| Lint | `bun run lint` |
| Typecheck | `bun run typecheck` |
| Story contract | `bun run verify:stories` |
| Component tests | `bun run test` |
| Build | `bun run build` |

Every gate runs even after an earlier one fails (`if: !cancelled()`), so one run tells you
the state of all of them instead of one fix-and-rerun cycle per gate. The job still fails
overall — no gate is `continue-on-error`, because a green tick on a broken tree is worse than
no CI. `release.yml` runs the same gates before it deploys.

Upgrading `@qeetrix/ui` is a PR here like any other change: bump it in `package.json`, and
CI renders the matching `qeetrix-ui` release.

## What the tests do *not* cover

Stated so nobody assumes coverage that isn't there:

- **RTL** — there is a Direction toolbar global and a `DirectionProvider` decorator, so a
  human can flip a story to RTL. There is **no RTL test matrix** — nothing runs the suite
  in RTL.
- **Visual appearance** — nothing diffs screenshots, so a change in how a story *looks*
  is caught by a reviewer, not by CI.
- **Dark mode** — the component/a11y run only exercises the default (light) theme. `A11Y_THEME=dark bun run verify:a11y` is the
  only dark-mode check that exists today, and it reports rather than gates.
- **Responsive / viewport matrices** — four canonical viewport presets exist in the
  toolbar (390 / 768 / 1440 / 1920). Nothing runs stories at them automatically. The only
  automated responsive assertion anywhere is a single mobile `Container` check in
  `scripts/verify-foundations.mjs`.
- **Component internals** — unit tests for `@qeetrix/ui` live in `qeetrix-ui`, not here.
