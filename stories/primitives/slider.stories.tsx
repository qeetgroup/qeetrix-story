import { Slider } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Slider> = {
  title: "Primitives/Slider",
  component: Slider,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A draggable range control for selecting a numeric value within a bounded range. Use `defaultValue` for uncontrolled usage or `value` + `onValueChange` for controlled. Common uses include log sampling rate in qeet-logs and rate-limiting thresholds in Qeet ID security settings.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Log sampling rate for a qeet-logs stream — set to 40% to reduce ingestion volume without losing signal.",
      },
    },
  },
  render: () => (
    <div className="w-72">
      <Slider aria-label="Log sampling rate (%)" defaultValue={40} max={100} step={5} />
    </div>
  ),
};

export const RateLimit: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Request rate-limit cap per minute for a Qeet ID application — stepped in increments of 50.",
      },
    },
  },
  render: () => (
    <div className="w-72">
      <Slider
        aria-label="Max requests per minute"
        defaultValue={500}
        min={50}
        max={2000}
        step={50}
      />
    </div>
  ),
};
