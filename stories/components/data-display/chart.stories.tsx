import {
  type ChartConfig,
  ChartContainer,
  ChartDataTable,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  chartSeriesColor,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { qx } from "../../_contract";

const meta: Meta = {
  title: "Components/Data Display/Chart",
  parameters: {
    qeetrix: qx({ category: "data-display", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "Low-level Recharts integration primitives — `ChartContainer`, `ChartTooltip`, and `ChartTooltipContent` — that apply Qeetrix design tokens to any Recharts chart. Use these building blocks when a one-off chart shape isn't covered by the `ChartPresets`; for common patterns (area, bar, line, donut) use the preset components instead.\n\nSeries colours come from the foundation's eight categorical slots, `var(--chart-1)` … `var(--chart-8)`, in a CVD-checked order — blue, teal, Qeet, violet, pink, lime, sky, graphite. A `ChartConfig` entry with neither `color` nor `theme` takes the slot for its *position in the config*, so a config only names the colours it means to override. `chartSeriesColor(index)` returns the same slot (0-based) for marks and swatches drawn outside a config; past the eighth series it stays on graphite rather than repeating a hue. `ChartTooltipContent` formats values with the locale's number format, or with `valueFormatter`.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

const data = [
  { month: "Jan", logins: 14_200 },
  { month: "Feb", logins: 18_900 },
  { month: "Mar", logins: 27_400 },
  { month: "Apr", logins: 31_100 },
  { month: "May", logins: 38_750 },
  { month: "Jun", logins: 44_320 },
];

const config = {
  logins: { label: "Logins", color: "var(--chart-1)" },
} satisfies ChartConfig;

export const Bars: Story = {
  render: () => (
    <ChartContainer config={config} className="h-64 w-md">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="logins" fill="var(--color-logins)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
};

export const AccessibleWithDataTable: Story = {
  render: () => (
    <ChartContainer
      config={config}
      className="h-64 w-md"
      accessibleTitle="Monthly successful logins"
      accessibleDescription="Successful logins from January through June 2026."
      accessibleSummary="Logins rise from 14,200 in January to 44,320 in June."
      accessibilityTableVisibility="visible"
      accessibilityTable={
        <ChartDataTable
          caption="Monthly successful login data"
          data={data}
          columns={[
            { key: "month", header: "Month" },
            {
              key: "logins",
              header: "Successful logins",
              format: (value) => Number(value).toLocaleString(),
            },
          ]}
          getRowKey={(row) => row.month}
        />
      }
    >
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="logins" fill="var(--color-logins)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
};

export const SeriesPalette: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`chartSeriesColor(index)` for indices 0–9. Qeet orange is the third series on purpose: a single-series chart is blue, and orange stays the colour of action and selection. The palette does not cycle — the ninth series and beyond are graphite, the “other” colour, because a repeated hue would claim two series are the same thing. Fold long tails into an “Other” series instead.",
      },
    },
  },
  render: () => (
    <ul className="grid w-md grid-cols-2 gap-x-6 gap-y-2 text-sm">
      {Array.from({ length: 10 }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: the index is the identity being shown.
        <li key={index} className="flex items-center gap-2">
          <span
            aria-hidden
            className="size-4 shrink-0 rounded-(--qx-corner-xs)"
            style={{ backgroundColor: chartSeriesColor(index) }}
          />
          <code className="font-mono text-xs">chartSeriesColor({index})</code>
          <span className="text-muted-foreground">→ {chartSeriesColor(index)}</span>
        </li>
      ))}
    </ul>
  ),
};

// qeet-logs: events per day by level
const levels = [
  { day: "Mon", error: 412, warn: 1_380, info: 9_420 },
  { day: "Tue", error: 388, warn: 1_212, info: 10_105 },
  { day: "Wed", error: 905, warn: 1_644, info: 11_870 },
  { day: "Thu", error: 351, warn: 1_190, info: 10_640 },
  { day: "Fri", error: 297, warn: 1_052, info: 9_985 },
];

// No colours: each series takes the categorical slot for its position in the config.
const levelConfig = {
  info: { label: "Info" },
  warn: { label: "Warn" },
  error: { label: "Error" },
} satisfies ChartConfig;

const levelKeys = Object.keys(levelConfig) as Array<keyof typeof levelConfig>;
const compact = new Intl.NumberFormat("en-IN", { notation: "compact" });

export const PaletteFromConfig: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A qeet-logs volume chart whose `ChartConfig` names no colours, so `info`, `warn` and `error` take series 1–3 in config order. The summary beside it is plain HTML — not part of the chart — and uses `chartSeriesColor(index)` with the same config order, so its swatches agree with the bars without repeating the palette. The tooltip uses `valueFormatter` for compact Indian-locale figures.",
      },
    },
  },
  render: () => (
    <div className="flex items-start gap-6">
      <ChartContainer
        config={levelConfig}
        className="h-64 w-md"
        accessibleTitle="Log events per day by level"
      >
        <BarChart data={levels}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip
            content={
              <ChartTooltipContent
                valueFormatter={(value) =>
                  typeof value === "number" ? compact.format(value) : value
                }
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
          {levelKeys.map((key) => (
            <Bar key={key} dataKey={key} fill={`var(--color-${key})`} radius={[4, 4, 0, 0]} />
          ))}
        </BarChart>
      </ChartContainer>
      <dl className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2 text-sm">
        {levelKeys.map((key, index) => (
          <div key={key} className="contents">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <span
                aria-hidden
                className="size-2 rounded-(--qx-corner-xs)"
                style={{ backgroundColor: chartSeriesColor(index) }}
              />
              {levelConfig[key].label}
            </dt>
            <dd className="text-end tabular-nums">
              {compact.format(levels.reduce((sum, row) => sum + row[key], 0))}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  ),
};
