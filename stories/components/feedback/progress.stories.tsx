import { Progress } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof Progress> = {
  title: "Components/Feedback/Progress",
  component: Progress,
  parameters: {
    qeetrix: qx({ category: "feedback", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "A horizontal progress bar for long-running operations. Accepts a numeric `value` (0–100) for a determinate state or `null` for an indeterminate pulsing animation while waiting for an async operation to begin.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "In-progress state for a long-running operation, such as a Qeet ID database migration or bulk user import.",
      },
    },
  },
  render: () => (
    <div className="w-72">
      <Progress value={60} aria-label="Database schema migration — 60% complete" />
    </div>
  ),
};

export const Complete: Story = {
  parameters: {
    docs: {
      description: {
        story: "Value of 100 fills the track completely.",
      },
    },
  },
  render: () => (
    <div className="w-72">
      <Progress value={100} aria-label="Database schema migration — complete" />
    </div>
  ),
};

export const Indeterminate: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pass `value={null}` for an indeterminate (pulse) state while waiting for an async operation to begin.",
      },
    },
  },
  render: () => (
    <div className="w-72">
      <Progress value={null} aria-label="Syncing audit log events" />
    </div>
  ),
};
