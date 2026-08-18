import { TimezonePicker } from "@qeetrix/ui";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta: Meta<typeof TimezonePicker> = {
  title: "Primitives/TimezonePicker",
  component: TimezonePicker,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Searchable IANA timezone selector for user profile settings, organisation headquarters in qeet-people, and scheduled notification delivery in qeet-notify. Defaults to `Asia/Kolkata` — Qeet's anchor region — and formats each option with its current UTC offset.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof TimezonePicker>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Defaults to Asia/Kolkata — Qeet's anchor region — with full IANA search to cover global organisations.",
      },
    },
  },
  render: () => {
    const [value, setValue] = useState("Asia/Kolkata");
    return (
      <div className="w-72">
        <TimezonePicker value={value} onChange={setValue} />
      </div>
    );
  },
};
