import { Feed, FeedItem, StatusPill, useFeedItemLabel } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { expect } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Feed> = {
  title: "Components/Data Display/Feed",
  component: Feed,
  parameters: {
    qeetrix: qx({ category: "data-display", status: "stable" }),
    layout: "padded",
    docs: {
      description: {
        component:
          "An accessible activity-feed container (`role=feed`). Each direct child is automatically wrapped in a `role=article` landmark. Supports a `busy` prop that sets `aria-busy` to signal loading state to assistive technology.\n\n`variant` picks the presentation: `card` (the default) boxes each article, for short streams of rich entries; `list` puts the articles as hairline-separated rows in one surface, for long scannable streams such as audit logs. `empty` renders in place of the feed when there are no children. The APG feed pattern requires every article to have an accessible name: pass a `FeedItem` as a direct child to set `aria-labelledby` / `aria-describedby` on the article itself (no second wrapper), or call `useFeedItemLabel` from inside an entry component to register its title, for an entry that renders its own heading.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["card", "list"],
    },
    busy: { control: "boolean" },
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

const deliveries = [
  {
    id: "wh_01",
    title: "invoice.paid delivered",
    meta: "https://hooks.acme.com/qeet · 200 · 84 ms",
  },
  {
    id: "wh_02",
    title: "payout.settled delivered",
    meta: "https://hooks.acme.com/qeet · 200 · 91 ms",
  },
  { id: "wh_03", title: "refund.created retried", meta: "https://hooks.acme.com/qeet · 503 → 200" },
];

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The same qeet-pay webhook deliveries as `card` (left) and `list` (right). Cards suit a handful of rich entries; a long, scannable stream reads better as rows in one bordered surface, where a box per entry would become a wall of boxes. Articles are focusable either way, as the feed pattern requires, and are not hover-lifted — they are not clickable.",
      },
    },
  },
  render: () => (
    <div className="grid max-w-3xl grid-cols-2 gap-6">
      <Feed variant="card" aria-label="Webhook deliveries, cards">
        {deliveries.map((delivery) => (
          <div key={delivery.id}>
            <p className="text-sm font-medium">{delivery.title}</p>
            <p className="text-sm text-muted-foreground">{delivery.meta}</p>
          </div>
        ))}
      </Feed>
      <Feed variant="list" aria-label="Webhook deliveries, list">
        {deliveries.map((delivery) => (
          <div key={delivery.id}>
            <p className="text-sm font-medium">{delivery.title}</p>
            <p className="text-sm text-muted-foreground">{delivery.meta}</p>
          </div>
        ))}
      </Feed>
    </div>
  ),
};

export const Empty: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "With no children, `empty` renders in place of the feed — so a filtered qeet-logs stream says why it is blank instead of rendering an empty `role=feed`.",
      },
    },
  },
  render: () => (
    <div className="max-w-md">
      <Feed
        aria-label="Error events"
        variant="list"
        empty="No error events in the last 24 hours. Widen the time range or clear the level filter."
      >
        {[]}
      </Feed>
    </div>
  ),
};

function NamedDeliveries() {
  const prefix = React.useId();
  return (
    <Feed variant="list" aria-label="Webhook deliveries">
      {deliveries.map((delivery) => (
        <FeedItem
          key={delivery.id}
          aria-labelledby={`${prefix}-${delivery.id}-title`}
          aria-describedby={`${prefix}-${delivery.id}-meta`}
        >
          <p id={`${prefix}-${delivery.id}-title`} className="text-sm font-medium">
            {delivery.title}
          </p>
          <p id={`${prefix}-${delivery.id}-meta`} className="text-sm text-muted-foreground">
            {delivery.meta}
          </p>
        </FeedItem>
      ))}
    </Feed>
  );
}

export const WithFeedItem: Story = {
  name: "Interaction: FeedItem names its article",
  parameters: {
    docs: {
      description: {
        story:
          "A `FeedItem` as a direct child *is* the article — no second wrapper — and carries its own `aria-labelledby` / `aria-describedby`, while the feed still supplies position, set size, focusability and variant styling. The test asserts each article is named by its title and described by its metadata.",
      },
    },
  },
  render: () => (
    <div className="max-w-md">
      <NamedDeliveries />
    </div>
  ),
  play: async ({ canvas }) => {
    const articles = canvas.getAllByRole("article");
    await expect(articles).toHaveLength(3);
    await expect(articles[0]).toHaveAccessibleName("invoice.paid delivered");
    await expect(articles[0]).toHaveAccessibleDescription(
      "https://hooks.acme.com/qeet · 200 · 84 ms",
    );
    await expect(articles[2]).toHaveAttribute("aria-posinset", "3");
    await expect(articles[2]).toHaveAttribute("aria-setsize", "3");
  },
};

interface SecurityEntryProps {
  title: string;
  detail: string;
  status: string;
}

/** A product's own feed entry: it names the article it is wrapped in from the inside. */
function SecurityEntry({ title, detail, status }: SecurityEntryProps) {
  const titleId = React.useId();
  const detailId = React.useId();
  useFeedItemLabel({ labelledBy: titleId, describedBy: detailId });
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p id={titleId} className="text-sm font-medium">
          {title}
        </p>
        <p id={detailId} className="text-sm text-muted-foreground">
          {detail}
        </p>
      </div>
      <StatusPill status={status} />
    </div>
  );
}

export const WithFeedItemLabel: Story = {
  name: "Interaction: useFeedItemLabel names its article",
  parameters: {
    docs: {
      description: {
        story:
          "An auto-wrapped child cannot pass attributes up to the article around it, so a reusable entry component calls `useFeedItemLabel` with its title and summary ids instead. It is a no-op outside a `Feed`, and registers after mount, so server HTML and the first client render agree. The test asserts the Qeet ID security entries are named by their titles, not by their whole text.",
      },
    },
  },
  render: () => (
    <div className="max-w-md">
      <Feed aria-label="Security activity">
        <SecurityEntry
          title="New device sign-in"
          detail="Chrome on macOS · Bengaluru · 2m ago"
          status="verified"
        />
        <SecurityEntry
          title="Recovery codes viewed"
          detail="ada@acme.com · 1h ago"
          status="unverified"
        />
        <SecurityEntry
          title="Session revoked"
          detail="Safari on iPhone · 3h ago"
          status="revoked"
        />
      </Feed>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(
      await canvas.findByRole("article", { name: "New device sign-in" }),
    ).toHaveAccessibleDescription("Chrome on macOS · Bengaluru · 2m ago");
    await expect(canvas.getByRole("article", { name: "Session revoked" })).toBeInTheDocument();
  },
};
