import { Activity, Card, Key, People, TrendUp } from "@qeetrix/icons";
import { Stat } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof Stat> = {
  title: "Components/Data Display/Stat",
  component: Stat,
  parameters: {
    qeetrix: qx({ category: "data-display", status: "stable" }),
    layout: "padded",
    docs: {
      description: {
        component:
          "A metric tile that surfaces a labelled value, an optional delta badge with trend direction (up / down / neutral), a contextual hint line, and an optional icon. Compose multiple `Stat` tiles in a CSS grid to build dashboard summary rows.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Stat>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Single tile with all props supplied — label, value, delta, trend, and hint. Use `className` to cap the tile width when rendering standalone.",
      },
    },
  },
  args: {
    label: "Active users",
    value: "12,480",
    delta: "+12.5%",
    trend: "up",
    hint: "vs. last 30 days",
  },
  render: (args) => <Stat {...args} className="max-w-xs" />,
};

export const Grid: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Three Qeet ID identity-platform metrics side-by-side. Pass an `icon` from @qeetrix/icons to anchor the tile visually and give quick-scan recognition in dense dashboards.",
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Stat
        label="Active users"
        value="12,480"
        delta="+12.5%"
        trend="up"
        hint="vs. last 30 days"
        icon={People}
      />
      <Stat
        label="Failed logins"
        value="318"
        delta="-4.1%"
        trend="down"
        hint="vs. last 30 days"
        icon={Activity}
      />
      <Stat
        label="Active API keys"
        value="64"
        delta="0%"
        trend="neutral"
        hint="no change"
        icon={Key}
      />
    </div>
  ),
};

export const PaymentMetrics: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "qeet-pay themed summary row with INR revenue, transaction volume, and failure count. `trend='down'` on a rising failure count correctly signals a negative direction even when the delta is a positive integer.",
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Stat
        label="Monthly Revenue"
        value="₹18,42,500"
        delta="+9.3%"
        trend="up"
        hint="vs. last month"
        icon={TrendUp}
      />
      <Stat
        label="Transactions"
        value="24,810"
        delta="+5.2%"
        trend="up"
        hint="vs. last month"
        icon={Card}
      />
      <Stat
        label="Failed payments"
        value="47"
        delta="+2"
        trend="down"
        hint="vs. last month"
        icon={Activity}
      />
    </div>
  ),
};
