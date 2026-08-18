# Visual regression tests (VRT) — Gap 11

Snapshot every Storybook story × light/dark and diff against committed baselines,
using Playwright's `toHaveScreenshot`. Reuses the same static-serve + story
enumeration as `scripts/shoot.mjs`, but with real baseline diffing (no paid SaaS).

## One-time setup

`@playwright/test` is **not** in `package.json` yet (adding it without a lockfile
update would break CI's `bun install --frozen-lockfile`). Add it, commit the lockfile,
then the scripts + the `vrt.yml` workflow become live:

```bash
bun run --filter @qeetrix/docs add -D @playwright/test@1.61.0
```

## Running

```bash
bun run --filter @qeetrix/docs build        # produce storybook-static (+ llms.txt)
bun run --filter @qeetrix/docs vrt          # compare against baselines
bun run --filter @qeetrix/docs vrt:update   # (re)generate baselines
VRT_GREP=button bun run --filter @qeetrix/docs vrt   # scope to matching story ids
```

## ⚠️ Baselines must be generated in CI's Linux container

Screenshots are OS- and font-sensitive. Baselines committed from a dev Mac will diff
against the `ubuntu`/Playwright-container renderer in CI. **Always** generate/update
`tests/vrt.spec.ts-snapshots/` via the **VRT** GitHub workflow
(`.github/workflows/vrt.yml`, `mcr.microsoft.com/playwright`), which runs
`vrt:update` and you commit the result. The workflow is `workflow_dispatch` (manual)
until the dep lands; flip it to run on PRs once baselines exist.

Start scoped (a few primitives), confirm stable, then expand to the full set
(~117 stories × 2 themes).
