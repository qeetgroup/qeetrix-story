# @qeetrix/stories

## Unreleased

The workshop moves from `@qeetrix/ui` to **`@qeetrix/react` 0.1.0** and **`@qeetrix/tokens`
0.0.8**, and every page is rebuilt to a premium, enterprise standard.

### Major changes

- **Renders the published packages.** `@qeetrix/react` and `@qeetrix/tokens` install from npm.
  There's no sibling checkout, so CI, the release workflow and Vercel all build from the registry.
- **Only what `@qeetrix/react` ships.** 75 component families (42 stable, 33 experimental), one
  page each. Stories for `@qeetrix/ui` components with no successor are deleted.
- **Props tables from the type declarations.** `scripts/docgen.mjs` reads the package's `.d.ts`
  into `.storybook/docgen.json`, so a page can't drift from the API.

### Pages

- **Welcome:** a hero with a live Qeet ID console built from the components, the install command,
  counts read from the packages, Explore cards with previews, New in 0.1.0, and principles.
- **Components › Overview:** a docs page with search (a part's name finds its family), a status
  filter, category groups and a live preview on every tile.
- **Component pages:** one template.
  - A header with the status, import line and links.
  - A Playground whose controls drive the live example.
  - The props table.
  - The examples, each on a ruled stage with a Code toggle that shows the story's source.
- **Patterns:** Sign in, Dashboard header, Users table, User detail (new), Account settings and
  Search. Users table rows open User detail.
- **Foundations** (7) and **Guides** (2).

### Stories

- **Every 0.1.0 variant on its component's page:**
  - Avatar `shape`; Badge `solid` and `sm`; Card `subdued` and `danger`; GridItem.
  - Contained Tabs with counts; clickable Table rows.
  - Date-range presets; Combobox server search; Dialog `xl` and `fullscreen`.
  - Skeleton `lines`; Meter, Progress and Timeline tones; Stat `loading`; and more.
- **Lean pages:** a Playground and at most four examples (five for complex components).
- **Tests out of sight:** test stories are tagged `!dev` and `!autodocs`. All 644 tests run in
  Vitest with axe and colour contrast on.
- **In-page `#` links don't leave the workshop.** They go through a link that calls
  `preventDefault()`, because the preview's `<base target="_parent">` would otherwise navigate the
  whole workshop.

### Removed

- `@qeetrix/ui`, `setup:ui`, `gen-llms`, `verify-a11y` and `verify-foundations`.
- `stories/recipes/`, which repeated component states.
- The Introduction page, which the Welcome page replaces.

## 0.0.11 and earlier

The workshop for `@qeetrix/ui`, now retired. Its entries are in this file's git history.
