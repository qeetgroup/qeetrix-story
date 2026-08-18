import { NotificationPreferenceMatrix, type PreferenceMatrix } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

const CHANNELS = [
  { key: "inapp", label: "In-app" },
  { key: "email", label: "Email" },
  { key: "push", label: "Push" },
  { key: "sms", label: "SMS" },
];
const CATEGORIES = [
  {
    key: "security",
    label: "Security",
    description: "Sign-ins, password changes",
  },
  {
    key: "billing",
    label: "Billing",
    description: "Invoices, payment failures",
  },
  { key: "product", label: "Product", description: "New features and tips" },
];

const meta: Meta<typeof NotificationPreferenceMatrix> = {
  title: "Primitives/NotificationPreferenceMatrix",
  component: NotificationPreferenceMatrix,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Channel × category toggle matrix from qeet-notify's user preferences screen. Rows map to notification categories (Security, Billing, Product updates) and columns to delivery channels (In-app, Email, Push, SMS). The `value` prop is a nested `PreferenceMatrix` record keyed by `category → channel → boolean`.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof NotificationPreferenceMatrix>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState<PreferenceMatrix>({
      security: { inapp: true, email: true, push: true },
      billing: { email: true },
    });
    return (
      <div className="max-w-xl">
        <NotificationPreferenceMatrix
          channels={CHANNELS}
          categories={CATEGORIES}
          value={value}
          onValueChange={setValue}
        />
      </div>
    );
  },
};
