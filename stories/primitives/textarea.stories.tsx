import { Textarea } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Textarea> = {
  title: "Primitives/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A multi-line text input for longer freeform content. Used in Qeet ID for webhook endpoint descriptions, qeet-notify for message template bodies, and qeet-people for employee notes and review comments.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder:
      "Describe what this webhook endpoint does — e.g. forwards user.created events to Acme's CRM.",
    className: "w-80",
    rows: 4,
  },
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Frozen state shown when an org plan doesn't allow editing — e.g. a locked notification template in qeet-notify.",
      },
    },
  },
  args: {
    className: "w-80",
    rows: 4,
    disabled: true,
    defaultValue:
      "Send a welcome email to new Globex employees when their qeet-people account is activated.",
  },
};
