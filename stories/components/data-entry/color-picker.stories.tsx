import { ColorPicker } from "@qeetrix/ui";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { qx } from "../../_contract";

const meta: Meta<typeof ColorPicker> = {
  title: "Components/Data Entry/ColorPicker",
  component: ColorPicker,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          'A hex colour picker combining a native `<input type="color">` swatch with a text input and an optional `presets` row of quick-select swatches. Used in Qeet ID\'s branding panel so admins can customise the accent colour on their hosted login page — the Qeet brand orange `#F26D0E` ships as the default preset.',
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ColorPicker>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Brand accent colour picker in the Qeet ID tenant branding panel — starts on Qeet orange with five preset swatches.",
      },
    },
  },
  render: () => {
    const [value, setValue] = useState("#F26D0E");
    return (
      <div className="w-72">
        <ColorPicker
          value={value}
          onChange={setValue}
          presets={["#F26D0E", "#2563EB", "#16A34A", "#DC2626", "#7C3AED"]}
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Locked when the org is on the Starter plan — upgrade to Growth to enable custom branding.",
      },
    },
  },
  render: () => {
    const [value, setValue] = useState("#2563EB");
    return (
      <div className="w-72">
        <ColorPicker value={value} onChange={setValue} disabled />
      </div>
    );
  },
};
