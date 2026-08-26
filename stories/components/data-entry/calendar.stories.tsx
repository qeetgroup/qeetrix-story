import { Calendar, type DateRange } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { qx } from "../../_contract";

const meta: Meta<typeof Calendar> = {
  title: "Components/Data Entry/Calendar",
  component: Calendar,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          'Inline month-view calendar powered by react-day-picker. Supports `mode="single"` for date selection and `mode="range"` with `numberOfMonths={2}` for date-range pickers — used inside `DatePicker`, `DateRangePicker`, and `DateTimePicker`. Use directly when you need an always-visible calendar rather than a popover trigger.',
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Single-date selection — today pre-selected; click any day to update.",
      },
    },
  },
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-lg ring-1 ring-foreground/10"
      />
    );
  },
};

export const RangeMode: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Two-month range picker for selecting a log query window or billing period start and end dates.",
      },
    },
  },
  render: () => {
    const [range, setRange] = React.useState<DateRange | undefined>();
    return (
      <Calendar
        mode="range"
        numberOfMonths={2}
        selected={range}
        onSelect={setRange}
        className="rounded-lg ring-1 ring-foreground/10"
      />
    );
  },
};
