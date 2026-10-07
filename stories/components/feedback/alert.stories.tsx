import {
  CircleCheckIcon,
  CircleXIcon,
  InfoIcon,
  KeyRoundIcon,
  TriangleAlertIcon,
  XIcon,
} from "@qeetrix/icons";
import { Alert, AlertAction, AlertDescription, AlertTitle, Button, IconButton } from "@qeetrix/ui";
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
          'Contextual inline feedback for the current page — security notices in Qeet ID, quota warnings in qeet-logs, or payment failures in qeet-pay. Use `variant` (`default` | `info` | `success` | `warning` | `destructive`) to signal intent; `danger` is an accepted alias of `destructive`. Status variants draw a subtle tint, a 3px inline-start accent bar and a title in the status colour, with neutral description prose. `emphasis="strong"` swaps that for a solid status fill — reserve it for messages that must not be missed. Put the icon first, then `AlertTitle` / `AlertDescription`, and an optional trailing `AlertAction`. Alert is `role="alert"` (assertive); pass `role="status"` for a notice that is present on load or merely informational. For page-level announcements that span the full viewport, use `Banner` instead.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "info", "success", "warning", "destructive", "danger"],
    },
    emphasis: {
      control: "inline-radio",
      options: ["subtle", "strong"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: { variant: "info" },
  render: (args) => (
    <Alert {...args} className="max-w-md">
      <InfoIcon />
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
          "The neutral `default` and the four status variants side by side — match the variant to the urgency of the message. Status variants carry a 3px accent bar and a title in the status colour; the description stays neutral so dense screens stay calm. `destructive` is the canonical name; `danger` renders identically and keeps working for older call sites.",
      },
    },
  },
  render: () => (
    <div className="flex max-w-md flex-col gap-3">
      <Alert>
        <KeyRoundIcon />
        <AlertTitle>Signing key generated</AlertTitle>
        <AlertDescription>
          The new key becomes active for Qeet ID token signing at the next rotation.
        </AlertDescription>
      </Alert>
      <Alert variant="info">
        <InfoIcon />
        <AlertTitle>Scheduled maintenance</AlertTitle>
        <AlertDescription>
          We&apos;ll be performing upgrades on Sunday at 02:00 UTC.
        </AlertDescription>
      </Alert>
      <Alert variant="success">
        <CircleCheckIcon />
        <AlertTitle>Payment received</AlertTitle>
        <AlertDescription>Your invoice has been settled.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <TriangleAlertIcon />
        <AlertTitle>Approaching quota</AlertTitle>
        <AlertDescription>You&apos;ve used 80% of your monthly event budget.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <CircleXIcon />
        <AlertTitle>Connection failed</AlertTitle>
        <AlertDescription>We couldn&apos;t reach the upstream service. Retrying…</AlertDescription>
      </Alert>
    </div>
  ),
};

export const Emphasis: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`emphasis="strong"` is a solid, theme-invariant status fill with an on-fill label (white, or near-black on amber). Use it sparingly, for a message the user must not miss — a suspended account, paused payouts, a blocking error. Everything else stays on the default `emphasis="subtle"`. The neutral `default` variant has no strong fill.',
      },
    },
  },
  render: () => (
    <div className="flex max-w-md flex-col gap-3">
      <Alert variant="info" emphasis="strong">
        <InfoIcon />
        <AlertTitle>Read-only mode</AlertTitle>
        <AlertDescription>
          The Qeet ID admin console is read-only until the ap-south-1 migration completes.
        </AlertDescription>
      </Alert>
      <Alert variant="success" emphasis="strong">
        <CircleCheckIcon />
        <AlertTitle>Domain verified</AlertTitle>
        <AlertDescription>Branded login is live on acme.id.qeet.in.</AlertDescription>
      </Alert>
      <Alert variant="warning" emphasis="strong">
        <TriangleAlertIcon />
        <AlertTitle>Payouts paused</AlertTitle>
        <AlertDescription>
          qeet-pay has held settlements until your KYC documents are re-verified.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive" emphasis="strong">
        <CircleXIcon />
        <AlertTitle>Account suspended</AlertTitle>
        <AlertDescription>
          Sign-ins are blocked for this workspace. Contact your Qeet ID administrator.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

export const WithAction: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`AlertAction` puts trailing controls in their own column at the inline end, vertically centred against the message — a Retry or View details button, or a dismiss `IconButton` (which needs an `aria-label`). It works on both emphases. Keep it to one or two controls; anything more is a form, not an alert.",
      },
    },
  },
  render: () => (
    <div className="flex max-w-lg flex-col gap-3">
      <Alert variant="destructive">
        <CircleXIcon />
        <AlertTitle>Webhook delivery failed</AlertTitle>
        <AlertDescription>
          Qeet Notify got a 503 from hooks.acme.com on the last three attempts.
        </AlertDescription>
        <AlertAction>
          <Button size="sm" variant="outline">
            Retry
          </Button>
        </AlertAction>
      </Alert>
      <Alert variant="info" role="status">
        <InfoIcon />
        <AlertTitle>New log retention policy</AlertTitle>
        <AlertDescription>qeet-logs now keeps debug-level events for 7 days.</AlertDescription>
        <AlertAction>
          <IconButton icon={XIcon} aria-label="Dismiss retention notice" size="icon-sm" />
        </AlertAction>
      </Alert>
      <Alert variant="warning" emphasis="strong">
        <TriangleAlertIcon />
        <AlertTitle>Card expires this week</AlertTitle>
        <AlertDescription>Update it to keep your qeet-pay subscription active.</AlertDescription>
        <AlertAction>
          <Button size="sm" variant="outline">
            Update card
          </Button>
        </AlertAction>
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
      <TriangleAlertIcon />
      <AlertTitle>Your trial ends in 3 days.</AlertTitle>
    </Alert>
  ),
};
