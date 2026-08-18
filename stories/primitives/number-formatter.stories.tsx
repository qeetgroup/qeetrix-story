import { NumberFormatter } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof NumberFormatter> = {
  title: "Primitives/NumberFormatter",
  component: NumberFormatter,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Display-only, locale-aware number formatter wrapping `Intl.NumberFormat`. Use it to render revenue in qeet-pay (₹ with `en-IN` locale), compact MAU counts in Qeet ID analytics, or percentage uptime figures in qeet-logs dashboards — all without importing a separate formatting library.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof NumberFormatter>;

export const Examples: Story = {
  render: () => (
    <div className="space-y-2 text-sm">
      <div className="flex items-center gap-3">
        <span className="w-36 text-muted-foreground">Monthly revenue</span>
        <NumberFormatter value={4_87_250} prefix="₹" locale="en-IN" className="font-semibold" />
      </div>
      <div className="flex items-center gap-3">
        <span className="w-36 text-muted-foreground">Active users (compact)</span>
        <NumberFormatter
          value={1_840_000}
          notation="compact"
          locale="en-US"
          className="font-semibold"
        />
      </div>
      <div className="flex items-center gap-3">
        <span className="w-36 text-muted-foreground">API latency p99</span>
        <NumberFormatter value={127.4} decimals={1} suffix=" ms" className="font-semibold" />
      </div>
      <div className="flex items-center gap-3">
        <span className="w-36 text-muted-foreground">Uptime (30 d)</span>
        <NumberFormatter value={99.97} decimals={2} suffix="%" className="font-semibold" />
      </div>
    </div>
  ),
};
