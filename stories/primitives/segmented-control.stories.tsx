import { SegmentedControl, SegmentedControlItem } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

const meta: Meta<typeof SegmentedControl> = {
  title: "Primitives/SegmentedControl",
  component: SegmentedControl,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A mutually exclusive option picker rendered as a connected button group — semantically a radio group with a compact visual style. Use it for view-mode toggles and short option sets where a full `Select` would be oversized: switching between List / Board / Calendar views in qeet-people, or toggling a qeet-logs chart between Day / Week / Month.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
};
export default meta;
type Story = StoryObj<typeof SegmentedControl>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "View-mode switcher for a qeet-people employee directory — List, Board, or Calendar layout.",
      },
    },
  },
  render: (args) => {
    const [value, setValue] = React.useState("list");
    return (
      <SegmentedControl {...args} value={value} onValueChange={setValue}>
        <SegmentedControlItem value="list">List</SegmentedControlItem>
        <SegmentedControlItem value="board">Board</SegmentedControlItem>
        <SegmentedControlItem value="calendar">Calendar</SegmentedControlItem>
      </SegmentedControl>
    );
  },
};

export const FullWidth: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`fullWidth` stretches each segment equally — ideal for time-range toggles above a qeet-logs chart.",
      },
    },
  },
  render: () => {
    const [value, setValue] = React.useState("day");
    return (
      <div className="w-80">
        <SegmentedControl fullWidth value={value} onValueChange={setValue}>
          <SegmentedControlItem value="day">Day</SegmentedControlItem>
          <SegmentedControlItem value="week">Week</SegmentedControlItem>
          <SegmentedControlItem value="month">Month</SegmentedControlItem>
        </SegmentedControl>
      </div>
    );
  },
};
