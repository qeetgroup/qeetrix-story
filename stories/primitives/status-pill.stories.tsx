import { StatusPill } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof StatusPill> = {
  title: "Primitives/StatusPill",
  component: StatusPill,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A compact inline badge for conveying record or entity status at a glance. Supports six semantic colour variants (`kind`) or a convenience `status` string prop that resolves both colour and label from a curated lookup table — ideal for rendering API-returned status values without a mapping layer in consumer code.",
      },
    },
  },
  argTypes: {
    kind: {
      control: "select",
      options: ["success", "warning", "danger", "info", "neutral", "muted"],
    },
    dot: { control: "boolean" },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof StatusPill>;

export const Success: Story = { args: { kind: "success", children: "Active" } };
export const Warning: Story = {
  args: { kind: "warning", children: "Pending" },
};
export const Danger: Story = { args: { kind: "danger", children: "Revoked" } };
export const Info: Story = { args: { kind: "info", children: "Draft" } };

export const FromStatusString: Story = {
  args: { status: "expired" },
  parameters: {
    docs: {
      description: {
        story:
          "Passing a `status` string instead of `kind`+`children` resolves both from the curated lookup table — case-insensitive.",
      },
    },
  },
};

export const AllStatuses: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "All common Qeet entity states rendered via the `status` prop in a single view. Use this as a visual reference when wiring status values returned by the Qeet ID or qeet-people APIs into list/table UIs.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <StatusPill status="active" />
      <StatusPill status="pending" />
      <StatusPill status="revoked" />
      <StatusPill status="suspended" />
      <StatusPill status="expired" />
      <StatusPill status="archived" />
      <StatusPill status="draft" />
      <StatusPill status="verified" />
    </div>
  ),
};
