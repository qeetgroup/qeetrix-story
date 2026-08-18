import { AvailabilityGrid } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const TIMES = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00"];

const meta: Meta<typeof AvailabilityGrid> = {
  title: "Primitives/AvailabilityGrid",
  component: AvailabilityGrid,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Interactive weekly availability grid used in qeet-people scheduling flows. Cells are identified by `"dayIndex:timeIndex"` strings; toggle them to build a set of available slots. Pass `unavailable` to mark slots as blocked (e.g. outside a team member\'s working hours) — these render as disabled and are excluded from the output `value`.',
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof AvailabilityGrid>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Ada Lovelace's availability window for a qeet-people scheduling request — pre-selected slots shown in green, grey cells are outside her working hours.",
      },
    },
  },
  render: () => {
    const [v, setV] = React.useState<string[]>(["0:1", "0:2", "0:3", "2:0", "2:1", "3:4", "3:5"]);
    return (
      <AvailabilityGrid
        days={DAYS}
        times={TIMES}
        value={v}
        onValueChange={setV}
        unavailable={["1:3", "3:0", "4:4", "4:5", "4:6"]}
      />
    );
  },
};

export const Empty: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "All cells unselected — the state before a team member has submitted their availability for the week.",
      },
    },
  },
  render: () => {
    const [v, setV] = React.useState<string[]>([]);
    return (
      <AvailabilityGrid
        days={DAYS}
        times={TIMES}
        value={v}
        onValueChange={setV}
        unavailable={["4:6"]}
      />
    );
  },
};
