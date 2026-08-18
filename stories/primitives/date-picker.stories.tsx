import { DatePicker } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof DatePicker> = {
  title: "Primitives/DatePicker",
  component: DatePicker,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Single-date picker with an inline calendar popover — used for billing cycle start dates in qeet-pay, report cut-off dates in qeet-logs, and employee start dates in qeet-people. Pre-populate with `defaultValue` for edit forms; leave empty for creation flows.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Empty date picker for creation forms — the user selects a date from the calendar popover.",
      },
    },
  },
  render: () => (
    <div className="w-64">
      <DatePicker />
    </div>
  ),
};

export const Preselected: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pre-populated date for edit forms, such as updating a billing cycle start or an employee start date.",
      },
    },
  },
  render: () => (
    <div className="w-64">
      <DatePicker defaultValue={new Date()} />
    </div>
  ),
};
