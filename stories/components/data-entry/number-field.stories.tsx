import { NumberField } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof NumberField> = {
  title: "Components/Data Entry/NumberField",
  component: NumberField,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "A numeric input with increment/decrement stepper buttons and locale-aware formatting via the `format` prop (accepts `Intl.NumberFormatOptions`). Used in Qeet ID for token TTL and rate-limit configuration, and in qeet-pay for invoice line-item quantities and amount entry.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof NumberField>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Session token TTL in days for a Qeet ID application — clamped between 1 and 90.",
      },
    },
  },
  render: () => (
    <div className="w-40">
      <NumberField defaultValue={30} min={1} max={90} aria-label="Session token TTL (days)" />
    </div>
  ),
};

export const Currency: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "INR invoice amount for a qeet-pay line item — formatted with the Indian rupee symbol.",
      },
    },
  },
  render: () => (
    <div className="w-48">
      <NumberField
        defaultValue={4999}
        min={0}
        step={1}
        format={{ style: "currency", currency: "INR" }}
        aria-label="Plan price"
      />
    </div>
  ),
};

export const Percentage: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Tax rate field in qeet-pay — displayed as a percentage, stepped in 0.5% increments.",
      },
    },
  },
  render: () => (
    <div className="w-44">
      <NumberField
        defaultValue={0.18}
        min={0}
        max={1}
        step={0.005}
        format={{ style: "percent" }}
        aria-label="Tax rate"
      />
    </div>
  ),
};
