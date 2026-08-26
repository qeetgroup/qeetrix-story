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
          "Focus is a contract, not a per-component decision. Four geometry tokens (`--qx-focus-ring-width`, `--qx-focus-outline-width`, `--qx-focus-offset`, `--qx-focus-ring-style`) describe the shape of the affordance and are theme-agnostic; one colour token (`--qx-color-focus-ring`, surfaced to Tailwind as `--ring`) carries the hue and does change with the theme. Every interactive component draws from those, so the ring is the same size, in the same place, on a button, an input, a switch and a link. Under `forced-colors: active` the whole thing is replaced by a system `Highlight` outline built from the same width and offset tokens.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

const GEOMETRY = [
  {
    token: "--qx-focus-ring-width",
    value: "3px",
    alias: "stroke.width.thick",
    note: "The ring components draw on :focus-visible. Spelled ring-3, or ring-[length:var(--qx-focus-ring-width)] where the token is read directly.",
  },
  {
    token: "--qx-focus-outline-width",
    value: "2px",
    alias: "stroke.width.thin",
    note: "The narrower outline used where an outline replaces a ring — notably the forced-colors fallback.",
  },
  {
    token: "--qx-focus-offset",
    value: "2px",
    alias: "space.xxs",
    note: "Gap between the control edge and the ring, so the affordance never sits on the border it is meant to be distinguishable from.",
  },
  {
    token: "--qx-focus-ring-style",
    value: "solid",
    alias: "stroke.solid",
    note: "Line style. Solid — a dashed focus ring reads as a drag target.",
  },
];

const COLOURS: Array<[string, string]> = [
  ["--qx-color-focus-ring", "focus-ring"],
  ["--ring", "ring (bridge)"],
  ["--qx-color-border-focused", "border-focused"],
  ["--qx-component-input-border-focus", "input-border-focus"],
];

/** The ring rendered permanently, so the anatomy is visible without holding focus. */
function RingAnatomy() {
  return (
    <div className="flex flex-wrap items-center gap-10 py-4">
      <div
        className="rounded-(--qx-component-button-corner) bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        style={{
          outline:
            "var(--qx-focus-ring-width) var(--qx-focus-ring-style) var(--qx-color-focus-ring)",
          outlineOffset: "var(--qx-focus-offset)",
        }}
      >
        Always-on ring
      </div>
      <dl className="grid grid-cols-[auto_auto] gap-x-4 gap-y-1 text-xs">
        <dt className="text-muted-foreground">width</dt>
        <dd className="font-mono">3px · --qx-focus-ring-width</dd>
        <dt className="text-muted-foreground">offset</dt>
        <dd className="font-mono">2px · --qx-focus-offset</dd>
        <dt className="text-muted-foreground">style</dt>
        <dd className="font-mono">solid · --qx-focus-ring-style</dd>
        <dt className="text-muted-foreground">colour</dt>
        <dd className="font-mono">--qx-color-focus-ring</dd>
      </dl>
    </div>
  );
}

export const Ring: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The ring, drawn permanently from its tokens so the geometry can be inspected without holding focus, alongside the four tokens that define it.",
      },
    },
  },
  render: () => (
    <Page>
      <Section title="Anatomy">
        <Prose>
          Three pixels of solid colour, offset two pixels from the control. The offset matters more
          than it sounds: without it the ring merges with the control&rsquo;s own border and stops
          being a separate signal, which is exactly the case a low-vision user needs it to be.
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
          The one part of the contract that is theme-varying. It is the Qeet brand hue rather than a
          neutral, which is what makes a focused control identifiable at a glance across a dense
          form. Swatches are painted from the live variables, so they follow the theme toolbar.
        </Prose>
        <Grid>
          {COLOURS.map(([variable, name]) => (
            <Swatch key={variable} varName={variable} name={name} />
          ))}
        </Grid>
        <Callout title="--ring is the bridge, --qx-color-focus-ring is the source">
          Tailwind&rsquo;s <Code>ring-ring</Code>, <Code>border-ring</Code> and{" "}
          <Code>outline-ring</Code> utilities are generated from <Code>--color-ring</Code>, which
          resolves to <Code>--ring</Code>, which is set from the focus-ring colour token. Reach for
          the utility in component code; reach for the token when you are writing raw CSS.
        </Callout>
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
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground outline-none focus:ring-3 focus:ring-ring/50"
            >
              Styles :focus
            </button>
            <span className="text-xs text-muted-foreground">Rings on click and on Tab.</span>
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Styles :focus-visible
            </button>
            <span className="text-xs text-muted-foreground">Rings on Tab only.</span>
          </div>
        </div>
        <Callout title="Never remove the ring without replacing it">
          <Code>outline-none</Code> appears on almost every Qeetrix control — always paired with a
          <Code>focus-visible:ring-*</Code> in the same class list. Removing the browser default is
          fine; removing the affordance is a WCAG 2.4.7 failure and makes the component unusable
          without a pointer.
        </Callout>
      </Section>

      <Section title="One ring, many controls">
        <Prose>
          Tab through these. They are different components with different shapes, but the ring is
          the same width, the same offset and the same colour on all of them, because they all
          resolve the same tokens.
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
          When a Windows high-contrast theme is active, authored colour is discarded and the ring
          would vanish with it. The base layer replaces it with a system outline built from the same
          geometry tokens, so the affordance survives even though the hue does not.
        </Prose>
        <TokenTable
          caption="The :focus-visible rule applied under forced-colors: active."
          columns={["Declaration", "Value"]}
          rows={[
            { token: "outline", cells: ["var(--qx-focus-outline-width) solid Highlight"] },
            { token: "outline-offset", cells: ["var(--qx-focus-offset)"] },
          ]}
        />
      </Section>
    </Page>
  ),
};
