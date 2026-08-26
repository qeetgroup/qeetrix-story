import { TimeSince } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof TimeSince> = {
  title: "Components/Data Display/TimeSince",
  component: TimeSince,
  parameters: {
    qeetrix: qx({ category: "data-display", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          'Renders a self-updating relative timestamp (`<time>`) — "just now", "3 hours ago", "yesterday" — with a hover tooltip showing the absolute date. Values older than `absoluteAfterDays` (default 30) switch to an absolute locale date. Use it for log event timestamps in qeet-logs, API key creation dates in Qeet ID, and activity feeds in qeet-people.',
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof TimeSince>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Hover any timestamp to see the absolute date in a native tooltip — the `<time dateTime>` attribute keeps it accessible to screen readers.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-2 text-sm">
      <div className="flex items-center justify-between gap-8 rounded-md border px-3 py-2">
        <span className="font-medium">
          API key <code className="font-mono text-xs">sk_live_8xQ…</code> created
        </span>
        <TimeSince value={new Date(Date.now() - 42_000).toISOString()} />
      </div>
      <div className="flex items-center justify-between gap-8 rounded-md border px-3 py-2">
        <span className="font-medium">Last passkey sign-in</span>
        <TimeSince value={new Date(Date.now() - 3 * 3600_000).toISOString()} />
      </div>
      <div className="flex items-center justify-between gap-8 rounded-md border px-3 py-2">
        <span className="font-medium">Webhook endpoint verified</span>
        <TimeSince value={new Date(Date.now() - 2 * 86_400_000).toISOString()} />
      </div>
    </div>
  ),
};

export const AbsoluteDate: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Values older than `absoluteAfterDays` render as a locale date instead of a relative phrase — avoids confusing "31 days ago" labels.',
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">Org created</span>
      <TimeSince value={new Date("2025-11-03T09:00:00Z")} absoluteAfterDays={30} />
    </div>
  ),
};
