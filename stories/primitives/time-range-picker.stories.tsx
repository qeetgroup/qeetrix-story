import { TimeRangePicker, type TimeRangeValue } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

const meta: Meta<typeof TimeRangePicker> = {
  title: "Primitives/TimeRangePicker",
  component: TimeRangePicker,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Preset + custom date-range selector used in qeet-logs analytics and billing screens. Emits `{ preset, from, to }` so query layers receive both the human-readable preset label and exact epoch bounds. Presets (`1h`, `24h`, `7d`, `30d`, `90d`) close the popover immediately; a two-month calendar is shown for custom ranges.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof TimeRangePicker>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Default state used in the qeet-logs analytics toolbar — starts at 'Last 24 hours' and displays the resolved date range below the picker.",
      },
    },
  },
  render: () => {
    const [v, setV] = React.useState<TimeRangeValue | null>(null);
    return (
      <div className="flex flex-col items-center gap-2">
        <TimeRangePicker onValueChange={setV} />
        <span className="text-sm text-muted-foreground">
          {v
            ? `${v.preset}: ${v.from.toLocaleDateString()} – ${v.to.toLocaleDateString()}`
            : "default — last 24 hours"}
        </span>
      </div>
    );
  },
};

export const PresetSelected: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Controlled with a pre-selected 7-day window — typical for a billing cycle summary on the qeet-pay invoice screen.",
      },
    },
  },
  render: () => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 864e5);
    const [v, setV] = React.useState<TimeRangeValue>({
      preset: "7d",
      from: sevenDaysAgo,
      to: new Date(),
    });
    return (
      <div className="flex flex-col items-center gap-2">
        <TimeRangePicker value={v} onValueChange={setV} />
        <span className="text-sm text-muted-foreground">
          {v.preset}: {v.from.toLocaleDateString()} – {v.to.toLocaleDateString()}
        </span>
      </div>
    );
  },
};
