import tokens from "@qeetrix/ui/tokens.json";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Page, Section } from "../_helpers";
import { Callout, Code, Prose, TokenTable } from "./_foundation";

const meta: Meta = {
  title: "Foundations/Z-Index",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "One ladder, fifteen rungs, spaced a thousand apart. Every floating surface in Qeetrix reads `--qx-z-*` (via Tailwind's `z-(--qx-z-popover)` arbitrary-property syntax) instead of picking a number, which is what stops a codebase accumulating `z-index: 9999` as the only reliable way to be on top. The gaps are deliberate: a product can slot its own layer between two rungs without touching the design system. Code that has to compute a layer — a portal, a virtualiser — reads the variable, or the number from `@qeetrix/ui/tokens.json` (`z`).",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

interface Layer {
  /** The rung's name in `tokens.json`; its CSS variable is `--qx-z-<token>`. */
  token: keyof typeof tokens.light.z;
  usedBy: string;
}

/** The ladder in ascending order, with what actually reads each rung today. */
const LADDER: Layer[] = [
  { token: "base", usedBy: "In-flow content. Reserved as the floor." },
  { token: "dropdown", usedBy: "Reserved — no component reads it yet." },
  { token: "sticky", usedBy: "AppShell header" },
  { token: "fixed", usedBy: "Sidebar, FloatingWindow, ActionBar" },
  { token: "modal-backdrop", usedBy: "Dialog, AlertDialog" },
  { token: "modal", usedBy: "Dialog, AlertDialog" },
  { token: "drawer-backdrop", usedBy: "Sheet, Drawer" },
  {
    token: "drawer",
    usedBy: "Sheet, Drawer — and a nested Dialog or Sheet, lifted onto it",
  },
  {
    token: "popover",
    usedBy:
      "Popover, Tooltip, HoverCard, DropdownMenu, ContextMenu, Menubar, NavigationMenu, Select, Combobox, Autocomplete, MentionInput",
  },
  { token: "toast", usedBy: "Toast viewport" },
  {
    token: "command-palette",
    usedBy: "Reserved — no component reads it yet.",
  },
  { token: "tour-backdrop", usedBy: "Tour" },
  { token: "tour", usedBy: "Tour" },
  { token: "skip-nav", usedBy: "SkipNav" },
  {
    token: "debug",
    usedBy: "Development overlays only. Never ship on it.",
  },
];

/** The six rungs worth stacking visually — the rest read the same at a glance. */
const STACK = [
  { label: "fixed", cssVar: "--qx-z-fixed", offset: 0, tint: "bg-muted" },
  { label: "modal-backdrop", cssVar: "--qx-z-modal-backdrop", offset: 28, tint: "bg-secondary" },
  { label: "modal", cssVar: "--qx-z-modal", offset: 56, tint: "bg-card" },
  { label: "popover", cssVar: "--qx-z-popover", offset: 84, tint: "bg-accent" },
  { label: "toast", cssVar: "--qx-z-toast", offset: 112, tint: "bg-primary/15" },
  { label: "skip-nav", cssVar: "--qx-z-skip-nav", offset: 140, tint: "bg-success/15" },
];

export const Ladder: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The stack, rendered as a stack. Each card sets only `z-index` from its token — the paint order you see is the paint order a real overlay gets.",
      },
    },
  },
  render: () => (
    <Page>
      <Section title="Stacking order">
        <Prose>
          Cards are laid out in source order, front to back, and reordered purely by{" "}
          <Code>z-index</Code>. The rung a surface sits on is a design decision — a toast has to
          survive a dialog, and a skip link has to survive everything, or keyboard users cannot
          escape a full-screen overlay.
        </Prose>
        <div className="relative isolate h-64">
          {STACK.map((layer) => (
            <div
              key={layer.label}
              className={`absolute flex h-24 w-64 flex-col justify-center rounded-xl border border-border px-4 shadow-popover ${layer.tint}`}
              style={{
                zIndex: `var(${layer.cssVar})`,
                insetInlineStart: `${layer.offset}px`,
                top: `${layer.offset * 0.55}px`,
              }}
            >
              <span className="text-sm font-medium text-foreground">{layer.label}</span>
              <code className="text-[10px] text-muted-foreground">{layer.cssVar}</code>
            </div>
          ))}
        </div>
      </Section>

      <Section title="The full ladder">
        <TokenTable
          caption="--qx-z-* in ascending order, with current consumers."
          columns={["CSS variable", "Value", "Read by"]}
          rows={LADDER.map((layer) => ({
            token: `--qx-z-${layer.token}`,
            cells: [
              tokens.light.z[layer.token],
              <span key={layer.token} className="font-sans">
                {layer.usedBy}
              </span>,
            ],
          }))}
        />
      </Section>
    </Page>
  ),
};

export const Rules: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The three things that actually go wrong with layering, and what the ladder does about each.",
      },
    },
  },
  render: () => (
    <Page>
      <Section title="Backdrop and content are two rungs, not one">
        <Prose>
          A dialog owns <Code>--qx-z-modal-backdrop</Code> and <Code>--qx-z-modal</Code>; a sheet
          owns <Code>--qx-z-drawer-backdrop</Code> and <Code>--qx-z-drawer</Code>. The backdrop
          always sits exactly one rung below its own surface, so a surface is never dimmed by the
          scrim it casts — and because the drawer pair sits above the modal pair, a sheet opened
          from inside a dialog lands on top of it with no per-instance z-index anywhere. The reverse
          case is handled too: a nested dialog or sheet lifts onto the drawer rung, backdrop and
          all, so a dialog opened from a sheet dims its parent instead of painting under it.
        </Prose>
      </Section>

      <Section title="Skip navigation is the top of the ladder">
        <Prose>
          <Code>--qx-z-skip-nav</Code> sits above every overlay except the debug rung. That is an
          accessibility requirement, not a nicety: a skip link that a modal can paint over is a
          keyboard trap with extra steps.
        </Prose>
        <Callout title="--qx-z-debug is not a production layer">
          It exists so a development overlay — a grid, a hit-box inspector, a performance HUD — has
          somewhere to live that is unambiguously above everything else. Shipping a component on it
          removes the only rung that is guaranteed to win.
        </Callout>
      </Section>

      <Section title="A stacking context beats any number">
        <Prose>
          <Code>z-index</Code> only orders siblings within the same stacking context, so a value of
          1800 inside a parent with <Code>transform</Code>, <Code>filter</Code>,{" "}
          <Code>opacity</Code> below 1, or <Code>isolation: isolate</Code> cannot escape that
          parent. This is why the overlay components render through a portal instead of in place,
          and why raising a number is almost never the fix for something appearing behind something
          else.
        </Prose>
        <TokenTable
          caption="Common ways a new stacking context appears without anyone asking for one."
          columns={["Property", "Creates a context when"]}
          rows={[
            { token: "transform", cells: ["any value other than none — including translate-*"] },
            { token: "filter", cells: ["any value other than none — including backdrop blur"] },
            { token: "opacity", cells: ["any value below 1 — the Tailwind opacity utilities"] },
            { token: "isolation", cells: ["isolate — the Tailwind isolate utility"] },
            { token: "position", cells: ["fixed or sticky, unconditionally"] },
            { token: "will-change", cells: ["it names a property that would create one"] },
          ]}
        />
      </Section>
    </Page>
  ),
};
