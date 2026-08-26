import { Button, Spinner } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof Spinner> = {
  title: "Components/Feedback/Spinner",
  component: Spinner,
  parameters: {
    qeetrix: qx({ category: "feedback", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "Accessible SVG loading indicator for async operations — passkey verification, directory syncs in qeet-people, or log ingestion in qeet-logs. Four `size` options (`sm` | `default` | `lg` | `xl`) let it slot neatly into buttons, cards, or full-page loaders.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "default", "lg", "xl"] },
  },
};
export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: { size: "default" },
  parameters: {
    docs: {
      description: {
        story: "Default spinner — use in cards and panels while data loads.",
      },
    },
  },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: "All four size options side-by-side — pick the one that fits your layout context.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner size="sm" />
      <Spinner size="default" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </div>
  ),
};

export const InButton: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Spinner inside a disabled button — the standard pattern for a loading submit action in Qeet ID forms.",
      },
    },
  },
  render: () => (
    <Button disabled>
      <Spinner size="sm" className="text-current" />
      Saving…
    </Button>
  ),
};
