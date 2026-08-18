import { Feed } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Feed> = {
  title: "Primitives/Feed",
  component: Feed,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "An accessible activity-feed container (`role=feed`). Each direct child is automatically wrapped in a `role=article` landmark. Supports a `busy` prop that sets `aria-busy` to signal loading state to assistive technology.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Feed>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A Qeet ID security-activity feed showing the three most recent events for a user session. Each item is a simple two-line layout: event title + contextual metadata.",
      },
    },
  },
  render: () => (
    <div className="max-w-md">
      <Feed aria-label="Recent activity">
        <div>
          <p className="text-sm font-medium">New device sign-in</p>
          <p className="text-sm text-muted-foreground">Chrome on macOS · 2m ago</p>
        </div>
        <div>
          <p className="text-sm font-medium">Passkey added</p>
          <p className="text-sm text-muted-foreground">iPhone · 1h ago</p>
        </div>
        <div>
          <p className="text-sm font-medium">Role changed to Admin</p>
          <p className="text-sm text-muted-foreground">by jordan@acme.com · 3h ago</p>
        </div>
      </Feed>
    </div>
  ),
};

export const NotificationFeed: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A qeet-notify notification inbox feed. Demonstrates mixed notification types — deployment events, security alerts, billing confirmations, and webhook failure warnings — in a single scrollable list.",
      },
    },
  },
  render: () => (
    <div className="max-w-md">
      <Feed aria-label="Notifications">
        <div>
          <p className="text-sm font-medium">Deployment complete</p>
          <p className="text-sm text-muted-foreground">
            Your Qeet ID staging deployment finished · 5m ago
          </p>
        </div>
        <div>
          <p className="text-sm font-medium">New sign-in from unknown device</p>
          <p className="text-sm text-muted-foreground">
            Safari on Windows · ada@acme.com · 12m ago
          </p>
        </div>
        <div>
          <p className="text-sm font-medium">Invoice ₹42,500 paid</p>
          <p className="text-sm text-muted-foreground">Acme Inc. Enterprise plan · Jun 1, 2026</p>
        </div>
        <div>
          <p className="text-sm font-medium">Webhook delivery failed</p>
          <p className="text-sm text-muted-foreground">
            3 consecutive failures to https://hooks.acme.com/qeet · 2h ago
          </p>
        </div>
      </Feed>
    </div>
  ),
};

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The `busy` prop sets `aria-busy` on the feed container, signalling assistive technology that items are still loading.",
      },
    },
  },
  render: () => (
    <div className="max-w-md">
      <Feed busy aria-label="Loading activity">
        <div>
          <p className="text-sm text-muted-foreground">Loading…</p>
          <div className="h-4 w-48 animate-pulse rounded bg-muted" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Loading…</p>
          <div className="h-4 w-48 animate-pulse rounded bg-muted" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Loading…</p>
          <div className="h-4 w-48 animate-pulse rounded bg-muted" />
        </div>
      </Feed>
    </div>
  ),
};
