# @qeetrix/stories

## Unreleased

### Major Changes

- **`@qeetrix/ui` 2.1.4.** The workshop follows 2.1.4, which took eight modules out of the
  package and `@qeetrix/ui/brand` with them; CI renders `qeetrix-ui@main`, so every gate but the
  type check had gone red.
  - Stories for the eight are removed — `AccessReview`, `AuditEvent`, `CommentThread`,
    `LogoUploader`, `NotificationCenter`, `NotificationPreferenceMatrix`, `SecurityItem` and
    `MasterDetail`, now copy-paste source in `qeetrix-ui`. 147 → 139 component stories.
  - Patterns that used them compose library parts instead: Account Settings builds its security
    rows from `StatusPill` and `DescriptionList`, and the NotificationCenter bell menu is a
    `Popover` around the same inbox. Its popup is now named by a `PopoverTitle`, so the story no
    longer switches off axe's `aria-dialog-name` rule.
  - The logo and brand icons come from `@qeetrix/icons` (`QeetLogo`, `FingerprintPatternIcon`,
    `MonitorSmartphoneIcon`, …), following the theme with a light and a dark `QeetLogo`.
  - The Elevation, Opacity, Z-Index and Token Layers foundations read `@qeetrix/ui/tokens.json`
    and the `--chart-*` variables instead of the removed `SHADOW`, `STATE_OPACITY`, `Z_INDEX`
    and `CHART_COLOR`. Elevation now shows the dark shadow primitives beside the light ones.
- **Release workflows.** The repo has the same four workflows as `qeetrix-ui`, `qeetrix-icons`
  and `qeetrix-docs`: `ci.yml`, `version.yml` (patch bump on the PR into `main`), `release.yml`
  (gates, deploys Storybook to Vercel production, then tags `vX.Y.Z`) and `rollback.yml`. Each
  checks out the `qeetrix-ui` release tag that `bun.lock` installs instead of `main`, so the
  type check and the stories always see the same API. CI runs on every PR and on push to
  `main`, like the other repos.
- **Visual regression removed.** `vrt.yml`, `playwright.config.ts`, `tests/` and the
  `vrt` / `vrt:update` scripts are gone, with `@playwright/test`. No baselines were ever
  committed, so nothing was compared. The component tests, axe gate included, are the testing
  layer.
- **Fixes.** `lint` passes: Biome parses Tailwind's `@source` directive and its schema matches
  the installed 2.5.10. Every CI gate is green.
- **Builds on Vercel.** `bun run setup:ui` clones `../qeetrix-ui` at the release `bun.lock`
  installs when it is missing, then installs it and builds its tokens; `vercel.json` runs it
  before `bun run build`. Vercel's own builders have no sibling checkout, so a dashboard deploy
  failed at `gen-llms`; now a redeploy, and a preview of any branch but `main`, builds there.
  Production still ships from `release.yml`.

### Minor Changes

- **`@qeetrix/ui` 2.1.0.** Stories cover the 2.1.0 API: new parts (`DialogBody`, `DrawerBody`,
  `SheetBody`, `AlertAction`, `TableEmpty`, `TimelineHeader`, `ToolbarSpacer`, `FieldSuccess`,
  `FieldWarning`, `InputGroupButton`, `CarouselControls`, `CarouselIndicators`, `CommentMention`,
  `DescriptionItem`, `FeedItem`, `AuditEventMetadata`) and new variants and sizes (Alert
  `emphasis`, Badge `brand`/`info`, Callout `muted`, Card variants and `interactive`, Dialog,
  EmptyState, Notification, Progress and Stat sizes, Tabs `line`, Toolbar `ghost`, and more).
  425 → 511 stories, 519 → 615 tests. Foundations document the Ember + Graphite colour roles,
  the `focus-ring*` utilities, motion duration utilities and the new elevation roles.
- **Icons.** Upgraded `@qeetrix/icons` 1.0.3 → 1.0.10 and moved every demo to its `…Icon` names
  with root imports (`import { TrashIcon } from "@qeetrix/icons"`). The white-icon workarounds
  are gone, since 1.0.10 paints with `currentColor`. The icon catalogue page
  (`stories/icons.stories.tsx`) is removed — this workshop documents the component library; the
  icon catalogue lives in `qeetrix-icons`. Storybook resolves the root import to the package's
  icons-only index so the ~7,400 brand logos are never pre-bundled.
- **Fixes.** `typecheck` and `verify:foundations` pass. `@qeetrix/ui/styles.css` now resolves to
  the full entry, base layer included. Overlay dismissal tests poll for absence instead of
  racing `waitForElementToBeRemoved`. Docs record the 2.1.0 contrast baseline (13 violations
  across 10 stories, down from 162 across 85).

## 0.0.9

### Patch Changes

- Updated dependencies
  - @qeetrix/ui@1.0.3

## 0.0.8

### Patch Changes

- Updated dependencies
  - @qeetrix/ui@1.0.1

## 0.0.7

### Patch Changes

- Updated dependencies [a5f5479]
- Updated dependencies
- Updated dependencies [c171669]
- Updated dependencies [c171669]
- Updated dependencies [c171669]
  - @qeetrix/ui@1.0.0

## 0.0.6

### Patch Changes

- Updated dependencies [42e3b8c]
- Updated dependencies [a4bd2da]
- Updated dependencies [4ec7f1f]
- Updated dependencies [7006c91]
- Updated dependencies [42e3b8c]
  - @qeetrix/ui@0.5.0

## 0.0.5

### Patch Changes

- Updated dependencies [db64ae7]
  - @qeetrix/ui@0.4.0

## 0.0.4

### Patch Changes

- 969f7f3: Updated
- Updated dependencies [969f7f3]
  - @qeetrix/tokens@0.1.1
  - @qeetrix/ui@0.3.1

## 0.0.3

### Patch Changes

- Updated dependencies [c565778]
- Updated dependencies [5882cdb]
- Updated dependencies [c565778]
- Updated dependencies [5882cdb]
- Updated dependencies [5882cdb]
- Updated dependencies [c565778]
- Updated dependencies [5882cdb]
  - @qeetrix/ui@0.3.0
  - @qeetrix/tokens@0.1.0

## 0.0.2

### Patch Changes

- Updated dependencies [62ef506]
- Updated dependencies [fc3bf47]
- Updated dependencies [fc3bf47]
- Updated dependencies [fc3bf47]
- Updated dependencies [fc3bf47]
- Updated dependencies [fc3bf47]
- Updated dependencies [fc3bf47]
- Updated dependencies [62ef506]
- Updated dependencies [62ef506]
- Updated dependencies [62ef506]
- Updated dependencies [62ef506]
- Updated dependencies [62ef506]
- Updated dependencies [62ef506]
- Updated dependencies [62ef506]
- Updated dependencies [62ef506]
- Updated dependencies [62ef506]
  - @qeetrix/ui@0.2.0

## 0.0.1

### Patch Changes

- Updated dependencies
- Updated dependencies
  - @qeetrix/ui@0.1.0
