import { Button, RollingNumber } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { qx } from "../../_contract";

const meta: Meta<typeof RollingNumber> = {
  title: "Components/Data Display/RollingNumber",
  component: RollingNumber,
  parameters: {
    qeetrix: qx({ category: "data-display", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "Animates numeric value changes with an eased count-up/down transition. Use it for live stat cards in qeet-logs (ingested events per second), Qeet ID dashboards (active sessions), or qeet-pay transaction totals. Automatically skips animation when `prefers-reduced-motion` is active.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof RollingNumber>;

export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Click the buttons to simulate live session count changes — the eased animation makes large jumps readable rather than jarring.",
      },
    },
  },
  render: () => {
    const [v, setV] = React.useState(27_400);
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="text-center">
          <p className="mb-1 text-xs font-medium text-muted-foreground">Active Qeet ID sessions</p>
          <RollingNumber className="text-4xl font-semibold" value={v} locale="en-IN" />
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setV((n) => n + 1_843)}>
            +1,843
          </Button>
          <Button size="sm" variant="outline" onClick={() => setV((n) => Math.max(0, n - 920))}>
            −920
          </Button>
        </div>
      </div>
    );
  },
};
