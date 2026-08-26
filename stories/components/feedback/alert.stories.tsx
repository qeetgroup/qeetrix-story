import { CloseCircle, Danger, InfoCircle, TickCircle } from "@qeetrix/icons";
import { Alert, AlertDescription, AlertTitle } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof Alert> = {
  title: "Components/Feedback/Alert",
  component: Alert,
  parameters: {
    qeetrix: qx({ category: "feedback", status: "stable" }),
    layout: "padded",
    docs: {
      description: {
        component:
          "Contextual inline feedback for the current page — security notices in Qeet ID, quota warnings in qeet-logs, or payment failures in qeet-pay. Use `variant` (`info` | `success` | `warning` | `danger`) to signal intent. For page-level announcements that span the full viewport, use `Banner` instead.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "info", "success", "warning", "danger"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: { variant: "info" },
  render: (args) => (
    <Alert {...args} className="max-w-md">
      <InfoCircle />
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>
        Your API keys rotate automatically every 90 days. No action needed.
      </AlertDescription>
    </Alert>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Default info alert — use for non-critical notices that don't require immediate action.",
      },
    },
  },
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "All four semantic variants side-by-side — use the appropriate one to match the urgency of the message.",
      },
    },
  },
  render: () => (
    <div className="flex max-w-md flex-col gap-3">
      <Alert variant="info">
        <InfoCircle />
        <AlertTitle>Scheduled maintenance</AlertTitle>
        <AlertDescription>
          We&apos;ll be performing upgrades on Sunday at 02:00 UTC.
        </AlertDescription>
      </Alert>
      <Alert variant="success">
        <TickCircle />
        <AlertTitle>Payment received</AlertTitle>
        <AlertDescription>Your invoice has been settled.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <Danger />
        <AlertTitle>Approaching quota</AlertTitle>
        <AlertDescription>You&apos;ve used 80% of your monthly event budget.</AlertDescription>
      </Alert>
      <Alert variant="danger">
        <CloseCircle />
        <AlertTitle>Connection failed</AlertTitle>
        <AlertDescription>We couldn&apos;t reach the upstream service. Retrying…</AlertDescription>
      </Alert>
    </div>
  ),
};

export const TitleOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Title-only alert for brief, scannable warnings where a full description would be redundant.",
      },
    },
  },
  render: () => (
    <Alert variant="warning" className="max-w-md">
      <Danger />
      <AlertTitle>Your trial ends in 3 days.</AlertTitle>
    </Alert>
  ),
};
