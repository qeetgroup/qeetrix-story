import { ProgressCircle } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof ProgressCircle> = {
  title: "Components/Feedback/ProgressCircle",
  component: ProgressCircle,
  parameters: {
    qeetrix: qx({ category: "feedback", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          'A circular SVG progress indicator for quota usage, upload progress, and completion rates. Accepts a numeric `value` (0–100, clamped). `size` can be a named token — `"sm"` (40 px, label hidden by default), `"md"` (60 px, default), `"lg"` (80 px) — or an explicit pixel number. The centre label defaults to the percentage string for md/lg; pass a custom `label` to render any React node, or `showLabel={false}` to suppress it. Accessible via `role="progressbar"` with `aria-valuenow/min/max`.',
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ProgressCircle>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Medium size at 65% — Qeet Logs ingestion quota usage indicator in a settings panel.",
      },
    },
  },
  render: () => <ProgressCircle value={65} aria-label="Ingestion quota — 65% used" />,
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "All three named sizes side-by-side: sm (40 px, no label), md (60 px), and lg (80 px).",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-6">
      <ProgressCircle value={40} size="sm" aria-label="Storage — 40% used" />
      <ProgressCircle value={40} size="md" aria-label="Storage — 40% used" />
      <ProgressCircle value={40} size="lg" aria-label="Storage — 40% used" />
    </div>
  ),
};

export const Values: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Completion states from 0% to 100% — values are clamped automatically if out of range.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-4">
      <ProgressCircle value={0} aria-label="0% complete" />
      <ProgressCircle value={25} aria-label="25% complete" />
      <ProgressCircle value={50} aria-label="50% complete" />
      <ProgressCircle value={75} aria-label="75% complete" />
      <ProgressCircle value={100} aria-label="100% complete" />
    </div>
  ),
};

export const CustomSize: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Explicit pixel size (96 px) with a heavier stroke — used in dashboard hero stat widgets.",
      },
    },
  },
  render: () => (
    <ProgressCircle
      value={82}
      size={96}
      strokeWidth={10}
      aria-label="Monthly API calls — 82% of quota"
    />
  ),
};

export const CustomLabel: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Custom `label` renders any React node at the centre — useful for multi-line readings or icon badges.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-6">
      <ProgressCircle
        value={73}
        size="lg"
        label={
          <span className="flex flex-col items-center leading-none">
            <span className="text-[11px] font-bold">73%</span>
            <span className="text-[9px] text-muted-foreground">used</span>
          </span>
        }
        aria-label="API calls — 73% of monthly quota used"
      />
      <ProgressCircle
        value={100}
        size="lg"
        label={<span className="text-xs font-semibold text-success">Done</span>}
        aria-label="Migration complete"
      />
    </div>
  ),
};

export const StrokeWidths: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Override `strokeWidth` for different visual hierarchies — thin for ambient indicators, heavy for primary progress.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-6">
      <ProgressCircle value={60} size={72} strokeWidth={3} aria-label="Thin ring — 60%" />
      <ProgressCircle value={60} size={72} strokeWidth={7} aria-label="Default ring — 60%" />
      <ProgressCircle value={60} size={72} strokeWidth={14} aria-label="Heavy ring — 60%" />
    </div>
  ),
};

export const LabelHidden: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pass `showLabel={false}` to hide the centre percentage on md/lg sizes — for layouts where the label would be redundant.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-4">
      <ProgressCircle value={30} showLabel={false} aria-label="30% complete" />
      <ProgressCircle value={60} showLabel={false} aria-label="60% complete" />
      <ProgressCircle value={90} showLabel={false} aria-label="90% complete" />
    </div>
  ),
};
