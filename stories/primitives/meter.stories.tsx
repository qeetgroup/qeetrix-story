import { Meter } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Meter> = {
  title: "Primitives/Meter",
  component: Meter,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A labelled progress-style bar that represents a scalar measurement within a known range — storage, seats, API quota, bandwidth. Supports `default`, `warning`, and `danger` intents and accepts any `Intl.NumberFormat` options via the `format` prop.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Meter>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Basic usage with a percent-formatted value. The bar fills to 68 % of its track.",
      },
    },
  },
  render: () => (
    <div className="w-72">
      <Meter label="Storage used" value={0.68} max={1} format={{ style: "percent" }} />
    </div>
  ),
};

export const Intents: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Three intent levels side by side: default (within limit), `warning` (approaching limit), and `danger` (critical). Use `warning` above ~80 % and `danger` above ~95 %.",
      },
    },
  },
  render: () => (
    <div className="flex w-72 flex-col gap-5">
      <Meter label="Seats used" value={18} max={50} />
      <Meter
        label="Bandwidth"
        value={0.82}
        max={1}
        format={{ style: "percent" }}
        intent="warning"
      />
      <Meter label="API quota" value={0.96} max={1} format={{ style: "percent" }} intent="danger" />
    </div>
  ),
};

export const TenantUsage: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A billing/usage panel for a Qeet ID Enterprise tenant, combining decimal and percent formats across three resource dimensions. The log-retention meter is in `warning` state to prompt the user to adjust their retention policy before hitting the cap.",
      },
    },
  },
  render: () => (
    <div className="flex w-80 flex-col gap-5 rounded-lg border p-5">
      <p className="text-sm font-semibold">Plan usage — June 2026</p>
      <Meter label="Members" value={47} max={100} />
      <Meter label="Monthly API calls" value={840000} max={1000000} format={{ style: "decimal" }} />
      <Meter
        label="Log retention"
        value={0.73}
        max={1}
        format={{ style: "percent" }}
        intent="warning"
      />
    </div>
  ),
};
