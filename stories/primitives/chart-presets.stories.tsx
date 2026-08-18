import {
  AreaChart,
  BarChart,
  type ChartConfig,
  DonutChart,
  LineChart,
  RadialChart,
  Sparkline,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta = {
  title: "Primitives/ChartPresets",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Ready-to-use chart components — `AreaChart`, `BarChart`, `LineChart`, `DonutChart`, `RadialChart`, and `Sparkline` — built on Recharts with Qeetrix design tokens pre-wired. Drop them into qeet-logs dashboards, qeet-people headcount reports, or Qeet ID analytics pages without writing Recharts boilerplate.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

// Qeet ID: monthly active users by platform (last 6 months)
const trend = [
  { month: "Jan", web: 8_400, mobile: 3_200 },
  { month: "Feb", web: 11_800, mobile: 4_900 },
  { month: "Mar", web: 15_200, mobile: 6_100 },
  { month: "Apr", web: 19_700, mobile: 8_400 },
  { month: "May", web: 23_100, mobile: 10_200 },
  { month: "Jun", web: 27_400, mobile: 12_800 },
];

const trendConfig = {
  web: { label: "Web (id.qeet.in)", color: "var(--chart-1)" },
  mobile: { label: "Mobile SDK", color: "var(--chart-2)" },
} satisfies ChartConfig;

// qeet-notify: message volume by channel
const channels = [
  { channel: "email", sent: 142_000 },
  { channel: "sms", sent: 87_500 },
  { channel: "push", sent: 63_200 },
  { channel: "webhook", sent: 28_900 },
];

const channelConfig = {
  sent: { label: "Messages sent" },
  email: { label: "Email", color: "var(--chart-1)" },
  sms: { label: "SMS", color: "var(--chart-2)" },
  push: { label: "Push", color: "var(--chart-3)" },
  webhook: { label: "Webhook", color: "var(--chart-4)" },
} satisfies ChartConfig;

export const Area: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Stacked area chart showing Qeet ID monthly active users split by web and mobile SDK — good for cumulative growth stories.",
      },
    },
  },
  render: () => (
    <div className="max-w-xl">
      <AreaChart
        data={trend}
        config={trendConfig}
        categoryKey="month"
        dataKeys={["web", "mobile"]}
        stacked
        showLegend
      />
    </div>
  ),
};

export const Bar: Story = {
  parameters: {
    docs: {
      description: {
        story: "Grouped bar chart — compare web vs mobile channel counts side-by-side per month.",
      },
    },
  },
  render: () => (
    <div className="max-w-xl">
      <BarChart
        data={trend}
        config={trendConfig}
        categoryKey="month"
        dataKeys={["web", "mobile"]}
      />
    </div>
  ),
};

export const Line: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Line chart with Y-axis labels — ideal for continuous metrics like token issuance rate or API latency over time.",
      },
    },
  },
  render: () => (
    <div className="max-w-xl">
      <LineChart
        data={trend}
        config={trendConfig}
        categoryKey="month"
        dataKeys={["web", "mobile"]}
        showYAxis
      />
    </div>
  ),
};

export const Donut: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Donut chart showing qeet-notify message volume by channel — at-a-glance channel mix for notification dashboards.",
      },
    },
  },
  render: () => (
    <div className="max-w-xs">
      <DonutChart
        data={channels}
        config={channelConfig}
        dataKey="sent"
        nameKey="channel"
        showLegend
      />
    </div>
  ),
};

export const Radial: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Radial bar variant — useful for KPI scorecards where ring fill communicates completion percentage.",
      },
    },
  },
  render: () => (
    <div className="max-w-xs">
      <RadialChart data={channels} config={channelConfig} dataKey="sent" nameKey="channel" />
    </div>
  ),
};

export const Sparklines: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Inline sparklines inside stat cards — the pattern used in qeet-logs and Qeet ID analytics overviews.",
      },
    },
  },
  render: () => (
    <div className="grid max-w-xl grid-cols-2 gap-4">
      <div className="flex flex-col gap-1.5 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
        <span className="text-sm font-medium text-muted-foreground">Active sessions</span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold tabular-nums">27,400</span>
          <span className="text-xs font-medium text-emerald-600">+18.6%</span>
        </div>
        <Sparkline
          data={[8, 11, 15, 19, 23, 27, 29, 31]}
          type="area"
          className="text-emerald-500"
        />
      </div>
      <div className="flex flex-col gap-1.5 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
        <span className="text-sm font-medium text-muted-foreground">Auth error rate</span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold tabular-nums">0.18%</span>
          <span className="text-xs font-medium text-rose-600">−0.03%</span>
        </div>
        <Sparkline
          data={[0.4, 0.35, 0.3, 0.28, 0.24, 0.21, 0.19, 0.18]}
          className="text-rose-500"
        />
      </div>
    </div>
  ),
};
