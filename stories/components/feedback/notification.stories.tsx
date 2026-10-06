import { WebhookIcon } from "@qeetrix/icons";
import { Badge, Button, Notification, notificationIconVariants } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof Notification> = {
  title: "Components/Feedback/Notification",
  component: Notification,
  parameters: {
    qeetrix: qx({ category: "feedback", status: "stable" }),
    layout: "padded",
    docs: {
      description: {
        component:
          'Structured in-app notification card used by qeet-notify and the Qeet ID notification centre. Renders a title, description, optional `action` button, a `time` stamp, an `unread` marker, and a loading state for async events such as directory syncs or webhook deliveries. Use `variant` (`info` | `success` | `warning` | `destructive`; `error` is an accepted alias) to signal intent — the status lives in the icon tile, on a neutral card, so a feed of mixed events reads as one calm list. `size` is `default` or the compact `sm` for dense feeds. Close via `onClose`. `destructive` is announced assertively (`role="alert"`), the rest politely (`role="status"`); in a long feed pass `role={undefined}` and `aria-live="off"` (see Feed). `notificationIconVariants` exports the icon tile for custom rows that should match.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["info", "success", "warning", "destructive", "error"],
    },
    size: {
      control: "inline-radio",
      options: ["default", "sm"],
    },
    unread: { control: "boolean" },
    loading: { control: "boolean" },
  },
};
export default meta;
type Story = StoryObj<typeof Notification>;

export const Default: Story = {
  args: {
    variant: "info",
    title: "Passkey added",
    description: "A passkey for MacBook Pro was registered to your Qeet ID account.",
    time: "2m ago",
  },
  parameters: {
    docs: {
      description: {
        story:
          "A single event card driven by the controls panel — flip `size`, `unread` and `loading` to see how the card adapts.",
      },
    },
  },
  render: (args) => (
    <div className="w-96">
      <Notification {...args} />
    </div>
  ),
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "All four intent variants with realistic Qeet copy — map these to your notification event types. `destructive` is the canonical name for the error tone; `error` renders identically and keeps working for older call sites.",
      },
    },
  },
  render: () => (
    <div className="flex w-96 flex-col gap-3">
      <Notification
        variant="info"
        title="Heads up"
        description="Your trial ends in 3 days."
        onClose={() => {}}
      />
      <Notification
        variant="success"
        title="Saved"
        description="Your changes are live."
        onClose={() => {}}
      />
      <Notification
        variant="warning"
        title="Usage high"
        description="You're near your plan limit."
        onClose={() => {}}
      />
      <Notification
        variant="destructive"
        title="Payment failed"
        description="Update your card to continue."
        onClose={() => {}}
      />
    </div>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`size="default"` for a standalone card or a roomy notification centre; `size="sm"` tightens the padding and shrinks the icon tile for dense feeds and side panels.',
      },
    },
  },
  render: () => (
    <div className="flex w-96 flex-col gap-3">
      <Notification
        size="default"
        variant="success"
        title="Payout settled"
        description="₹4,82,310.50 was credited to HDFC ••4821."
        time="09:42"
        onClose={() => {}}
      />
      <Notification
        size="sm"
        variant="success"
        title="Payout settled"
        description="₹4,82,310.50 was credited to HDFC ••4821."
        time="09:42"
        onClose={() => {}}
      />
    </div>
  ),
};

/**
 * A feed item is not news on its own. `role={undefined}` drops the status/alert role, but the
 * card also sets `aria-live` itself, so that has to be switched off as well for the item to stop
 * being a live region.
 */
const QUIET = { role: undefined, "aria-live": "off" } as const;

export const Feed: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A compact feed: `size="sm"` cards with a `time` stamp, and `unread` for events the user has not seen (a Qeet dot and a semibold title). The dot is decorative, so the list says how many are unread. Each card passes `role={undefined}` and `aria-live="off"` so a long feed is not a stack of live regions.',
      },
    },
  },
  render: () => (
    <section aria-label="Activity, 2 unread" className="flex w-96 flex-col gap-2">
      <Notification
        {...QUIET}
        size="sm"
        unread
        variant="destructive"
        title="Webhook delivery failed"
        description="Qeet Notify got a 503 from hooks.acme.com."
        time="1m ago"
      />
      <Notification
        {...QUIET}
        size="sm"
        unread
        variant="warning"
        title="Log quota at 92%"
        description="qeet-logs will start sampling at 100%."
        time="18m ago"
      />
      <Notification
        {...QUIET}
        size="sm"
        variant="success"
        title="SCIM sync complete"
        description="214 users imported from Okta."
        time="1h ago"
      />
      <Notification
        {...QUIET}
        size="sm"
        variant="info"
        title="New sign-in method"
        description="Passkeys are now available for your workspace."
        time="Yesterday"
      />
    </section>
  ),
};

export const IconVariants: Story = {
  name: "Icon tile (notificationIconVariants)",
  parameters: {
    docs: {
      description: {
        story:
          "`notificationIconVariants({ variant, size })` returns the classes of the card's icon tile. Use it when an event appears somewhere a full card does not fit — a table row, a delivery log — so the status reads the same as in the notification centre. Pass your own glyph; the tile sizes it. Mark the tile `aria-hidden` and say the status in text.",
      },
    },
  },
  render: () => (
    <ul className="flex w-96 flex-col divide-y divide-border rounded-lg border border-border text-sm">
      {(
        [
          ["success", "invoice.paid", "200 OK"],
          ["warning", "user.updated", "Retrying"],
          ["destructive", "payout.failed", "503 Error"],
        ] as const
      ).map(([variant, event, status]) => (
        <li key={event} className="flex items-center gap-3 px-3 py-2">
          <span aria-hidden className={notificationIconVariants({ variant, size: "sm" })}>
            <WebhookIcon />
          </span>
          <span className="min-w-0 flex-1 font-mono text-xs">{event}</span>
          <Badge variant={variant}>{status}</Badge>
        </li>
      ))}
    </ul>
  ),
};

export const WithAction: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Notification with an action button — prompt the user to review a suspicious sign-in or remediate a warning.",
      },
    },
  },
  render: () => (
    <div className="w-96">
      <Notification
        variant="info"
        title="New device sign-in"
        description="A new device signed in from Chennai."
        action={
          <Button size="sm" variant="outline">
            Review
          </Button>
        }
        onClose={() => {}}
      />
    </div>
  ),
};

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Loading state for long-running async operations such as SCIM directory syncs or bulk log exports.",
      },
    },
  },
  render: () => (
    <div className="w-96">
      <Notification
        variant="info"
        loading
        title="Syncing…"
        description="Importing your directory."
      />
    </div>
  ),
};
