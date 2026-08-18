# @qeetrix/docs

Storybook 10 workshop for the Qeetrix design system (private — not published). Renders the
components exactly as a consumer sees them: imports `@qeetrix/ui` (components, brand, and the
generated token CSS), with light/dark driven by the `.dark` class strategy.

```bash
bun run --filter @qeetrix/docs storybook        # dev server on :6006
bun run --filter @qeetrix/docs build-storybook   # static build → storybook-static/
```

> Requires the packages to be built first (stories import the compiled `@qeetrix/ui`); the
> monorepo `turbo run build` handles ordering.

## Contents

- **Foundations** — `Introduction` (MDX), `Colors`, `Typography`, `Spacing & Radius`
  (galleries driven by live `@qeetrix/ui` token CSS variables, so they react to the Theme toolbar).
- **Primitives** — one story per `@qeetrix/ui` component (36).
- **Brand** — the adaptive `QeetLogo` (auto / on-light / on-dark) and the custom icon set.

Tailwind v4 is wired through `@tailwindcss/vite` in `.storybook/main.ts`; `.storybook/styles.css`
imports `@qeetrix/ui/styles.css` and `@source`s the stories. Adding a story = drop a
`*.stories.tsx` under `stories/` importing from `@qeetrix/ui`.
