import { DateTimePicker } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

const meta: Meta<typeof DateTimePicker> = {
  title: "Primitives/DateTimePicker",
  component: DateTimePicker,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Combined date and time picker for scheduling precision — webhook retry windows, scheduled qeet-notify dispatches, or session expiry overrides in Qeet ID. Supports 24-hour and 12-hour (`hourCycle={12}`) modes, optional seconds via `withSeconds`, and fine-grained `minuteStep` control.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DateTimePicker>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "24-hour date-time picker for scheduling precise events such as a webhook retry window or a session expiry override.",
      },
    },
  },
  render: () => {
    const [value, setValue] = React.useState<Date | undefined>();
    return (
      <div className="flex w-72 flex-col gap-2">
        <DateTimePicker value={value} onValueChange={setValue} />
        <span className="text-sm text-muted-foreground">
          {value ? value.toISOString() : "no value"}
        </span>
      </div>
    );
  },
};

export const TwelveHourWithSeconds: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "12-hour clock with seconds — useful for audit log timestamps where sub-minute precision matters.",
      },
    },
  },
  render: () => {
    const [value, setValue] = React.useState<Date | undefined>(new Date());
    return (
      <div className="flex w-72 flex-col gap-2">
        <DateTimePicker
          value={value}
          onValueChange={setValue}
          hourCycle={12}
          withSeconds
          minuteStep={1}
        />
        <span className="text-sm text-muted-foreground">
          {value ? value.toISOString() : "no value"}
        </span>
      </div>
    );
  },
};
