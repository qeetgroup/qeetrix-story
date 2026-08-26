import { CountryPicker } from "@qeetrix/ui";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { qx } from "../../_contract";

const meta: Meta<typeof CountryPicker> = {
  title: "Components/Data Entry/CountryPicker",
  component: CountryPicker,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          'Searchable country selector with flag icons — used in qeet-pay billing addresses, Qeet ID organisation headquarters, and qeet-people employee profiles. Stores the selected ISO 3166-1 alpha-2 code (e.g. `"IN"`) and defaults to India, Qeet\'s anchor market.',
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof CountryPicker>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pre-selected to India (IN) — the default for qeet-pay billing addresses and Qeet ID organisation profiles.",
      },
    },
  },
  render: () => {
    const [value, setValue] = useState("IN");
    return (
      <div className="w-72">
        <CountryPicker value={value} onChange={setValue} />
      </div>
    );
  },
};
