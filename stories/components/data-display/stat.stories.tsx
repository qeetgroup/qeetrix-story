import {
  ActivityIcon,
  ClockIcon,
  CreditCardIcon,
  GaugeIcon,
  KeyRoundIcon,
  TrendingUpIcon,
  UserMinusIcon,
  UsersIcon,
} from "@qeetrix/icons";
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
          "A metric tile that surfaces a labelled value, an optional delta with trend direction (`trend`: up / down / neutral), a contextual hint line, an optional icon, and an optional footer (`children`) for a sparkline or link. `trend` sets the arrow; `tone` (`positive` | `negative` | `neutral`) sets the colour — whether the change is good news — and defaults from `trend` (up positive, down negative). Set it when up is bad (error rate, latency, churn) or down is good. `size` is `sm`, `default` or `lg`; `loading` keeps the label and swaps the figures for placeholders. The tile is a named `group`, so a screen reader hears its label before its figures. Compose multiple `Stat` tiles in a CSS grid to build dashboard summary rows; `statVariants` exports the tile shell for custom tiles that should match.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["sm", "default", "lg"],
    },
    trend: {
      control: "inline-radio",
      options: ["up", "down", "neutral"],
    },
    tone: {
      control: "inline-radio",
      options: ["positive", "negative", "neutral"],
    },
    loading: { control: "boolean" },
  },
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
        icon={UsersIcon}
      />
      <Stat
        label="Failed logins"
        value="318"
        delta="-4.1%"
        trend="down"
        hint="vs. last 30 days"
        icon={ActivityIcon}
      />
      <Stat
        label="Active API keys"
        value="64"
        delta="0%"
        trend="neutral"
        hint="no change"
        icon={KeyRoundIcon}
      />
    </div>
  ),
};

export const PaymentMetrics: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'qeet-pay themed summary row with INR revenue, transaction volume, and failure count. A rising failure count is `trend="up"` (the number went up) with `tone="negative"` (that is bad news), so the arrow and the colour each tell the truth.',
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
        icon={TrendingUpIcon}
      />
      <Stat
        label="Transactions"
        value="24,810"
        delta="+5.2%"
        trend="up"
        hint="vs. last month"
        icon={CreditCardIcon}
      />
      <Stat
        label="Failed payments"
        value="47"
        delta="+2"
        trend="up"
        tone="negative"
        hint="vs. last month"
        icon={ActivityIcon}
      />
    </div>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`size` scales the padding and the value together: `sm` for dense side panels and table summaries, `default` for a dashboard row, `lg` for a single hero figure.",
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-3">
      {(["sm", "default", "lg"] as const).map((size) => (
        <Stat
          key={size}
          size={size}
          label={`Settled today · ${size}`}
          value="₹6,14,920"
          delta="+4.8%"
          trend="up"
          hint="vs. yesterday"
          icon={CreditCardIcon}
        />
      ))}
    </div>
  ),
};

export const Tones: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`tone` says whether a change is good news, independently of its direction. Error rate and churn going up are `negative`; p95 latency and settlement time going down are `positive`; a change that is neither stays `neutral`. Leave `tone` unset when up really is good, as for active users or revenue. The arrow and the sign still carry the direction, so meaning is never told by colour alone.",
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Stat
        label="Error rate"
        value="1.8%"
        delta="+0.6 pp"
        trend="up"
        tone="negative"
        hint="qeet-logs · last 24 hours"
        icon={ActivityIcon}
      />
      <Stat
        label="p95 sign-in latency"
        value="212 ms"
        delta="-38 ms"
        trend="down"
        tone="positive"
        hint="Qeet ID · last 7 days"
        icon={GaugeIcon}
      />
      <Stat
        label="Monthly churn"
        value="2.4%"
        delta="+0.3 pp"
        trend="up"
        tone="negative"
        hint="vs. last month"
        icon={UserMinusIcon}
      />
      <Stat
        label="Avg. settlement time"
        value="1.2 days"
        delta="-0.4 days"
        trend="down"
        tone="positive"
        hint="qeet-pay · vs. last month"
        icon={ClockIcon}
      />
    </div>
  ),
};

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`loading` keeps the label — so the tile holds its place and its name — and swaps the value, delta and hint for placeholders while the figures are fetched. The tile reports `aria-busy` until they arrive.",
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Stat label="Active users" value="12,480" hint="vs. last 30 days" loading icon={UsersIcon} />
      <Stat label="Monthly Revenue" value="₹18,42,500" hint="vs. last month" loading />
      <Stat label="Active API keys" value="64" loading icon={KeyRoundIcon} />
    </div>
  ),
};
