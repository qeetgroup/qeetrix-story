import { Blockquote } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Blockquote> = {
  title: "Primitives/Blockquote",
  component: Blockquote,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A styled pull-quote block with an optional `attribution` line. Use it to surface testimonials in qeet.in marketing pages, highlight key statements in qeet-docs guides, or call out noteworthy entries in qeet-logs incident reports. Three sizes — `sm`, `md`, `lg` — let you match the surrounding type scale.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
};
export default meta;
type Story = StoryObj<typeof Blockquote>;

export const Default: Story = {
  render: () => (
    <Blockquote attribution="— Priya Nair, Head of Engineering, Qeet" className="max-w-md">
      <p>
        Switching to Qeet ID cut our auth-related support tickets by 60% in the first month —
        passkeys just work.
      </p>
    </Blockquote>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Three sizes let the pull-quote match the surrounding body text — `sm` for footnotes, `lg` for hero testimonials.",
      },
    },
  },
  render: () => (
    <div className="max-w-md space-y-4">
      <Blockquote size="sm" attribution="— qeet-logs changelog, v0.9.4">
        <p>
          Ingestion latency dropped from 380 ms to 42 ms after the ClickHouse columnar index
          migration.
        </p>
      </Blockquote>
      <Blockquote size="lg" attribution="— Qeet 2026 Product Vision">
        <p>
          Every developer deserves an identity layer that disappears into the background and
          reappears only when it matters.
        </p>
      </Blockquote>
    </div>
  ),
};
