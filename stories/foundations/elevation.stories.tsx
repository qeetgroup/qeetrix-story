import { SHADOW } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Page, Section } from "../_helpers";
import { Callout, Code, Prose, TokenTable } from "./_foundation";

const meta: Meta = {
  title: "Foundations/Elevation",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Elevation is the *role* a surface plays; shadow is the value it renders with. A component picks `raised`, `overlay` or `modal` — never a shadow number — so the whole ladder can be retuned in one place. Semantic roles live in `--qx-elevation-*`, the raw values in `--qx-shadow-*`, and `@qeetrix/ui/styles.css` overrides Tailwind's `shadow-2xs`…`shadow-xl` scale so even the generic utilities land on the Qeetrix ladder. Every shadow is a stack of two soft drops plus a hairline `0 0 0 1px` ring, which is what keeps a card legible on a tinted surface without a visible border.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

/** The design ladder — what a component actually asks for. */
const ROLES = [
  {
    role: "flat",
    cssVar: "--qx-elevation-flat",
    utility: "shadow-none",
    use: "In-flow content. The default; not everything needs to leave the page.",
  },
  {
    role: "inset",
    cssVar: "--qx-elevation-inset",
    utility: "shadow-inset-subtle",
    use: "Wells and recessed tracks — the one role that reads as below the surface.",
  },
  {
    role: "raised",
    cssVar: "--qx-elevation-raised",
    utility: "shadow-rest",
    use: "Cards and panels sitting on the canvas at rest.",
  },
  {
    role: "hover",
    cssVar: "--qx-elevation-hover",
    utility: "shadow-hover",
    use: "The lift a raised surface takes on pointer hover or drag.",
  },
  {
    role: "overlay",
    cssVar: "--qx-elevation-overlay",
    utility: "shadow-popover",
    use: "Menus, popovers, tooltips, comboboxes — anything floating over the page.",
  },
  {
    role: "modal",
    cssVar: "--qx-elevation-modal",
    utility: "shadow-modal",
    use: "Dialogs and drawers, which sit above a scrim and need the deepest separation.",
  },
] as const;

/** The Tailwind-facing ramp — a neutral 2xs…xl scale for surfaces with no role. */
const RAMP = ["2xs", "xs", "sm", "md", "lg", "xl"] as const;

function Specimen({
  label,
  cssVar,
  inset = false,
}: {
  label: string;
  cssVar: string;
  inset?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`flex h-20 w-full items-center justify-center rounded-xl ${
          inset ? "bg-muted" : "bg-card"
        }`}
        style={{ boxShadow: `var(${cssVar})` }}
      />
      <code className="text-xs text-muted-foreground">{label}</code>
    </div>
  );
}

export const Roles: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The six semantic roles, each painted from its live CSS variable so the ladder re-renders with the theme toolbar.",
      },
    },
  },
  render: () => (
    <Page>
      <Section title="The elevation ladder">
        <Prose>
          Read top to bottom as distance from the page. A surface only climbs the ladder when it
          genuinely floats above what it covers — depth is a signal, and a page where everything is
          raised signals nothing.
        </Prose>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
          {ROLES.map((role) => (
            <Specimen
              key={role.role}
              label={role.role}
              cssVar={role.cssVar}
              inset={role.role === "inset"}
            />
          ))}
        </div>
      </Section>

      <Section title="Semantic roles">
        <TokenTable
          caption="--qx-elevation-* — the roles, and the utility each one is exposed as."
          columns={["Role", "CSS variable", "Utility", "When to use it"]}
          rows={ROLES.map((role) => ({
            token: role.role,
            cells: [role.cssVar, role.utility, <span key={role.role}>{role.use}</span>],
          }))}
        />
        <Callout title="subtle and low exist too">
          <Code>--qx-elevation-subtle</Code> and <Code>--qx-elevation-low</Code> alias the{" "}
          <Code>xs</Code> and <Code>sm</Code> steps of the ramp below. They are there for surfaces
          that need a hint of separation without joining the raised/overlay/modal conversation.
        </Callout>
      </Section>
    </Page>
  ),
};

export const Ramp: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The generic Tailwind scale. `@qeetrix/ui/styles.css` remaps `--shadow-2xs`…`--shadow-xl` onto `--qx-elevation-ramp-*`, so `shadow-md` in product code is a Qeetrix shadow rather than a stock one.",
      },
    },
  },
  render: () => (
    <Page>
      <Section title="Shadow ramp">
        <Prose>
          Six evenly-spaced steps for surfaces that have no semantic role. Prefer a role where one
          fits — the ramp is the escape hatch, not the front door.
        </Prose>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
          {RAMP.map((step) => (
            <Specimen key={step} label={`shadow-${step}`} cssVar={`--qx-elevation-ramp-${step}`} />
          ))}
        </div>
      </Section>

      <Section title="Ramp tokens">
        <TokenTable
          caption="--qx-elevation-ramp-* — the Tailwind shadow scale, retuned."
          columns={["Utility", "Semantic alias", "Primitive"]}
          rows={RAMP.map((step) => ({
            token: `shadow-${step}`,
            cells: [`--qx-elevation-ramp-${step}`, `--qx-shadow-ramp-${step}`],
          }))}
        />
      </Section>
    </Page>
  ),
};

export const Values: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The raw values behind the roles, as published in the typed `SHADOW` constant — the same numbers the CSS variables resolve to.",
      },
    },
  },
  render: () => (
    <Page>
      <Section title="Primitive shadow values">
        <Prose>
          Exported from <Code>@qeetrix/ui</Code> as <Code>SHADOW</Code>, for the rare case where a
          shadow has to be composed in JavaScript — a canvas, an inline style computed at runtime, a
          chart tooltip rendered outside the component tree.
        </Prose>
        <TokenTable
          caption="SHADOW — typed values, generated from the same token source as the CSS."
          columns={["Constant", "CSS variable", "Value"]}
          rows={Object.entries(SHADOW).map(([name, value]) => ({
            token: `SHADOW.${name}`,
            cells: [
              `--qx-shadow-${name === "insetSubtle" ? "inset-subtle" : name}`,
              <span key={name} className="break-all">
                {value}
              </span>,
            ],
          }))}
        />
      </Section>

      <Section title="Component elevation">
        <Prose>
          Components that own their own depth read a component-layer token rather than a role
          directly, which is what lets a single component be retuned without moving the ladder.
        </Prose>
        <TokenTable
          caption="Component-layer elevation tokens and the role each resolves to."
          columns={["Component token", "Resolves to"]}
          rows={[
            { token: "--qx-component-card-elevation", cells: ["--qx-elevation-raised"] },
            { token: "--qx-component-card-elevation-hover", cells: ["--qx-elevation-hover"] },
            { token: "--qx-component-dialog-elevation", cells: ["--qx-elevation-modal"] },
          ]}
        />
        <Callout title="Shadows disappear under forced colors">
          The base layer sets <Code>box-shadow: none</Code> on everything inside a{" "}
          <Code>forced-colors: active</Code> media query, because a Windows high-contrast palette
          has no way to render a soft drop. Depth must therefore never be the only thing separating
          two surfaces — the hairline ring in every Qeetrix shadow is a border in disguise for
          exactly this reason, and a real <Code>border</Code> is what survives.
        </Callout>
      </Section>
    </Page>
  ),
};
