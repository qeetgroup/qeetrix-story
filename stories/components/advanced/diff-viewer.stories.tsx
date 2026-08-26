import { DiffViewer } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const BEFORE = `{
  "name": "qeet-id",
  "replicas": 2,
  "region": "ap-south-1"
}`;
const AFTER = `{
  "name": "qeet-id",
  "replicas": 4,
  "region": "ap-south-2",
  "tls": true
}`;

const meta: Meta<typeof DiffViewer> = {
  title: "Components/Advanced/DiffViewer",
  component: DiffViewer,
  parameters: {
    qeetrix: qx({ category: "advanced", status: "stable" }),
    layout: "padded",
    docs: {
      description: {
        component:
          'Side-by-side or unified text diff viewer used in qeet-logs and qeet-id to surface configuration changes and audit diffs. Switch between `mode="unified"` (single-column inline ±) and `mode="split"` (before/after columns) via the `argTypes` control above.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    mode: { control: "inline-radio", options: ["unified", "split"] },
  },
};
export default meta;
type Story = StoryObj<typeof DiffViewer>;

export const Unified: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Unified diff — added/removed lines interleaved in a single column; preferred for narrow panels in the qeet-logs sidebar.",
      },
    },
  },
  args: { before: BEFORE, after: AFTER, mode: "unified" },
};

export const Split: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Split diff — before on the left, after on the right; preferred for full-width audit-detail views where the reader needs to scan both states in parallel.",
      },
    },
  },
  args: { before: BEFORE, after: AFTER, mode: "split" },
};
