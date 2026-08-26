import { DateRangePicker } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof DateRangePicker> = {
  title: "Components/Data Entry/DateRangePicker",
  component: DateRangePicker,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "Two-date range selector for log time windows in qeet-logs, billing period filters in qeet-pay, and session activity reports in Qeet ID. Renders a two-month calendar popover so users can set both start and end in one interaction.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DateRangePicker>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Two-month calendar popover for selecting a date range — e.g. a qeet-logs query window or a qeet-pay billing period.",
      },
    },
  },
  render: () => (
    <div className="w-72">
      <DateRangePicker />
    </div>
  ),
};
