import { Progress } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof Progress> = {
  title: "Components/Feedback/Progress",
  component: Progress,
  parameters: {
    qeetrix: qx({ category: "feedback", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          'A horizontal progress bar (`role="progressbar"`) for long-running operations. Accepts a numeric `value` (0–100) for a determinate state or `null` for an indeterminate state while the total is unknown — a segment sweeping along the track, or a static hatched fill under reduced motion, so busy never reads as done. `size` sets the track thickness: `sm` (4px), `md` (8px, the default) or `lg` (12px) — a fixed scale shared with Meter via `progressTrackVariants`, not density-resolved. Name it with a visible `label` (which also shows the formatted value; `hideValue` drops it) or with `aria-label`.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
    },
    hideValue: { control: "boolean" },
  },
};
export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "In-progress state for a long-running operation, such as a Qeet ID database migration or bulk user import.",
      },
    },
  },
  render: () => (
    <div className="w-72">
      <Progress value={60} aria-label="Database schema migration — 60% complete" />
    </div>
  ),
};

export const Complete: Story = {
  parameters: {
    docs: {
      description: {
        story: "Value of 100 fills the track completely.",
      },
    },
  },
  render: () => (
    <div className="w-72">
      <Progress value={100} aria-label="Database schema migration — complete" />
    </div>
  ),
};

export const Indeterminate: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pass `value={null}` while the total is unknown — for example while an export is being queued. A 40% segment sweeps along the track; under reduced motion it becomes a static hatched fill.",
      },
    },
  },
  render: () => (
    <div className="w-72">
      <Progress value={null} aria-label="Syncing audit log events" />
    </div>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`sm` for a thin bar inside a table row or a file card, `md` (the default) for most forms and panels, `lg` for a page-level task such as an import that is the only thing on screen. The scale is fixed rather than following the density mode, so a Progress and a Meter of the same size line up.",
      },
    },
  },
  render: () => (
    <div className="flex w-72 flex-col gap-5">
      <Progress size="sm" value={35} label="Invoice PDFs generated · sm" />
      <Progress size="md" value={60} label="Members imported · md" />
      <Progress size="lg" value={85} label="Log archive uploaded · lg" />
    </div>
  ),
};

export const WithLabel: Story = {
  args: { value: 42, size: "md", label: "Importing users from Okta", hideValue: false },
  parameters: {
    docs: {
      description: {
        story:
          "A visible `label` names the progressbar — no `aria-label` needed — and shows the formatted value opposite it. Set `hideValue` when the value would repeat what the label already says, or when only the movement matters.",
      },
    },
  },
  render: (args) => (
    <div className="flex w-72 flex-col gap-5">
      <Progress {...args} />
      <Progress value={75} label="Settlement file 3 of 4 reconciled" hideValue />
    </div>
  ),
};
