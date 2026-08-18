import type { Meta, StoryObj } from "@storybook/react-vite";

import { Page, Section } from "../_helpers";

const meta: Meta = {
  title: "Foundations/Typography",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The Qeetrix type system, built on the Cal Sans family in three optical cuts — Display for headlines, Text for body copy, and UI for interface labels — paired with an eleven-step size scale from `display-lg` down to `micro`. Sizes resolve from the `--qx-font-size-*` tokens, so headings and body stay in proportion across every Qeet product.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

const SCALE: Array<[string, string]> = [
  ["display-lg", "64 / 72"],
  ["display", "48 / 56"],
  ["title", "32 / 40"],
  ["heading-lg", "24 / 32"],
  ["heading", "20 / 28"],
  ["heading-sm", "18 / 24"],
  ["body-lg", "16 / 24"],
  ["body", "14 / 20"],
  ["body-sm", "13 / 20"],
  ["caption", "12 / 16"],
  ["micro", "11 / 16"],
];

export const TypeScale: Story = {
  render: () => (
    <Page>
      <Section title="Families">
        <div className="flex flex-col gap-2">
          <p style={{ fontFamily: "var(--font-display)" }} className="text-3xl">
            Cal Sans Display — headlines
          </p>
          <p style={{ fontFamily: "var(--font-sans)" }} className="text-lg">
            Cal Sans Text — body copy and long-form reading.
          </p>
          <p style={{ fontFamily: "var(--font-ui)" }} className="text-sm">
            Cal Sans UI — buttons, labels, menus, small interface text.
          </p>
        </div>
      </Section>
      <Section title="Type scale">
        <div className="flex flex-col gap-3">
          {SCALE.map(([token, size]) => (
            <div key={token} className="flex items-baseline gap-4 border-b border-border pb-3">
              <code className="w-28 shrink-0 text-xs text-muted-foreground">{token}</code>
              <span className="w-16 shrink-0 text-xs text-muted-foreground">{size}</span>
              <span
                style={{ fontSize: `var(--qx-font-size-${token})` }}
                className="font-heading truncate"
              >
                Authenticate with Qeet
              </span>
            </div>
          ))}
        </div>
      </Section>
    </Page>
  ),
};
