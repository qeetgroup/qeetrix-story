import { CurrencyInput } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

const meta: Meta<typeof CurrencyInput> = {
  title: "Primitives/CurrencyInput",
  component: CurrencyInput,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Locale-aware monetary input used across qeet-pay billing flows and invoice forms. Formats the numeric value using the specified `currency` and `locale` (e.g. INR with `en-IN` renders ₹ with Indian grouping), while exposing a raw `number` via `onValueChange` so API payloads stay currency-agnostic.",
      },
    },
  },
  argTypes: {
    currency: {
      control: "select",
      options: ["USD", "INR", "EUR", "GBP", "JPY"],
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof CurrencyInput>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "INR invoice amount entry — pre-filled with ₹49,900, the typical qeet-pay starter plan price for Indian customers.",
      },
    },
  },
  render: (args) => {
    const [v, setV] = React.useState<number | undefined>(49900);
    return (
      <div className="w-56 space-y-2">
        <CurrencyInput {...args} aria-label="Invoice amount" value={v} onValueChange={setV} />
        <p className="text-sm text-muted-foreground">Raw value: {v ?? "—"}</p>
      </div>
    );
  },
  args: { currency: "INR", locale: "en-IN" },
};

export const USD: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "USD variant — used for international billing outside India where Stripe handles the charge.",
      },
    },
  },
  render: (args) => {
    const [v, setV] = React.useState<number | undefined>(599);
    return (
      <div className="w-56 space-y-2">
        <CurrencyInput {...args} aria-label="Invoice amount" value={v} onValueChange={setV} />
        <p className="text-sm text-muted-foreground">Raw value: {v ?? "—"}</p>
      </div>
    );
  },
  args: { currency: "USD", locale: "en-US" },
};
