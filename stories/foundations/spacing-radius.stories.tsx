import type { Meta, StoryObj } from "@storybook/react-vite";

import { Page, Section } from "../_helpers";

const meta: Meta = {
  title: "Foundations/Spacing & Radius",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The spatial tokens that give Qeetrix its rhythm: a 4px-based spacing scale (`--qx-space-*`) for padding, gaps and layout, and a radius scale (`--qx-radii-*`) for consistent corner rounding. Components reference these tokens rather than hard-coded pixels, so density and roundness stay uniform and are tunable from one place.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

const SPACE = ["xxs", "xs", "s", "m", "l", "xl", "2xl", "3xl", "4xl", "5xl"];
const RADII = ["none", "xs", "s", "m", "l", "xl", "2xl"];

export const SpacingAndRadius: Story = {
  render: () => (
    <Page>
      <Section title="Spacing (4px base)">
        <div className="flex flex-col gap-2">
          {SPACE.map((s) => (
            <div key={s} className="flex items-center gap-4">
              <code className="w-16 text-xs text-muted-foreground">{s}</code>
              <div
                className="h-4 rounded-sm bg-primary"
                style={{ width: `var(--qx-space-${s})` }}
              />
            </div>
          ))}
        </div>
      </Section>
      <Section title="Radius">
        <div className="flex flex-wrap gap-6">
          {RADII.map((r) => (
            <div key={r} className="flex flex-col items-center gap-2">
              <div
                className="size-16 border border-border bg-muted"
                style={{ borderRadius: `var(--qx-radii-${r})` }}
              />
              <code className="text-xs text-muted-foreground">{r}</code>
            </div>
          ))}
        </div>
      </Section>
    </Page>
  ),
};
