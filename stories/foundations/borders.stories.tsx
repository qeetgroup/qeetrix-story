import type { Meta, StoryObj } from "@storybook/react-vite";

import { Grid, Page, Section, Swatch } from "../_helpers";
import { Callout, Code, Prose, TokenTable } from "./_foundation";

const meta: Meta = {
  title: "Foundations/Borders",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A border in Qeetrix is three decisions with three token families behind them: how thick (`--qx-stroke-width-*`), what line (`--qx-stroke-*`), and what it means (`--qx-color-border-*`). The colour roles are the interesting part — `default`, `subtle` and `strong` are a hierarchy, `hover` and `focused` are states, and `danger`/`success`/`warning`/`info` are status. Because the host-global base layer applies `border-border` to every element, a bare `border` utility already lands on the right colour and only the width has to be stated. Corner rounding is the fourth decision and has its own semantic layer, `--qx-corner-*`, on top of the raw radius ramp documented in Spacing & Radius.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

const WIDTHS = [
  {
    token: "--qx-stroke-width-hairline",
    value: "1px",
    utility: "border",
    note: "The default. Every separator, card edge and input outline.",
  },
  {
    token: "--qx-stroke-width-thin",
    value: "2px",
    utility: "border-2",
    note: "Emphasis — a selected card, an active step in a stepper.",
  },
  {
    token: "--qx-stroke-width-thick",
    value: "3px",
    utility: "border-4 / ring-3",
    note: "What --qx-focus-ring-width aliases. Rarely a border; almost always the focus ring.",
  },
];

const STYLES = [
  { token: "--qx-stroke-solid", value: "solid", note: "Everything real and present." },
  {
    token: "--qx-stroke-dashed",
    value: "dashed",
    note: "Provisional — drop zones, placeholders, empty states.",
  },
  {
    token: "--qx-stroke-dotted",
    value: "dotted",
    note: "Annotation — spans a tooltip or definition is attached to.",
  },
];

const COLOUR_ROLES: Array<[string, string]> = [
  ["--qx-color-border-subtle", "subtle"],
  ["--qx-color-border-default", "default"],
  ["--qx-color-border-strong", "strong"],
  ["--qx-color-border-hover", "hover"],
  ["--qx-color-border-focused", "focused"],
  ["--qx-color-border-danger", "danger"],
  ["--qx-color-border-success", "success"],
  ["--qx-color-border-warning", "warning"],
  ["--qx-color-border-info", "info"],
];

const CORNERS = [
  {
    token: "--qx-corner-none",
    value: "0px",
    note: "Flush edges — full-bleed panels, table cells.",
  },
  {
    token: "--qx-corner-xs",
    value: "2px",
    note: "The tooltip arrow, and other geometry too small to round properly.",
  },
  { token: "--qx-corner-sm", value: "4px", note: "Dense chrome." },
  {
    token: "--qx-corner-base",
    value: "0.45rem",
    note: "The root radius every other role is derived from.",
  },
  { token: "--qx-corner-chip", value: "var(--radius-md)", note: "Badges and tags." },
  { token: "--qx-corner-control", value: "var(--radius-lg)", note: "Buttons and other controls." },
  { token: "--qx-corner-field", value: "var(--radius-lg)", note: "Inputs, selects, textareas." },
  { token: "--qx-corner-overlay", value: "var(--radius-lg)", note: "Menus, popovers, dialogs." },
  {
    token: "--qx-corner-surface",
    value: "var(--radius-xl)",
    note: "Cards and panels — the largest role.",
  },
  { token: "--qx-corner-pill", value: "9999px", note: "Fully rounded ends." },
  { token: "--qx-corner-circle", value: "50%", note: "Avatars and dots." },
];

export const Stroke: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Width and line style — the two theme-agnostic halves of a border. Both scales are small on purpose: three widths and three styles is enough vocabulary, and a fourth of either starts to mean nothing.",
      },
    },
  },
  render: () => (
    <Page>
      <Section title="Width">
        <div className="flex flex-wrap gap-8">
          {WIDTHS.map((width) => (
            <div key={width.token} className="flex flex-col items-center gap-2">
              <div
                className="size-20 rounded-(--qx-corner-surface) border-border bg-card"
                style={{ borderWidth: `var(${width.token})`, borderStyle: "solid" }}
              />
              <code className="text-xs text-muted-foreground">{width.value}</code>
            </div>
          ))}
        </div>
        <TokenTable
          caption="--qx-stroke-width-* — raw widths that the focus and border roles alias."
          columns={["Token", "Value", "Utility", "What it is for"]}
          rows={WIDTHS.map((width) => ({
            token: width.token,
            cells: [
              width.value,
              width.utility,
              <span key={width.token} className="font-sans">
                {width.note}
              </span>,
            ],
          }))}
        />
      </Section>

      <Section title="Line style">
        <div className="flex flex-wrap gap-8">
          {STYLES.map((style) => (
            <div key={style.token} className="flex flex-col items-center gap-2">
              <div
                className="size-20 rounded-(--qx-corner-surface) border-2 border-border bg-card"
                style={{ borderStyle: `var(${style.token})` }}
              />
              <code className="text-xs text-muted-foreground">{style.value}</code>
            </div>
          ))}
        </div>
        <TokenTable
          caption="--qx-stroke-* — DTCG strokeStyle tokens, mapping straight to CSS border-style."
          columns={["Token", "Value", "What it signals"]}
          rows={STYLES.map((style) => ({
            token: style.token,
            cells: [
              style.value,
              <span key={style.token} className="font-sans">
                {style.note}
              </span>,
            ],
          }))}
        />
      </Section>
    </Page>
  ),
};

export const ColourRoles: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Nine border roles, painted from their live variables so they follow the theme toolbar. Hierarchy, state and status are three separate axes — do not borrow across them.",
      },
    },
  },
  render: () => (
    <Page>
      <Section title="Border roles">
        <Prose>
          <Code>subtle</Code>, <Code>default</Code> and <Code>strong</Code> are a hierarchy: use{" "}
          <Code>subtle</Code> for divisions inside a surface that already has an edge, and{" "}
          <Code>strong</Code> only when a border has to compete with a busy background.{" "}
          <Code>hover</Code> and <Code>focused</Code> are interaction states. <Code>danger</Code>,{" "}
          <Code>success</Code>, <Code>warning</Code> and <Code>info</Code> carry status — and status
          must never be carried by the border alone, since a colour-blind user reading a form has
          nothing else to go on.
        </Prose>
        <Grid>
          {COLOUR_ROLES.map(([variable, name]) => (
            <Swatch key={variable} varName={variable} name={name} />
          ))}
        </Grid>
      </Section>

      <Section title="Roles in place">
        <div className="grid max-w-3xl gap-3 sm:grid-cols-3">
          {(
            [
              ["subtle", "--qx-color-border-subtle"],
              ["default", "--qx-color-border-default"],
              ["strong", "--qx-color-border-strong"],
              ["danger", "--qx-color-border-danger"],
              ["success", "--qx-color-border-success"],
              ["info", "--qx-color-border-info"],
            ] as const
          ).map(([name, variable]) => (
            <div
              key={name}
              className="rounded-(--qx-corner-surface) border bg-card p-4 text-sm text-card-foreground"
              style={{ borderColor: `var(${variable})` }}
            >
              <p className="font-medium">{name}</p>
              <code className="text-[10px] text-muted-foreground">{variable}</code>
            </div>
          ))}
        </div>
        <Callout title="border alone already has a colour">
          The base layer applies <Code>border-border</Code> to <Code>*</Code>, so a bare{" "}
          <Code>border</Code> utility picks up the default role without a colour class. That is why
          Qeetrix component source so often reads <Code>border</Code> rather than{" "}
          <Code>border border-border</Code> — and why writing <Code>border-0</Code> is the correct
          way to remove one, not overriding the colour to transparent.
        </Callout>
      </Section>

      <Section title="Bridge variables">
        <TokenTable
          caption="The shadcn-compatible bridge variables the Tailwind utilities are generated from."
          columns={["Utility", "Theme variable", "Source token"]}
          rows={[
            {
              token: "border-border",
              cells: ["--color-border → --border", "same value as --qx-color-border-default"],
            },
            {
              token: "border-input",
              cells: ["--color-input → --input", "same value as --qx-color-border-default"],
            },
            {
              token: "border-ring",
              cells: ["--color-ring → --ring", "same value as --qx-color-focus-ring"],
            },
          ]}
        />
        <Callout title="Borders are what survives forced colors">
          Under <Code>forced-colors: active</Code> every <Code>box-shadow</Code> is stripped and{" "}
          <Code>--border</Code> is remapped to <Code>CanvasText</Code>. A surface that relies on a
          shadow for separation disappears; a surface with a real border does not. This is why every
          Qeetrix elevation value carries a hairline <Code>0 0 0 1px</Code> ring, and why a card
          that matters should also carry a border.
        </Callout>
      </Section>
    </Page>
  ),
};

export const CornerRoles: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The semantic rounding layer. Components name what they are — `--qx-corner-field`, `--qx-corner-surface` — rather than picking a radius, so the whole product can be squared off or softened by moving `--radius` alone.",
      },
    },
  },
  render: () => (
    <Page>
      <Section title="Corner roles">
        <Prose>
          Every role except the fixed ones derives from <Code>--radius</Code>, which is{" "}
          <Code>0.45rem</Code>. The derived steps (<Code>--radius-sm</Code> through{" "}
          <Code>--radius-4xl</Code>) are multiples of it, so changing that one value rescales the
          entire product&rsquo;s roundness proportionally rather than flattening it.
        </Prose>
        <div className="flex flex-wrap gap-6">
          {CORNERS.map((corner) => (
            <div key={corner.token} className="flex w-24 flex-col items-center gap-2">
              <div
                className="size-16 border border-border bg-muted"
                style={{ borderRadius: `var(${corner.token})` }}
              />
              <code className="w-full truncate text-center text-[10px] text-muted-foreground">
                {corner.token.replace("--qx-corner-", "")}
              </code>
            </div>
          ))}
        </div>
        <TokenTable
          caption="--qx-corner-* — the semantic rounding roles."
          columns={["Token", "Value", "What uses it"]}
          rows={CORNERS.map((corner) => ({
            token: corner.token,
            cells: [
              corner.value,
              <span key={corner.token} className="font-sans">
                {corner.note}
              </span>,
            ],
          }))}
        />
      </Section>

      <Section title="Component corners">
        <Prose>
          Components with their own geometry go one layer further and read a component token, so a
          single control can be retuned without moving a shared role.
        </Prose>
        <TokenTable
          caption="Component-layer corner tokens and the role or expression behind each."
          columns={["Component token", "Resolves to"]}
          rows={[
            { token: "--qx-component-button-corner", cells: ["var(--radius-lg)"] },
            { token: "--qx-component-button-corner-sm", cells: ["min(var(--radius-md), 12px)"] },
            { token: "--qx-component-button-corner-xs", cells: ["min(var(--radius-md), 10px)"] },
            { token: "--qx-component-input-corner", cells: ["var(--radius-lg)"] },
            { token: "--qx-component-card-corner", cells: ["var(--radius-xl)"] },
            { token: "--qx-component-dialog-corner", cells: ["var(--radius-lg)"] },
            { token: "--qx-component-badge-corner", cells: ["var(--radius-md)"] },
            { token: "--qx-component-kbd-corner", cells: ["min(var(--radius-md), 6px)"] },
          ]}
        />
        <Callout title="Why the min() clamps exist">
          A small control rounded by the same absolute radius as a large one looks like a pill. The{" "}
          <Code>min()</Code> expressions cap the radius on the compact sizes so an extra-small
          button and a keyboard shortcut chip stay recognisably rectangular even if{" "}
          <Code>--radius</Code> is turned up.
        </Callout>
      </Section>
    </Page>
  ),
};
