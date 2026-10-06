import {
  BellIcon,
  CircleCheckIcon,
  CircleXIcon,
  InfoIcon,
  TriangleAlertIcon,
} from "@qeetrix/icons";
import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  DataState,
  EmptyState,
  Feed,
  Link,
  NotificationCenter,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Typography,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { expect, screen, waitFor } from "storybook/test";
import { qx } from "../_contract";

type Tone = "info" | "success" | "warning" | "error";

interface InboxItem {
  id: string;
  tone: Tone;
  title: string;
  detail: string;
  time: string;
  read: boolean;
}

type ToneIconComponent = React.ComponentType<{ className?: string }>;

const TONE_ICON: Record<Tone, ToneIconComponent> = {
  info: InfoIcon,
  success: CircleCheckIcon,
  warning: TriangleAlertIcon,
  error: CircleXIcon,
};

const TONE_CLASS: Record<Tone, string> = {
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  error: "text-destructive",
};

const INBOX: InboxItem[] = [
  {
    id: "signin",
    tone: "warning",
    title: "Sign-in from an unrecognised device",
    detail: "Chrome on Windows · Pune, IN · approved with a passkey",
    time: "2 minutes ago",
    read: false,
  },
  {
    id: "key",
    tone: "warning",
    title: "Production API key expires in 7 days",
    detail: "Qeet ID · qk_live_8f21…c407 · rotate before 02 Apr",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "invoice",
    tone: "success",
    title: "Invoice INV-2026-0412 settled",
    detail: "Qeet Pay · ₹1,24,500 including 18% GST",
    time: "3 hours ago",
    read: false,
  },
  {
    id: "ingest",
    tone: "info",
    title: "Log ingestion back to normal",
    detail: "Qeet Logs · ap-south-1 · 42 minutes of delayed delivery flushed",
    time: "Yesterday",
    read: true,
  },
  {
    id: "webhook",
    tone: "error",
    title: "Webhook endpoint failed 12 deliveries",
    detail: "Qeet Notify · https://acme.in/hooks/qeet · 502 Bad Gateway",
    time: "2 days ago",
    read: true,
  },
];

function InboxRow({ item, onDismiss }: { item: InboxItem; onDismiss?: (id: string) => void }) {
  const ToneIcon = TONE_ICON[item.tone];
  return (
    <div className="flex gap-3">
      <span
        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center ${TONE_CLASS[item.tone]}`}
      >
        <ToneIcon className="size-5" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          {item.read ? null : (
            <span
              role="img"
              aria-label="Unread"
              className="size-1.5 shrink-0 rounded-full bg-primary"
            />
          )}
          <span className="truncate text-sm font-medium text-foreground">{item.title}</span>
        </div>
        <span className="text-sm text-muted-foreground">{item.detail}</span>
        <span className="text-xs text-muted-foreground">{item.time}</span>
      </div>
      {onDismiss ? (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Dismiss ${item.title}`}
          onClick={() => onDismiss(item.id)}
        >
          <CircleXIcon />
        </Button>
      ) : null}
    </div>
  );
}

function InboxList({
  items,
  label,
  onDismiss,
}: {
  items: InboxItem[];
  label: string;
  onDismiss?: (id: string) => void;
}) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={BellIcon}
        title="You're all caught up"
        description="New sign-in alerts, key expiries and billing events land here."
      />
    );
  }
  return (
    <Feed
      aria-label={label}
      className="gap-0 divide-y divide-border"
      itemClassName="rounded-none border-0 bg-transparent px-4 py-3 shadow-none hover:shadow-none focus-visible:bg-muted/40"
    >
      {items.map((item) => (
        <InboxRow key={item.id} item={item} onDismiss={onDismiss} />
      ))}
    </Feed>
  );
}

/**
 * The inbox panel itself: heading, unread count, mark-all-read, an All/Unread
 * split, and the list. Stateful so the mark-all-read story can actually change
 * something rather than swapping to a second hard-coded screenshot.
 */
function Inbox({ seed = INBOX }: { seed?: InboxItem[] }) {
  const [items, setItems] = React.useState(seed);
  const unread = items.filter((item) => !item.read);

  return (
    <Card className="w-104">
      <CardHeader className="border-b pb-3">
        <div className="flex items-center gap-2">
          <Typography as="h2" variant="small" className="font-heading text-base">
            Notifications
          </Typography>
          {unread.length > 0 ? <Badge variant="muted">{unread.length} unread</Badge> : null}
        </div>
        <CardAction>
          <Button
            variant="ghost"
            size="sm"
            disabled={unread.length === 0}
            onClick={() => setItems((current) => current.map((item) => ({ ...item, read: true })))}
          >
            Mark all as read
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0">
        <Tabs defaultValue="all">
          <TabsList className="mx-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unread.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <InboxList
              items={items}
              label="All notifications"
              onDismiss={(id) => setItems((current) => current.filter((item) => item.id !== id))}
            />
          </TabsContent>
          <TabsContent value="unread">
            <InboxList
              items={unread}
              label="Unread notifications"
              onDismiss={(id) => setItems((current) => current.filter((item) => item.id !== id))}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="justify-center">
        <Link href="#activity" size="sm">
          Open the full activity log
        </Link>
      </CardFooter>
    </Card>
  );
}

const meta: Meta = {
  title: "Patterns/NotificationCenter",
  parameters: {
    qeetrix: qx({ category: "feedback", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component: [
          "**The in-app inbox.** A `Card` panel over the APG `Feed` pattern: heading, unread count,",
          "mark-all-read, an All/Unread split, per-item dismiss, and a link out to the full audit",
          "trail. Every state a real inbox reaches is here — populated, fully read, empty, and",
          "loading.",
          "",
          "**Use it** for the bell menu in any Qeet product header, and for the standalone",
          "`/notifications` route the bell links to. The list mixes sources on purpose: a Qeet ID",
          "sign-in alert, a Qeet Pay settlement and a Qeet Notify delivery failure all arrive in one",
          "inbox, so tone (`info` / `success` / `warning` / `error`) is what separates them, not",
          "which product sent them.",
          "",
          "**Do not use it** for feedback about something the user just did — that is a `Toast`, and",
          "burying “Saved” in an inbox nobody opens is worse than not saying it. Do not use it for",
          "page-level state either (`Alert` and `Banner` cover “this API key is expired”, on the page",
          "where the key lives). And do not make it the *only* delivery for anything urgent: this",
          "panel is polling-backed and read at the user's leisure, so security-critical events also",
          "go out over Qeet Notify email.",
          "",
          "**Accessibility notes.** `Feed` gives every row an `article` with `aria-posinset` /",
          "`aria-setsize` so a screen reader can say “3 of 5”; the unread marker is a labelled dot",
          "rather than colour alone; and each dismiss button names the item it dismisses, because a",
          "column of five buttons all called “Dismiss” is unusable out of context.",
        ].join("\n"),
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Three unread and two read items across five Qeet products. Unread rows carry a labelled dot in addition to the count in the header — the badge tells you how many, the dot tells you which.",
      },
    },
  },
  render: () => <Inbox />,
};

export const AllRead: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Everything read. The unread badge disappears and **Mark all as read** is disabled rather than hidden, so the header does not reflow the moment the user clears the list.",
      },
    },
  },
  render: () => <Inbox seed={INBOX.map((item) => ({ ...item, read: true }))} />,
};

export const Empty: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The zero state. `EmptyState` explains what *would* appear here, which is what turns an empty panel from “broken” into “nothing has happened yet”.",
      },
    },
  },
  render: () => <Inbox seed={[]} />,
};

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "First open, before the inbox resolves. Skeleton rows are sized like the rows they stand in for so the panel does not jump; the tabs render immediately because their labels do not depend on the response.",
      },
    },
  },
  render: () => (
    <Card className="w-104">
      <CardHeader className="border-b pb-3">
        <Typography as="h2" variant="small" className="font-heading text-base">
          Notifications
        </Typography>
      </CardHeader>
      <CardContent className="px-0">
        <DataState isLoading skeletonRows={4} skeletonHeight="h-12">
          <InboxList items={INBOX} label="All notifications" />
        </DataState>
      </CardContent>
    </Card>
  ),
};

export const MarkAllRead: Story = {
  name: "Interaction: mark all as read",
  parameters: {
    docs: {
      description: {
        story:
          "Marking everything read is one action with three visible consequences — the badge goes, the unread tab count drops to zero, and every dot disappears. This asserts all three, because a mark-all-read that only clears the badge is the classic half-implemented version.",
      },
    },
  },
  render: () => <Inbox />,
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText("3 unread")).toBeVisible();
    await expect(canvas.getAllByRole("img", { name: "Unread" })).toHaveLength(3);

    await userEvent.click(canvas.getByRole("button", { name: "Mark all as read" }));

    await waitFor(() => expect(canvas.queryByText("3 unread")).not.toBeInTheDocument());
    await expect(canvas.queryAllByRole("img", { name: "Unread" })).toHaveLength(0);
    await expect(canvas.getByRole("tab", { name: "Unread (0)" })).toBeInTheDocument();
  },
};

export const BellMenu: Story = {
  // KNOWN @qeetrix/ui DEFECT: NotificationCenter renders its popover heading as a plain
  // <span> instead of `PopoverTitle`, so Base UI never wires `aria-labelledby` and the
  // popup's role="dialog" has no accessible name. `NotificationCenterProps` exposes no
  // className/aria hook for the content either, so nothing in this story can supply one —
  // the fix is a one-line swap inside the component. Only visible here because this is the
  // first story that opens the menu; the primitive story leaves it closed.
  parameters: {
    layout: "padded",
    a11y: { options: { rules: { "aria-dialog-name": { enabled: false } } } },
    docs: {
      description: {
        story:
          "The same inbox as a header menu, using the library's own `NotificationCenter` — a bell with an unread badge opening a popover. Reach for this when the inbox is a header affordance; reach for the panel above when it is a page of its own. The play function opens the menu so the popover is inside the accessibility scan rather than sitting closed and untested.",
      },
    },
  },
  render: () => {
    const [items, setItems] = React.useState(
      INBOX.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.detail,
        time: item.time,
        variant: item.tone,
        read: item.read,
      })),
    );
    return (
      <div className="flex h-40 w-full items-start justify-end">
        <NotificationCenter
          items={items}
          onMarkAllRead={() => setItems((current) => current.map((i) => ({ ...i, read: true })))}
          onDismiss={(id) => setItems((current) => current.filter((i) => i.id !== id))}
        />
      </div>
    );
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: /notifications/i }));
    await waitFor(() => expect(screen.getByRole("feed")).toBeVisible());
  },
};
