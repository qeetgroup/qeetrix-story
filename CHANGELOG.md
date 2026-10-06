# @qeetrix/docs

## Unreleased

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
