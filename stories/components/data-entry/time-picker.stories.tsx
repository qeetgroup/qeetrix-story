import { TimePicker } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { qx } from "../../_contract";

const meta: Meta<typeof TimePicker> = {
  title: "Components/Data Entry/TimePicker",
  component: TimePicker,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "Standalone time input for scheduling recurring jobs, notification quiet hours in qeet-notify, and report delivery times. Supports 24-hour and 12-hour (`hourCycle`) modes, optional seconds via `withSeconds`, and stepped increments via `minuteStep` — useful for booking slots in availability grids.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof TimePicker>;

export const TwentyFourHour: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "24-hour time input — default for server-side scheduling fields where locale ambiguity must be avoided.",
      },
    },
  },
  render: () => {
    const [value, setValue] = React.useState<string>("09:30");
    return (
      <div className="flex flex-col items-center gap-2">
        <TimePicker value={value} onValueChange={setValue} />
        <span className="text-sm text-muted-foreground">value: {value || "—"}</span>
      </div>
    );
  },
};

export const TwelveHour: Story = {
  parameters: {
    docs: {
      description: {
        story: "12-hour AM/PM picker for consumer-facing notification quiet-hours settings.",
      },
    },
  },
  render: () => {
    const [value, setValue] = React.useState<string>("14:15");
    return (
      <div className="flex flex-col items-center gap-2">
        <TimePicker value={value} onValueChange={setValue} hourCycle={12} />
        <span className="text-sm text-muted-foreground">value: {value || "—"}</span>
      </div>
    );
  },
};

export const WithSeconds: Story = {
  render: () => {
    const [value, setValue] = React.useState<string>("23:59:45");
    return (
      <div className="flex flex-col items-center gap-2">
        <TimePicker value={value} onValueChange={setValue} withSeconds />
        <span className="text-sm text-muted-foreground">value: {value || "—"}</span>
      </div>
    );
  },
};

export const FiveMinuteSteps: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "5-minute stepping for availability or booking grids where freeform minute entry would produce impractical slot times.",
      },
    },
  },
  render: () => {
    const [value, setValue] = React.useState<string>("");
    return (
      <div className="flex flex-col items-center gap-2">
        <TimePicker value={value} onValueChange={setValue} minuteStep={5} hourCycle={12} />
        <span className="text-sm text-muted-foreground">value: {value || "—"}</span>
      </div>
    );
  },
};
