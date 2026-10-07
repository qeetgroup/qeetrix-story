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
import { qx } from "../../_contract";

const meta: Meta = {
  title: "Components/Data Display/ChartPresets",
  parameters: {
    qeetrix: qx({ category: "data-display", status: "stable" }),
    layout: "padded",
    docs: {
      description: {
        component:
          "Ready-to-use chart components — `AreaChart`, `BarChart`, `LineChart`, `DonutChart`, `RadialChart`, and `Sparkline` — built on Recharts with Qeetrix design tokens pre-wired. Drop them into qeet-logs dashboards, qeet-people headcount reports, or Qeet ID analytics pages without writing Recharts boilerplate.\n\nEvery preset shares one set of mark specs, so a dashboard reads as one system: bars capped at 24px with a rounded data end, 2px round-joined lines, area fills as a wash, recessive grid and axes, and a legend by default once there are two or more series. Series without a `color` in the config take the categorical palette in config order (see `chartSeriesColor` on the Chart page). `valueFormatter` formats the tooltip and value axis — the default is the locale's number format. `Sparkline` takes a `tone` (`default` · `positive` · `negative` · `neutral`) and an optional `label`, without which it is decorative and hidden from assistive technology.",
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

// qeet-pay: gross volume by method (₹), last 6 months. No colours in the config.
const volume = [
  { month: "Mar", upi: 18_40_000, cards: 9_20_000, netbanking: 3_10_000 },
  { month: "Apr", upi: 21_75_000, cards: 9_85_000, netbanking: 3_35_000 },
  { month: "May", upi: 24_90_000, cards: 10_40_000, netbanking: 3_20_000 },
  { month: "Jun", upi: 27_30_000, cards: 11_15_000, netbanking: 3_60_000 },
  { month: "Jul", upi: 31_05_000, cards: 11_90_000, netbanking: 3_45_000 },
  { month: "Aug", upi: 34_60_000, cards: 12_70_000, netbanking: 3_80_000 },
];

const volumeConfig = {
  upi: { label: "UPI" },
  cards: { label: "Cards" },
  netbanking: { label: "Net banking" },
} satisfies ChartConfig;

const inrCompact = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
});

export const DefaultPalette: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A config with labels only: UPI, Cards and Net banking take series 1, 2 and 3 in config order, and the legend appears on its own because there is more than one series. Position counts every config entry, so giving one series an explicit `color` never shifts the others — but a label-only entry for a value key (as in the Donut config above) also takes a slot.",
      },
    },
  },
  render: () => (
    <div className="max-w-xl">
      <LineChart
        data={volume}
        config={volumeConfig}
        categoryKey="month"
        dataKeys={["upi", "cards", "netbanking"]}
        accessibleTitle="qeet-pay gross volume by payment method"
      />
    </div>
  ),
};

export const ValueFormatter: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`valueFormatter` with a compact Indian-rupee format, applied to both the value axis and the tooltip — so values read in lakh (₹34.6L) rather than as 34,60,000. Stacked bars round only the top segment's data end.",
      },
    },
  },
  render: () => (
    <div className="max-w-xl">
      <BarChart
        data={volume}
        config={volumeConfig}
        categoryKey="month"
        dataKeys={["upi", "cards", "netbanking"]}
        stacked
        showYAxis
        valueFormatter={(value) => inrCompact.format(value)}
        accessibleTitle="qeet-pay gross volume by payment method, stacked"
      />
    </div>
  ),
};

export const SparklineTones: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`Sparkline` `tone` maps a trend's meaning onto the chart status roles instead of hand-picked colours: `default` is series 1 (so it matches the full chart behind it), `positive` and `negative` are real status hues, `neutral` is muted ink. Each tile names its sparkline with `label`, which makes it an image with that name; without a label it is decorative.",
      },
    },
  },
  render: () => (
    <div className="grid max-w-2xl grid-cols-2 gap-4">
      {(
        [
          {
            tone: "default",
            title: "Monthly active users",
            value: "27,400",
            data: [18, 19, 21, 22, 24, 25, 27, 27.4],
            label: "Monthly active users, last 8 weeks, rising",
          },
          {
            tone: "positive",
            title: "Payment success rate",
            value: "98.6%",
            data: [96.1, 96.8, 97.2, 97.5, 97.9, 98.2, 98.4, 98.6],
            label: "Payment success rate, last 8 weeks, improving",
          },
          {
            tone: "negative",
            title: "Webhook failures",
            value: "1,284",
            data: [310, 420, 380, 610, 720, 940, 1100, 1284],
            label: "Webhook failures, last 8 weeks, rising",
          },
          {
            tone: "neutral",
            title: "Headcount",
            value: "412",
            data: [408, 410, 409, 411, 410, 412, 411, 412],
            label: "Headcount, last 8 weeks, flat",
          },
        ] as const
      ).map((tile) => (
        <div
          key={tile.tone}
          className="flex flex-col gap-1.5 rounded-xl bg-card p-4 ring-1 ring-foreground/10"
        >
          <span className="text-sm font-medium text-muted-foreground">{tile.title}</span>
          <span className="text-2xl font-semibold tabular-nums">{tile.value}</span>
          <Sparkline data={[...tile.data]} tone={tile.tone} type="area" label={tile.label} />
          <code className="font-mono text-xs text-muted-foreground">tone="{tile.tone}"</code>
        </div>
      ))}
    </div>
  ),
};
