import { Button, Checkbox, Field, FieldLabel, Input, Label, Link, Switch } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Grid, Page, Section, Swatch } from "../_helpers";
import { Callout, Code, Prose, TokenTable } from "./_foundation";

const meta: Meta = {
  title: "Foundations/Focus",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Focus is a contract, not a per-component decision. It is one recipe exposed as three utilities, defined once in `@qeetrix/ui`: `focus-ring` for most controls, `focus-ring-inset` for items inside a clipping container, and `focus-ring-field` for bordered text entry. All three draw a solid **outline**, not a box-shadow halo, because forced-colors mode strips shadows and keeps outlines. Geometry tokens (`--qx-focus-outline-width`, `--qx-focus-offset`, `--qx-focus-ring-style`) are theme-agnostic; one colour token (`--qx-color-focus-ring`, surfaced to Tailwind as `--ring`) is Qeet orange — Ember in light, `qeet-400` in dark — and reaches 3:1 against every surface in both themes. Under `forced-colors: active` the colour and width are replaced by a system `Highlight` outline; the offset stays the component's own.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

const GEOMETRY = [
  {
    token: "--qx-focus-outline-width",
    value: "2px",
    alias: "stroke.width.thin",
    note: "The width of the indicator. focus-ring and focus-ring-inset draw a 2px outline; focus-ring-field reaches the same 2px as border plus outline; the forced-colors fallback uses it too.",
  },
  {
    token: "--qx-focus-offset",
    value: "2px",
    alias: "space.xxs",
    note: "Gap between the control and the outline. It puts the indicator against the surrounding surface rather than the control's own fill, which is why one colour reaches 3:1 on a primary button and a ghost button alike.",
  },
  {
    token: "--qx-focus-ring-style",
    value: "solid",
    alias: "stroke.solid",
    note: "Line style. Solid — a dashed focus indicator reads as a drag target.",
  },
  {
    token: "--qx-focus-ring-width",
    value: "3px",
    alias: "stroke.width.thick",
    note: "Still published, but no Qeetrix component draws with it: it sized the ring-3 halo the focus-ring utilities replaced.",
  },
];

const COLOURS: Array<[string, string]> = [
  ["--qx-color-focus-ring", "focus-ring"],
  ["--ring", "ring (bridge)"],
  ["--qx-color-border-focused", "border-focused"],
  ["--qx-component-input-border-focus", "input-border-focus"],
];

const UTILITIES = [
  {
    utility: "focus-visible:focus-ring",
    draws: "A 2px --ring outline, --qx-focus-offset outside the control.",
    for: "Buttons, tabs, toggles, checkboxes, radios, switches, links, slider thumbs, interactive cards.",
  },
  {
    utility: "focus-visible:focus-ring-inset",
    draws: "The same outline, pulled inside the element by its own width.",
    for: "Items inside a clipping container: menu items, list options, table rows and cells, sidebar and tree items.",
  },
  {
    utility: "focus-visible:focus-ring-field",
    draws: "The border turns --ring and a 1px outline at zero offset thickens it to 2px.",
    for: "Bordered text entry: Input, Textarea, the pickers built on the field recipe.",
  },
];

/** The indicator rendered permanently, so the anatomy is visible without holding focus. */
function RingAnatomy() {
  return (
    <div className="flex flex-wrap items-center gap-10 py-4">
      {/* The utility itself, applied without a variant — this is the shipped recipe, not a copy. */}
      <div className="focus-ring rounded-(--qx-component-button-corner) bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
        Always-on focus-ring
      </div>
      <dl className="grid grid-cols-[auto_auto] gap-x-4 gap-y-1 text-xs">
        <dt className="text-muted-foreground">width</dt>
        <dd className="font-mono">2px · --qx-focus-outline-width</dd>
        <dt className="text-muted-foreground">offset</dt>
        <dd className="font-mono">2px · --qx-focus-offset</dd>
        <dt className="text-muted-foreground">style</dt>
        <dd className="font-mono">solid · --qx-focus-ring-style</dd>
        <dt className="text-muted-foreground">colour</dt>
        <dd className="font-mono">--ring · --qx-color-focus-ring</dd>
      </dl>
    </div>
  );
}

export const Ring: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The indicator, drawn permanently with the `focus-ring` utility so the geometry can be inspected without holding focus, alongside the tokens that define it.",
      },
    },
  },
  render: () => (
    <Page>
      <Section title="Anatomy">
        <Prose>
          Two pixels of solid colour, offset two pixels from the control. The offset matters more
          than it sounds: without it the indicator merges with the control&rsquo;s own edge or fill
          and stops being a separate signal, which is exactly the case a low-vision user needs it to
          be.
        </Prose>
        <RingAnatomy />
      </Section>

      <Section title="Geometry tokens">
        <TokenTable
          caption="--qx-focus-* — theme-agnostic, so the affordance does not resize between light and dark."
          columns={["Token", "Value", "Primitive it aliases", "What it does"]}
          rows={GEOMETRY.map((entry) => ({
            token: entry.token,
            cells: [
              entry.value,
              entry.alias,
              <span key={entry.token} className="font-sans">
                {entry.note}
              </span>,
            ],
          }))}
        />
      </Section>

      <Section title="Focus colour">
        <Prose>
          The one part of the contract that is theme-varying. It is Qeet orange rather than a
          neutral — Ember (<Code>qeet-600</Code>) in light, <Code>qeet-400</Code> in dark — which
          makes a focused control identifiable at a glance across a dense form, and each step is
          chosen to clear 3:1 against every surface in its theme. Swatches are painted from the live
          variables, so they follow the theme toolbar.
        </Prose>
        <Grid>
          {COLOURS.map(([variable, name]) => (
            <Swatch key={variable} varName={variable} name={name} />
          ))}
        </Grid>
        <Callout title="--ring is the bridge, --qx-color-focus-ring is the source">
          The <Code>focus-ring</Code> utilities and Tailwind&rsquo;s <Code>outline-ring</Code>,{" "}
          <Code>border-ring</Code> and <Code>ring-ring</Code> all read <Code>--ring</Code>, which is
          set from the focus-ring colour token. Reach for the utility in component code; reach for
          the token when you are writing raw CSS.
        </Callout>
      </Section>
    </Page>
  ),
};

export const Utilities: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The three focus utilities, each drawn permanently. They exist because one outline cannot fit every control: a menu clips an outset ring, and a field already has a border of its own.",
      },
    },
  },
  render: () => (
    <Page>
      <Section title="One recipe, three utilities">
        <Prose>
          Every Qeetrix control spells its focus state with one of these, so no component carries
          its own ring. The colour is set as a longhand, which is what lets an invalid control
          recolour it with <Code>aria-invalid:focus-visible:outline-destructive</Code> without
          restating the rest.
        </Prose>
        <TokenTable
          caption="The focus utilities, what each draws, and which controls use it."
          columns={["Utility", "What it draws", "Used by"]}
          rows={UTILITIES.map((entry) => ({
            token: entry.utility,
            cells: [
              <span key="draws" className="font-sans">
                {entry.draws}
              </span>,
              <span key="for" className="font-sans">
                {entry.for}
              </span>,
            ],
          }))}
        />
      </Section>

      <Section title="Why focus-ring-inset exists">
        <Prose>
          Menus, lists and the sidebar clip their content to their rounded edge. An outset ring on
          an item inside them is cut off at that edge — on the left it has lost its sides. The inset
          variant draws the same outline inside the item, so it survives the clip.
        </Prose>
        <div className="flex flex-wrap gap-8">
          {(
            [
              ["focus-ring — clipped", "focus-ring"],
              ["focus-ring-inset — intact", "focus-ring-inset"],
            ] as const
          ).map(([label, utility]) => (
            <figure key={utility} className="flex flex-col gap-2">
              <div className="w-56 overflow-hidden rounded-lg border border-border bg-popover text-sm text-popover-foreground">
                <div className="px-3 py-2">Change role</div>
                <div className={`px-3 py-2 ${utility}`}>Revoke sessions</div>
                <div className="px-3 py-2">Remove from organisation</div>
              </div>
              <figcaption className="font-mono text-xs text-muted-foreground">{label}</figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section title="Why focus-ring-field exists">
        <Prose>
          A text field already has an edge, so an outline two pixels outside it would draw a second
          border. <Code>focus-ring-field</Code> recolours the field&rsquo;s own border to{" "}
          <Code>--ring</Code> and adds a 1px outline flush against it: the same 2px of the same
          colour, without a double line.
        </Prose>
        <div className="flex flex-wrap items-end gap-8">
          <figure className="flex flex-col gap-2">
            <div className="flex h-9 w-60 items-center rounded-(--qx-component-input-corner) border border-control bg-(--qx-component-input-background) px-2.5 text-sm text-foreground">
              ada@qeet.in
            </div>
            <figcaption className="font-mono text-xs text-muted-foreground">rest</figcaption>
          </figure>
          <figure className="flex flex-col gap-2">
            <div className="focus-ring-field flex h-9 w-60 items-center rounded-(--qx-component-input-corner) border bg-(--qx-component-input-background) px-2.5 text-sm text-foreground">
              ada@qeet.in
            </div>
            <figcaption className="font-mono text-xs text-muted-foreground">
              focus-ring-field
            </figcaption>
          </figure>
        </div>
      </Section>
    </Page>
  ),
};

export const FocusVisible: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Why every Qeetrix component styles `:focus-visible` and none of them style `:focus`. Click the two buttons, then Tab to them, and compare.",
      },
    },
  },
  render: () => (
    <Page>
      <Section title=":focus fires for the mouse. :focus-visible does not.">
        <Prose>
          A mouse user who clicks a button does not need to be told where their pointer just was,
          and a ring that appears on every click reads as a bug. <Code>:focus-visible</Code> is the
          browser&rsquo;s own heuristic for &ldquo;this focus came from the keyboard, or from
          somewhere the user needs the feedback&rdquo; — so it is the only focus pseudo-class
          Qeetrix components style.
        </Prose>
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground outline-none focus:focus-ring"
            >
              Styles :focus
            </button>
            <span className="text-xs text-muted-foreground">Rings on click and on Tab.</span>
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground outline-none focus-visible:focus-ring"
            >
              Styles :focus-visible
            </button>
            <span className="text-xs text-muted-foreground">Rings on Tab only.</span>
          </div>
        </div>
        <Callout title="Never remove the ring without replacing it">
          <Code>outline-none</Code> appears on many Qeetrix controls — always paired with one of the{" "}
          <Code>focus-visible:focus-ring</Code> utilities in the same class list. Removing the
          browser default is fine; removing the affordance is a WCAG 2.4.7 failure and makes the
          component unusable without a pointer.
        </Callout>
      </Section>

      <Section title="One ring, many controls">
        <Prose>
          Tab through these. They are different components with different shapes, but the indicator
          is the same colour and the same 2px weight on all of them. The buttons, the checkbox, the
          switch and the link draw <Code>focus-ring</Code>; the input draws{" "}
          <Code>focus-ring-field</Code>, so its own border becomes the indicator.
        </Prose>
        <div className="flex flex-wrap items-center gap-5">
          <Button>Primary</Button>
          <Button variant="outline">Outline</Button>
          <Field className="w-56">
            <FieldLabel htmlFor="focus-demo-email">Work email</FieldLabel>
            <Input id="focus-demo-email" type="email" placeholder="ada@qeet.in" />
          </Field>
          <div className="flex items-center gap-2">
            <Checkbox id="focus-demo-terms" />
            <Label htmlFor="focus-demo-terms">Remember this device</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="focus-demo-alerts" />
            <Label htmlFor="focus-demo-alerts">Security alerts</Label>
          </div>
          <Link href="#">A link</Link>
        </div>
      </Section>
    </Page>
  ),
};

export const KeyboardNavigation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The rules that decide what Tab reaches, in what order, and what happens under a forced-colors palette.",
      },
    },
  },
  render: () => (
    <Page>
      <Section title="Tab order is DOM order">
        <Prose>
          Qeetrix never sets a positive <Code>tabindex</Code>. Ordering focus by hand desynchronises
          the keyboard path from the reading order the moment anything is inserted, and it is almost
          always a sign the DOM is in the wrong order. Reorder the markup, or use CSS ordering only
          where the visual result still matches the source.
        </Prose>
        <ol className="flex flex-col gap-2 text-sm text-muted-foreground">
          <li>
            <Code>tabindex=&quot;0&quot;</Code> — in the natural order. For custom widgets that need
            to be reachable.
          </li>
          <li>
            <Code>tabindex=&quot;-1&quot;</Code> — focusable by script only. This is the roving
            pattern: a menu, a tab list or a toolbar is one Tab stop, and arrow keys move within it.
          </li>
          <li>
            <Code>tabindex=&quot;1&quot;</Code> and above — never. It jumps ahead of every natural
            stop on the page, including ones the component does not own.
          </li>
        </ol>
      </Section>

      <Section title="Composite widgets are one stop">
        <Prose>
          A toolbar with eight buttons should not cost eight presses of Tab. Components that manage
          a roving <Code>tabindex</Code> — menus, tabs, radio groups, toolbars, tree views — take a
          single stop and hand the arrow keys the job of moving inside. Tab then means &ldquo;leave
          this widget&rdquo;, which is what a keyboard user expects it to mean.
        </Prose>
      </Section>

      <Section title="Skip navigation">
        <Prose>
          The escape hatch for keyboard users who would otherwise Tab through an entire navigation
          rail on every page. <Code>SkipNav</Code> is visually hidden until focused, and it sits on{" "}
          <Code>--qx-z-skip-nav</Code> — the highest non-debug rung of the stacking ladder —
          precisely so no overlay can paint over it.
        </Prose>
      </Section>

      <Section title="Forced colors">
        <Prose>
          When a Windows high-contrast theme is active, authored colour is discarded and the
          indicator would vanish with it. The base layer of <Code>@qeetrix/ui/styles.css</Code>{" "}
          re-points every <Code>:focus-visible</Code> outline at the system <Code>Highlight</Code>{" "}
          colour. Because the indicator was already an outline, nothing else has to change — a
          box-shadow ring would simply have been stripped.
        </Prose>
        <TokenTable
          caption="The :focus-visible rule applied under forced-colors: active."
          columns={["Declaration", "Value"]}
          rows={[
            {
              token: "outline",
              cells: ["var(--qx-focus-outline-width) solid Highlight !important"],
            },
          ]}
        />
        <Callout title="The offset is deliberately not forced">
          Colour and width are system decisions under forced colors; the offset is part of each
          component&rsquo;s recipe. <Code>focus-ring-inset</Code> draws inside a clipping container
          precisely so the indicator is not cut off, and forcing the outset value here would undo
          that.
        </Callout>
      </Section>
    </Page>
  ),
};
