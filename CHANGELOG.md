# @qeetrix/stories

## 0.0.15

- **Qeetrix's own icon.** The sidebar shows Qeetrix's icon (three stacked layers in a white disc, on
  Qeet orange) beside the name "Qeetrix" in Qeet Sans, as ui.qeet.in's header does, instead of the
  Qeet "q"; it links to ui.qeet.in. The browser tab shows the same icon instead of Storybook's. The
  icon's master files and rules are in qeet-mockups, `products/qeetrix/brand/`.

## 0.0.14

The workshop moves to **`@qeetrix/react` 0.5.1**, **`@qeetrix/tokens` 0.0.15** and **`@qeetrix/icons`
2.1.2**.

- **PictureChoice** has a page: avatars, colour swatches, the two sizes, an unavailable option and
  right to left, with interaction tests for choosing with the arrow keys and for every option's
  name. Its Overview tile keeps every export with one.
- **Input's Playground** has a `size` control: `lg` is the one field of a sign-in or sign-up step.
- **ToggleGroup** has a Full width example, and **AvatarItem** a Status one.
- **Welcome's New in** shows 0.5's: pictures to choose from, a large field for one value and
  full-width toggles. Its heading names the minor line ("New in 0.5").
- **Versions are raised on develop.** The Version workflow checks a develop → main pull request
  instead of committing a bump.

## 0.0.13

The workshop moves from `@qeetrix/ui` to **`@qeetrix/react` 0.4.0**, **`@qeetrix/tokens`
0.0.13** and **`@qeetrix/icons` 2.1.0**, and every page is rebuilt to a premium, enterprise standard.

### From 0.1.0 to 0.4.0

- **Chip and ChipGroup** have a page: selectable, removable, one value, several, the three sizes,
  right to left and Hindi, with interaction tests for turning a chip on and off, moving a one-value
  choice with the arrow keys, and removing one. ui.qeet.in's Chip page links to it.
- **Components › Overview** has a preview for each of the 34 families 0.2 to 0.4 added (the charts,
  CheckList, CopyField, Kbd, ThemeSwitcher, the conversation and workspace parts and the rest), so
  every export has its tile.
- **Welcome's New in** shows 0.4.0's: chips, a status on avatars and filled icons on the selected tab.
- **Menu's View example** keeps its column and sort choices in state and stays open while they
  change, as 0.2's radio items close the menu by default.
- **Pagination's states** use its offset props, now one of two prop shapes (offset or cursor).

### Major changes

- **Renders the published packages.** `@qeetrix/react` and `@qeetrix/tokens` install from npm.
  There's no sibling checkout, so CI, the release workflow and Vercel all build from the registry.
- **Only what `@qeetrix/react` ships.** 110 component families (43 stable, 67 experimental), each
  with a tile on the Overview; 76 have a page of their own (0.1.0's 75, and Chip). Stories for
  `@qeetrix/ui` components with no successor are deleted.
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
