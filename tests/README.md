# Testing the Qeetrix workshop

Two independent layers. They answer different questions and are run separately.

| Layer | Question | Runner | Config | Command |
| --- | --- | --- | --- | --- |
| Component tests | Does every story render, behave, and pass axe? | Vitest (browser mode) | `vitest.config.ts` | `bun run test` |
| Visual regression | Does anything *look* different from the committed baseline? | Playwright | `playwright.config.ts` | `bun run vrt` |

## Component tests

`@storybook/addon-vitest` turns every export under `stories/**` into a Vitest case that
mounts the component in headless Chromium. A story fails if it throws while rendering,
or if its `play` function's assertions fail. See `stories/components/actions/button.stories.tsx`
for the reference `play` shape.

```bash
bun run test                  # whole suite, headless
bun run test:watch            # watch mode; also boots the workshop for debugging links
bun run test:coverage         # v8 coverage over the @qeetrix/ui source the stories exercise
bunx vitest run stories/components/actions/button.stories.tsx   # one file
```

Accessibility runs here too: `addon-a11y` executes axe against every story, and it is a
**gate**: `test: "error"` in `.storybook/preview.ts`, so any violation fails the run.

Two rules are excluded, both deliberately and both commented at the point of exclusion:
`region` (a story is not a full document, so landmark-region is a false positive here) and
`color-contrast` (162 violations, all tracing to `@qeetrix/ui` token pairings rather than to
anything a story can fix — `bun run verify:a11y` reports that number separately).

Two things worth knowing before changing `vitest.config.ts`:

- **No `.storybook/vitest.setup.ts`.** Since Storybook 10.3 the addon applies preview
  annotations automatically; adding a setup file that calls `setProjectAnnotations`
  double-applies them.
- **Vitest 4 is required.** This repo is on Vite 8, which Vitest 3 does not support.

## Visual regression (VRT)

Snapshot every Storybook story × light/dark and diff against committed baselines using
Playwright's `toHaveScreenshot`. Reuses the same static-serve + story enumeration as
`scripts/shoot.mjs`, but with real baseline diffing (no paid SaaS).

```bash
bun run build        # produce storybook-static (+ llms.txt)
bun run vrt          # compare against baselines
bun run vrt:update   # (re)generate baselines
VRT_GREP=button bun run vrt   # scope to matching story ids
```

### ⚠️ Baselines must be generated in a Linux container

Screenshots are OS- and font-sensitive. Baselines committed from a dev Mac will diff
against the `ubuntu`/Playwright-container renderer used in CI.

**This repo currently has no `.github/` directory and no CI workflow at all.** Until one
exists, `tests/vrt.spec.ts-snapshots/` cannot be generated reproducibly, and `bun run vrt`
is only meaningful locally against locally-generated baselines. Setting up CI — including
a container job that runs `vrt:update` for you to commit — is tracked as its own piece of
work; do not commit dev-machine baselines in the meantime.

Start scoped (a few primitives), confirm stable, then expand to the full set.
